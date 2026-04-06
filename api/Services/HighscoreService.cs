using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Models.Responses;

namespace ColorDash.Api.Services;

public interface IHighscoreService
{
    Task<HighscoresResponse> GetHighscoresAsync(Guid deviceId);
}
public class HighscoreService(IHighscoreRepository highscores) : IHighscoreService
{
    public async Task<HighscoresResponse> GetHighscoresAsync(Guid deviceId)
    {
        var scores = (await highscores.GetAllByDeviceAsync(deviceId))
            .ToDictionary(h => h.Mode);

        scores.TryGetValue("rgb", out var rgb);
        scores.TryGetValue("hsl", out var hsl);

        return new HighscoresResponse(
            Rgb: rgb is not null ? new ScoreDto(rgb.Points, rgb.Total) : null,
            Hsl: hsl is not null ? new ScoreDto(hsl.Points, hsl.Total) : null);
    }
}