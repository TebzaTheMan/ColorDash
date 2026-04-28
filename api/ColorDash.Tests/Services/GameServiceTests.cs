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

        var (response, isNew) = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid(), null);

        Assert.Equal(colors, response.Colors);
        Assert.Equal(colors[1], response.TargetLabel);
        Assert.Equal(GameMode.Rgb, response.Mode);
        Assert.Equal(_settings.DefaultTries, response.TriesLeft);
        Assert.True(isNew);
    }

    [Fact]
    public async Task StartGame_PersistsSession()
    {
        var service = CreateService();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(SomeColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid(), null);

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
        var (response, _) = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid(), null);
        var after = DateTime.UtcNow;

        Assert.InRange(response.ExpiresAt,
            before.AddSeconds(_settings.GameDurationSeconds),
            after.AddSeconds(_settings.GameDurationSeconds));
    }

    [Fact]
    public async Task StartGame_NoIdempotencyKey_DoesNotLookupExisting()
    {
        var service = CreateService();
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(SomeColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), Guid.NewGuid(), null);

        await _sessions.DidNotReceive().GetByStartIdempotencyKeyAsync(Arg.Any<Guid>(), Arg.Any<string>());
    }

    [Fact]
    public async Task StartGame_WithIdempotencyKey_NoExistingSession_CreatesNewAndPersistsKey()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        const string key = "abc-123";
        _sessions.GetByStartIdempotencyKeyAsync(deviceId, key).Returns((GameSession?)null);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(SomeColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        GameSession? captured = null;
        await _sessions.AddAsync(Arg.Do<GameSession>(s => captured = s));

        var (_, isNew) = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), deviceId, key);

        Assert.True(isNew);
        Assert.NotNull(captured);
        Assert.Equal(key, captured!.StartIdempotencyKey);
        await _sessions.Received(1).AddAsync(Arg.Any<GameSession>());
    }

    [Fact]
    public async Task StartGame_WithIdempotencyKey_ExistingSession_ReturnsExistingWithoutCreating()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        const string key = "abc-123";
        var existing = ActiveSession(deviceId);
        existing.CurrentColors = SomeColors();
        existing.CorrectIndex = 4;
        existing.StartIdempotencyKey = key;
        _sessions.GetByStartIdempotencyKeyAsync(deviceId, key).Returns(existing);

        var (response, isNew) = await service.StartGameAsync(new StartGameRequest(GameMode.Rgb), deviceId, key);

        Assert.False(isNew);
        Assert.Equal(existing.Id, response.SessionId);
        Assert.Equal(existing.CurrentColors, response.Colors);
        Assert.Equal(existing.CurrentColors[existing.CorrectIndex], response.TargetLabel);
        await _sessions.DidNotReceive().AddAsync(Arg.Any<GameSession>());
        await _sessions.DidNotReceive().SaveChangesAsync();
        _colorService.DidNotReceive().GenerateColors(Arg.Any<GameMode>());
    }

    // --- GetActiveSessionAsync (exercised via ProcessGuessAsync) ---

    [Fact]
    public async Task ProcessGuess_SessionNotFound_ThrowsKeyNotFoundException()
    {
        var service = CreateService();
        _sessions.GetByIdAsync(Arg.Any<Guid>()).Returns((GameSession?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.ProcessGuessAsync(Guid.NewGuid(), new GuessRequest(0), Guid.NewGuid(), null));
    }

    [Fact]
    public async Task ProcessGuess_WrongDevice_ThrowsUnauthorizedAccessException()
    {
        var service = CreateService();
        var session = ActiveSession(Guid.NewGuid());
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), Guid.NewGuid(), null));
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
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, null));
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
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, null));

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
            service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, null));

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

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, null);

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

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, null);

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

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, null);

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

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, null);

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

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, null);

        Assert.Equal(GuessResult.WrongAndExhausted, result.Result);
        Assert.Equal(_settings.DefaultTries, result.TriesLeft);
        Assert.Equal(next, result.NextColors);
        Assert.Equal(next[0], result.NextTargetLabel);
    }

    // --- ProcessGuessAsync: idempotency ---

    [Fact]
    public async Task ProcessGuess_RepeatedIdempotencyKey_ReturnsCachedResponseWithoutMutating()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        const string key = "guess-key-1";
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        var cached = new GuessResultResponse(
            Result: GuessResult.Correct,
            Score: new ScoreDto(10, 10),
            TriesLeft: 3,
            GameOver: false,
            NextColors: NextColors(),
            NextTargetLabel: NextColors()[0]);
        session.LastGuessIdempotencyKey = key;
        session.LastGuessResponseJson = System.Text.Json.JsonSerializer.Serialize(cached);
        var triesBefore = session.TriesLeft;
        var pointsBefore = session.ScorePoints;
        _sessions.GetByIdAsync(session.Id).Returns(session);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(0), deviceId, key);

        Assert.Equal(cached.Result, result.Result);
        Assert.Equal(cached.Score, result.Score);
        Assert.Equal(triesBefore, session.TriesLeft);
        Assert.Equal(pointsBefore, session.ScorePoints);
        await _sessions.DidNotReceive().SaveChangesAsync();
        _colorService.DidNotReceive().GenerateColors(Arg.Any<GameMode>());
    }

    [Fact]
    public async Task ProcessGuess_NewIdempotencyKey_CachesResponseOnSession()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        const string key = "guess-key-2";
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(NextColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, key);

        Assert.Equal(key, session.LastGuessIdempotencyKey);
        Assert.NotNull(session.LastGuessResponseJson);
        var cached = System.Text.Json.JsonSerializer.Deserialize<GuessResultResponse>(session.LastGuessResponseJson!);
        Assert.Equal(result.Result, cached!.Result);
        Assert.Equal(result.Score, cached.Score);
    }

    [Fact]
    public async Task ProcessGuess_NoIdempotencyKey_DoesNotCacheResponse()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(NextColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, null);

        Assert.Null(session.LastGuessIdempotencyKey);
        Assert.Null(session.LastGuessResponseJson);
    }

    [Fact]
    public async Task ProcessGuess_DifferentIdempotencyKey_ProcessesNormallyAndOverwritesCache()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId, triesLeft: 3, correctIndex: 2);
        session.LastGuessIdempotencyKey = "old-key";
        session.LastGuessResponseJson = "{\"stale\":true}";
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _colorService.GenerateColors(Arg.Any<GameMode>()).Returns(NextColors());
        _colorService.PickCorrectIndex(Arg.Any<string[]>()).Returns(0);

        var result = await service.ProcessGuessAsync(session.Id, new GuessRequest(2), deviceId, "new-key");

        Assert.Equal(GuessResult.Correct, result.Result);
        Assert.Equal("new-key", session.LastGuessIdempotencyKey);
        Assert.NotEqual("{\"stale\":true}", session.LastGuessResponseJson);
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
        session.ScoreTotal = 20;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns((Highscore?)null);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.True(result.IsNewHighscore);
        await _highscores.Received(1).AddAsync(Arg.Any<Highscore>());
        await _sessions.Received().SaveChangesAsync();
    }

    [Fact]
    public async Task EndGame_BetterScore_UpdatesExistingHighscore()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 30;
        session.ScoreTotal = 30; // 100% > existing 40%
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
        session.ScoreTotal = 50; // 20% < existing 50%
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var existing = new Highscore { Points = 50, Total = 100 };
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns(existing);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.False(result.IsNewHighscore);
        Assert.Equal(new ScoreDto(50, 100), result.Highscore);
        Assert.Equal(50, existing.Points);
        Assert.Equal(100, existing.Total);
        await _highscores.DidNotReceive().AddAsync(Arg.Any<Highscore>());
    }

    [Fact]
    public async Task EndGame_HigherRatioWithLowerRawPoints_IsNewHighscore()
    {
        // 25/40 = 62.5% beats stored 30/100 = 30%, even though raw points are lower.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 25;
        session.ScoreTotal = 40;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var existing = new Highscore { Points = 30, Total = 100 };
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns(existing);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.True(result.IsNewHighscore);
        Assert.Equal(25, existing.Points);
        Assert.Equal(40, existing.Total);
    }

    [Fact]
    public async Task EndGame_LowerRatioWithHigherRawPoints_IsNotNewHighscore()
    {
        // 6/60 = 10% does not beat stored 5/10 = 50%, even though raw points are higher.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 6;
        session.ScoreTotal = 60;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        var existing = new Highscore { Points = 5, Total = 10 };
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns(existing);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.False(result.IsNewHighscore);
        Assert.Equal(new ScoreDto(5, 10), result.Highscore);
        Assert.Equal(5, existing.Points);
        Assert.Equal(10, existing.Total);
        await _highscores.DidNotReceive().AddAsync(Arg.Any<Highscore>());
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

    // --- EndGameAsync: idempotency ---

    [Fact]
    public async Task EndGame_CachesResponseOnSession()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.ScorePoints = 15;
        session.ScoreTotal = 30;
        _sessions.GetByIdAsync(session.Id).Returns(session);
        _highscores.GetByDeviceAndModeAsync(deviceId, session.Mode).Returns((Highscore?)null);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.NotNull(session.EndResponseJson);
        var cached = System.Text.Json.JsonSerializer.Deserialize<EndGameResponse>(session.EndResponseJson!);
        Assert.Equal(result.IsNewHighscore, cached!.IsNewHighscore);
        Assert.Equal(result.FinalScore, cached.FinalScore);
        Assert.Equal(result.Highscore, cached.Highscore);
    }

    [Fact]
    public async Task EndGame_AlreadyCompletedWithCachedResponse_ReturnsCachedResponse()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.Status = SessionStatus.Completed;
        var cachedResponse = new EndGameResponse(
            FinalScore: new ScoreDto(40, 50),
            IsNewHighscore: true,
            Highscore: new ScoreDto(40, 50),
            SessionDurationMs: 12_345);
        session.EndResponseJson = System.Text.Json.JsonSerializer.Serialize(cachedResponse);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.Equal(cachedResponse, result);
        await _highscores.DidNotReceive().GetByDeviceAndModeAsync(Arg.Any<Guid>(), Arg.Any<GameMode>());
        await _highscores.DidNotReceive().AddAsync(Arg.Any<Highscore>());
        await _sessions.DidNotReceive().SaveChangesAsync();
    }

    [Fact]
    public async Task EndGame_AlreadyCompletedReplaySkipsExpiryCheck()
    {
        // A completed session whose ExpiresAt is far in the past must still replay
        // its cached response — replay must short-circuit before the expiry check.
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        var session = ActiveSession(deviceId);
        session.Status = SessionStatus.Completed;
        session.ExpiresAt = DateTime.UtcNow.AddMinutes(-5);
        var cachedResponse = new EndGameResponse(
            FinalScore: new ScoreDto(10, 20),
            IsNewHighscore: false,
            Highscore: new ScoreDto(20, 20),
            SessionDurationMs: 9_999);
        session.EndResponseJson = System.Text.Json.JsonSerializer.Serialize(cachedResponse);
        _sessions.GetByIdAsync(session.Id).Returns(session);

        var result = await service.EndGameAsync(session.Id, deviceId);

        Assert.Equal(cachedResponse, result);
    }

    [Fact]
    public async Task EndGame_WrongDevice_ThrowsUnauthorizedAccessException()
    {
        var service = CreateService();
        var session = ActiveSession(Guid.NewGuid());
        _sessions.GetByIdAsync(session.Id).Returns(session);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.EndGameAsync(session.Id, Guid.NewGuid()));
    }

    [Fact]
    public async Task EndGame_SessionNotFound_ThrowsKeyNotFoundException()
    {
        var service = CreateService();
        _sessions.GetByIdAsync(Arg.Any<Guid>()).Returns((GameSession?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.EndGameAsync(Guid.NewGuid(), Guid.NewGuid()));
    }
}
