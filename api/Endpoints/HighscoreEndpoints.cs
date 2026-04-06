using ColorDash.Api.Services;

namespace ColorDash.Api.Endpoints;

public static class HighscoreEndpoints
{
    public static void MapHighscoreEndpoints(this WebApplication app)
    {
        app.MapGet("/highscores", async (
            HttpContext http,
            IHighscoreService highscoreService) =>
        {
            var deviceId = GetDeviceId(http);
            if (deviceId is null)
                return Results.BadRequest("X-Device-ID header is missing or invalid.");

            var response = await highscoreService.GetHighscoresAsync(deviceId.Value);
            return Results.Ok(response);
        });
    }

    private static Guid? GetDeviceId(HttpContext http)
    {
        var header = http.Request.Headers["X-Device-ID"].FirstOrDefault();
        return Guid.TryParse(header, out var id) ? id : null;
    }
}