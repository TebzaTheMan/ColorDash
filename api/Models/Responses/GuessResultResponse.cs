using ColorDash.Api.Domain;

namespace ColorDash.Api.Models.Responses;

public record GuessResultResponse(
    GuessResult Result,
    ScoreDto Score,
    int TriesLeft,
    bool GameOver,
    string[]? NextColors,
    string? NextTargetLabel);