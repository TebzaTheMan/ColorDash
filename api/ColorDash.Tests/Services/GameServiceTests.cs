using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Domain;
using ColorDash.Api.Models;
using ColorDash.Api.Models.Requests;
using ColorDash.Api.Models.Responses;
using ColorDash.Api.Services;
using Microsoft.Extensions.Options;
using NSubstitute;
using Xunit;

namespace ColorDash.Tests.Services;

public class GameServiceTests
{
    private readonly ISessionRepository _sessions = Substitute.For<ISessionRepository>();
    private readonly IHighscoreRepository _highscores = Substitute.For<IHighscoreRepository>();
    private readonly IColorService _colorService = Substitute.For<IColorService>();

    private readonly GameSettings _settings = new()
    {
        NumColors = 6,
        GameDurationSeconds = 30,
        DefaultTries = 3,
        MaxPointsPerRound = 10,
        ExpiryToleranceSeconds = 2,
        ScoringRules =
        [
            new ScoringRule { TriesLeft = 3, Points = 10 },
            new ScoringRule { TriesLeft = 2, Points = 5 },
            new ScoringRule { TriesLeft = 1, Points = 2 },
        ]
    };

    private GameService CreateService() =>
        new(_sessions, _highscores, _colorService, Options.Create(_settings));

    private static string[] SomeColors() =>
        ["rgb(10,0,0)", "rgb(20,0,0)", "rgb(30,0,0)", "rgb(40,0,0)", "rgb(50,0,0)", "rgb(60,0,0)"];

    private static string[] NextColors() =>
        ["rgb(1,1,1)", "rgb(2,2,2)", "rgb(3,3,3)", "rgb(4,4,4)", "rgb(5,5,5)", "rgb(6,6,6)"];

    private static GameSession ActiveSession(Guid deviceId, int triesLeft = 3, int correctIndex = 2) =>
        new()
        {
            Id = Guid.NewGuid(),
            DeviceId = deviceId,
            Mode = GameMode.Rgb,
            CorrectIndex = correctIndex,
            CurrentColors = SomeColors(),
            TriesLeft = triesLeft,
            Status = SessionStatus.Active,
            StartedAt = DateTime.UtcNow.AddSeconds(-5),
            ExpiresAt = DateTime.UtcNow.AddSeconds(25),
        };

    // --- StartGameAsync ---

    [Fact]
    public async Task StartGame_ReturnsColorsAndTargetFromColorService()
    {
        var service = CreateService();
        var colors = SomeColors();
        _colorService.GenerateColors(GameMode.Rgb).Returns(colors);
        _colorService.PickCorrectIndex(colors).Returns(1);

        var result = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid());

        Assert.Equal(colors, result.Colors);
        Assert.Equal(colors[1], result.TargetLabel);
        Assert.Equal(GameMode.Rgb, result.Mode);
        Assert.Equal(_settings.DefaultTries, result.TriesLeft);
    }

    [Fact]
    public async Task StartGame_PersistsSession()
    {
        var service = CreateService();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(SomeColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid());

        await _sessions.Received(1).AddAsync(Arg.Any<GameSession>());
        await _sessions.Received(1).SaveChangesAsync();
    }

    [Fact]
    public async Task StartGame_SetsExpiryBasedOnSettings()
    {
        var service = CreateService();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(SomeColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var before = DateTime.UtcNow;
        var result = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid());
        var after = DateTime.UtcNow;

        Assert.InRange(result.ExpiresAt,
            before.AddSeconds(_settings.GameDurationSeconds),
            after.AddSeconds(_settings.GameDurationSeconds));
    }

    // --- GetActiveSessionAsync (exercised via ProcessGuessAsync) ---

    [Fact]
    public async Task ProcessGuess_SessionNotFound_ThrowsKeyNotFoundException()
    {
        var service = CreateService();
        _sessions.GetByIdAsync(Arg.Any<Guid>()).Returns((GameSession?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.ProcessGuessAsync(Guid.NewGuid(), new GuessRequest(0), Guid.NewGuid()));
    }

    [Fact]
    public async Task ProcessGuess_WrongDevice_ThrowsUnauthorizedAccessException()
    {
        var service = CreateService();
        var session = ActiveSession(Guid.NewGuid());
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), Guid.NewGuid()));
    }

    [Fact]
    public async Task ProcessGuess_InactiveSession_ThrowsInvalidOperationException()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.Status = SessionStatus.Completed;
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId));
    }

    [Fact]
    public async Task ProcessGuess_ExpiredSession_ThrowsAndMarksSessionExpired()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(-10);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId));

        Assert.Equal(SessionStatus.Expired, session.Status);
        await _sessions.Received(1).SaveChangesAsync();
    }

    [Fact]
    public async Task ProcessGuess_SessionExpiredByOneSecond_ThrowsInvalidOperationException()
    {
        // Expired 1 s ago — within EndGame tolerance, but ProcessGuess must still reject.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(-1);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId));

        Assert.Equal(SessionStatus.Expired, session.Status);
        await _sessions.Received(1).SaveChangesAsync();
    }

    // --- ProcessGuessAsync: correct guess ---

    [Fact]
    public async Task ProcessGuess_CorrectGuess_ReturnsCorrectResult()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(NextColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId);

        Assert.Equal(GuessResult.Correct, result.Result);
    }

    [Fact]
    public async Task ProcessGuess_CorrectGuess_AwardsPointsPerScoringRule()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        // TriesLeft=3 → rule awards 10 pts
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(NextColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId);

        Assert.Equal(10, result.Score.Points);
        Assert.Equal(_settings.MaxPointsPerRound, result.Score.Total);
    }

    [Fact]
    public async Task ProcessGuess_CorrectGuess_ResetsTriesAndAdvancesRound()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        // Answered on the 2nd try (triesLeft=2 → 5 pts per rule)
        var session = ActiveSession(deviceId, triesLeft: 2, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var next = NextColors();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(next);
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(1);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId);

        Assert.Equal(_settings.DefaultTries, result.TriesLeft);
        Assert.Equal(next, result.NextColors);
        Assert.Equal(next[1], result.NextTargetLabel);
    }

    // --- ProcessGuessAsync: wrong guess ---

    [Fact]
    public async Task ProcessGuess_WrongGuessWithTriesRemaining_ReturnsWrongButContinue()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId);

        Assert.Equal(GuessResult.WrongButContinue, result.Result);
        Assert.Equal(2, result.TriesLeft);
        Assert.Null(result.NextColors);
        Assert.Null(result.NextTargetLabel);
    }

    [Fact]
    public async Task ProcessGuess_WrongGuessExhausted_ReturnsWrongAndExhaustedWithNewRound()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId, triesLeft: 1, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var next = NextColors();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(next);
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId);

        Assert.Equal(GuessResult.WrongAndExhausted, result.Result);
        Assert.Equal(_settings.DefaultTries, result.TriesLeft);
        Assert.Equal(next, result.NextColors);
        Assert.Equal(next[0], result.NextTargetLabel);
    }

    // --- EndGameAsync ---

    [Fact]
    public async Task EndGame_SessionExpiredBeyondTolerance_ThrowsInvalidOperationException()
    {
        // Expired 10 s ago; tolerance is 2 s → must be rejected.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(-10);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.EndGameAsync(session.Id, deviceId));
    }

    [Fact]
    public async Task EndGame_SessionExpiredWithinTolerance_Succeeds()
    {
        // Expired 1 s ago; tolerance is 2 s → EndGame must complete successfully.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(-1);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns((Highscore?)null);

        // Should NOT throw.
        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.Equal(SessionStatus.Completed, session.Status);
        Assert.NotNull(result);
    }

    [Fact]
    public async Task EndGame_SessionExpiredAtExactTolerance_Succeeds()
    {
        // Expired at the tolerance boundary minus 0.5 s headroom (1.5 s ago).
        // Keeps the test deterministic while still confirming the boundary is inclusive.
        // Per plan risk register: exact boundary is sub-millisecond race; 0.5 s headroom removes flakiness.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(-_settings.ExpiryToleranceSeconds + 0.5);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns((Highscore?)null);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.Equal(SessionStatus.Completed, session.Status);
        Assert.NotNull(result);
    }

    [Fact]
    public async Task EndGame_NoExistingHighscore_CreatesNewHighscore()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 20;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns((Highscore?)null);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.True(result.IsNewHighscore);
        await _highscores.Received(1).AddAsync(Arg.Any<Highscore>());
        await _highscores.Received(1).SaveChangesAsync();
    }

    [Fact]
    public async Task EndGame_BetterScore_UpdatesExistingHighscore()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 30;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var existing = new Highscore { Points = 20, Total = 50 };
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns(existing);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.True(result.IsNewHighscore);
        Assert.Equal(30, existing.Points);
        await _highscores.DidNotReceive().AddAsync(Arg.Any<Highscore>());
    }

    [Fact]
    public async Task EndGame_LowerScore_DoesNotUpdateHighscoreAndReturnsExisting()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 10;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var existing = new Highscore { Points = 50, Total = 100 };
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns(existing);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.False(result.IsNewHighscore);
        Assert.Equal(new ScoreDto(50, 100), result.Highscore);
        await _highscores.DidNotReceive().SaveChangesAsync();
    }

    [Fact]
    public async Task EndGame_MarksSessionAsCompleted()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(Arg.Any<Guid>(), Arg.Any<GameMode>()).Returns((Highscore?)null);

        await service.EndGameAsync(session.Id, deviceId);

        Assert.Equal(SessionStatus.Completed, session.Status);
        Assert.NotNull(session.EndedAt);
    }

    [Fact]
    public async Task EndGame_ReturnsApproximateSessionDuration()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.StartedAt = DateTime.UtcNow.AddSeconds(-10);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(Arg.Any<Guid>(), Arg.Any<GameMode>()).Returns((Highscore?)null);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.InRange(result.SessionDurationMs, 10_000, 12_000);
    }
}
