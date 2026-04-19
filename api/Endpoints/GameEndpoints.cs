using ColorDash.Api.Models.Requests;
using ColorDash.Api.Models.Responses;
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
        })
        .WithName("StartGame")
        .WithSummary("Start a new game session")
        .WithDescription("Creates a new active game session for the given device and mode. Returns the initial color set and expiry time.")
        .Produces<GameStartedResponse>(StatusCodes.Status201Created)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest);

        group.MapPost("/{sessionId:guid}/guess", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            Guid sessionId,
            GuessRequest request,
            HttpContext http,
            IGameService gameService) =>
        {
            var response = await gameService.ProcessGuessAsync(sessionId, request, deviceId.Value);
            return Results.Ok(response);
        })
        .WithName("SubmitGuess")
        .WithSummary("Submit a color guess")
        .WithDescription("Submit the index (0–5) of the color block the player selected. Returns result, updated score, and next round data if the round advanced.")
        .Produces<GuessResultResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces<ErrorResponse>(StatusCodes.Status403Forbidden)
        .Produces<ErrorResponse>(StatusCodes.Status404NotFound)
        .Produces<ErrorResponse>(StatusCodes.Status410Gone);

        group.MapPost("/{sessionId:guid}/end", async (
            [FromHeader(Name = "X-Device-ID")] DeviceId deviceId,
            Guid sessionId,
            HttpContext http,
            IGameService gameService) =>
        {
            var response = await gameService.EndGameAsync(sessionId, deviceId.Value);
            return Results.Ok(response);
        })
        .WithName("EndGame")
        .WithSummary("End a game session")
        .WithDescription("End the session early or at expiry. Returns the final score and whether a new highscore was achieved.")
        .Produces<EndGameResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status403Forbidden)
        .Produces<ErrorResponse>(StatusCodes.Status404NotFound)
        .Produces<ErrorResponse>(StatusCodes.Status410Gone);
    }
}
