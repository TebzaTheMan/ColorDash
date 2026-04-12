using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Domain;
using ColorDash.Api.Models;
using ColorDash.Api.Models.Requests;
using ColorDash.Api.Models.Responses;
using Microsoft.Extensions.Options;

namespace ColorDash.Api.Services;

public interface IGameService
{
    Task<GameStartedResponse> StartGameAsync(StartGameRequest request, Guid deviceId);
    Task<GuessResultResponse> ProcessGuessAsync(Guid sessionId, GuessRequest request, Guid deviceId);
    Task<EndGameResponse> EndGameAsync(Guid sessionId, Guid deviceId);
}
public class GameService(
    ISessionRepository sessions,
    IHighscoreRepository highscores,
    IColorService colorService,
    IOptions<GameSettings> options) : IGameService
{
    private readonly GameSettings _settings = options.Value;
    public async Task<GameStartedResponse> StartGameAsync(StartGameRequest request, Guid deviceId)
    {
        var colors = colorService.GenerateColors(request.Mode);
        var correctIndex = colorService.PickCorrectIndex(colors);
        var now = DateTime.UtcNow;

        var session = new GameSession
        {
            Id = Guid.NewGuid(),
            DeviceId = deviceId,
            Mode = request.Mode,
            CorrectIndex = correctIndex,
            CurrentColors = colors,
            TriesLeft = _settings.DefaultTries,
            Status = SessionStatus.Active,
            StartedAt = now,
            ExpiresAt = now.AddSeconds(_settings.GameDurationSeconds),
        };

        await sessions.AddAsync(session);
        await sessions.SaveChangesAsync();

        return new GameStartedResponse(
            SessionId: session.Id,
            Mode: session.Mode,
            Colors: session.CurrentColors,
            TargetLabel: colors[correctIndex],
            TriesLeft: session.TriesLeft,
            StartedAt: session.StartedAt,
            ExpiresAt: session.ExpiresAt);
    }

    public async Task<GuessResultResponse> ProcessGuessAsync(Guid sessionId, GuessRequest request, Guid deviceId)
    {
        var session = await GetActiveSessionAsync(sessionId, deviceId);

        bool correct = request.ColorIndex == session.CorrectIndex;
        GuessResult result;

        if (correct)
        {
            var points = _settings.ScoringRules.First(r => r.TriesLeft == session.TriesLeft).Points;

            session.ScorePoints += points;
            session.ScoreTotal += _settings.MaxPointsPerRound;
            session.CorrectCount++;
            session.TriesLeft = _settings.DefaultTries;

            var nextColors = colorService.GenerateColors(session.Mode);
            var nextIndex = colorService.PickCorrectIndex(nextColors);
            session.CurrentColors = nextColors;
            session.CorrectIndex = nextIndex;

            result = GuessResult.Correct;
        }
        else
        {
            session.TriesLeft--;
            result = session.TriesLeft > 0 ? GuessResult.WrongButContinue : GuessResult.WrongAndExhausted;

            if (session.TriesLeft == 0)
            {
                session.TriesLeft = _settings.DefaultTries;
                var nextColors = colorService.GenerateColors(session.Mode);
                var nextIndex = colorService.PickCorrectIndex(nextColors);
                session.CurrentColors = nextColors;
                session.CorrectIndex = nextIndex;
            }
        }

        await sessions.SaveChangesAsync();

        bool advancedRound = result is GuessResult.Correct or GuessResult.WrongAndExhausted;

        return new GuessResultResponse(
            Result: result,
            Score: new ScoreDto(session.ScorePoints, session.ScoreTotal),
            TriesLeft: session.TriesLeft,
            GameOver: false,
            NextColors: advancedRound ? session.CurrentColors : null,
            NextTargetLabel: advancedRound
                ? session.CurrentColors[session.CorrectIndex]
                : null);
    }

    public async Task<EndGameResponse> EndGameAsync(Guid sessionId, Guid deviceId)
    {
        var session = await GetActiveSessionAsync(sessionId, deviceId);

        var tolerance = TimeSpan.FromSeconds(_settings.ExpiryToleranceSeconds);
        if (DateTime.UtcNow > session.ExpiresAt.Add(tolerance))
            throw new InvalidOperationException("Session has expired.");

        session.Status = SessionStatus.Completed;
        session.EndedAt = DateTime.UtcNow;

        var existing = await highscores.GetByDeviceAndModeAsync(deviceId, session.Mode);
        bool isNewHighscore = session.ScorePoints > (existing?.Points ?? 0);

        if (isNewHighscore)
        {
            if (existing is null)
            {
                await highscores.AddAsync(new Highscore
                {
                    Id = Guid.NewGuid(),
                    DeviceId = deviceId,
                    Mode = session.Mode,
                    Points = session.ScorePoints,
                    Total = session.ScoreTotal,
                    AchievedAt = DateTime.UtcNow,
                    SessionId = session.Id,
                });
            }
            else
            {
                existing.Points = session.ScorePoints;
                existing.Total = session.ScoreTotal;
                existing.AchievedAt = DateTime.UtcNow;
                existing.SessionId = session.Id;
            }

            await highscores.SaveChangesAsync();
        }

        await sessions.SaveChangesAsync();

        var highscore = isNewHighscore
            ? new ScoreDto(session.ScorePoints, session.ScoreTotal)
            : existing is not null
                ? new ScoreDto(existing.Points, existing.Total)
                : new ScoreDto(0, 0);

        return new EndGameResponse(
            FinalScore: new ScoreDto(session.ScorePoints, session.ScoreTotal),
            IsNewHighscore: isNewHighscore,
            Highscore: highscore,
            SessionDurationMs: (long)(session.EndedAt.Value - session.StartedAt).TotalMilliseconds);
    }

    private async Task<GameSession> GetActiveSessionAsync(Guid sessionId, Guid deviceId)
    {
        var session = await sessions.GetByIdAsync(sessionId)
            ?? throw new KeyNotFoundException("Session not found.");

        if (session.DeviceId != deviceId)
            throw new UnauthorizedAccessException("Session not found.");

        if (session.Status != SessionStatus.Active)
            throw new InvalidOperationException("Session is no longer active.");

        if (DateTime.UtcNow > session.ExpiresAt)
        {
            session.Status = SessionStatus.Expired;
            await sessions.SaveChangesAsync();
            throw new InvalidOperationException("Session has expired.");
        }

        return session;
    }
}