using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Domain;
using ColorDash.Api.Models.Responses;

namespace ColorDash.Api.Services;

public interface IHighscoreService
{
    Task<Dictionary<GameMode, ScoreDto>> GetHighscoresAsync(Guid deviceId);
}
public class HighscoreService(IHighscoreRepository highscores) : IHighscoreService
{
    public async Task<Dictionary<GameMode, ScoreDto>> GetHighscoresAsync(Guid deviceId)
    {
        return (await highscores.GetAllByDeviceAsync(deviceId))
            .ToDictionary(
                h => h.Mode,
                h => new ScoreDto(h.Points, h.Total)
            );
    }
}