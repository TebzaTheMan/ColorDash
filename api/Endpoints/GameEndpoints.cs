using ColorDash.Api.Models.Requests;
using ColorDash.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ColorDash.Api.Endpoints;

public static class GameEndpoints
{
    public static void MapGameEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/game");

        group.MapPost("/start", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            StartGameRequest request,
            HttpContext http,
            IGameService gameService) =>
        {
            var response = await gameService.StartGameAsync(request, deviceId.Value);
            return Results.Created($"/game/{response.SessionId}", response);
        });

        group.MapPost("/{sessionId:guid}/guess", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            Guid sessionId,
            GuessRequest request,
            HttpContext http,
            IGameService gameService) =>
        {
            var response = await gameService.ProcessGuessAsync(sessionId, request, deviceId.Value);
            return Results.Ok(response);
        });

        group.MapPost("/{sessionId:guid}/end", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            Guid sessionId,
            HttpContext http,
            IGameService gameService) =>
        {
            var response = await gameService.EndGameAsync(sessionId, deviceId.Value);
            return Results.Ok(response);
        });
    }
}