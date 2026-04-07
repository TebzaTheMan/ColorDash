using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Domain;
using ColorDash.Api.Models.Responses;
using ColorDash.Api.Services;
using NSubstitute;
using Xunit;

namespace ColorDash.Tests.Services;

public class HighscoreServiceTests
{
    private readonly IHighscoreRepository _highscores = Substitute.For<IHighscoreRepository>();

    private HighscoreService CreateService() => new(_highscores);

    [Fact]
    public async Task GetHighscores_ReturnsEmptyDictionary_WhenNoHighscoresExist()
    {
        var service = CreateService();
        _highscores.GetAllByDeviceAsync(Arg.Any<Guid>()).Returns([]);

        var result = await service.GetHighscoresAsync(Guid.NewGuid());

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetHighscores_MapsHighscoresToScoreDtoByMode()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        _highscores.GetAllByDeviceAsync(deviceId).Returns(
        [
            new Highscore { DeviceId = deviceId, Mode = GameMode.Rgb, Points = 30, Total = 50 },
            new Highscore { DeviceId = deviceId, Mode = GameMode.Hsl, Points = 20, Total = 40 },
        ]);

        var result = await service.GetHighscoresAsync(deviceId);

        Assert.Equal(2, result.Count);
        Assert.Equal(new ScoreDto(30, 50), result[GameMode.Rgb]);
        Assert.Equal(new ScoreDto(20, 40), result[GameMode.Hsl]);
    }

    [Fact]
    public async Task GetHighscores_UsesDeviceIdToQueryRepository()
    {
        var service = CreateService();
        var deviceId = Guid.NewGuid();
        _highscores.GetAllByDeviceAsync(deviceId).Returns([]);

        await service.GetHighscoresAsync(deviceId);

        await _highscores.Received(1).GetAllByDeviceAsync(deviceId);
    }
}
