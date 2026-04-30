using ColorDash.Api.Models.Requests;
using ColorDash.Api.Models.Responses;
using ColorDash.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ColorDash.Api.Endpoints;

public static class HighscoreEndpoints
{
    public static void MapHighscoreEndpoints(this WebApplication app)
    {
        app.MapGet("/highscores", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            IHighscoreService highscoreService) =>
        {
            var response = await highscoreService.GetHighscoresAsync(deviceId.Value);
            return Results.Ok(response);
        })
        .WithName("GetHighscores")
        .WithSummary("Get device highscores")
        .WithDescription("Returns the best recorded score per game mode for the given device. Modes never played are omitted. Requires X-Device-ID header.")
        .Produces<Dictionary<string, ScoreDto>>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest);
    }
}
