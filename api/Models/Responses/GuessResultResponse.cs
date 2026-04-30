using ColorDash.Api.Domain;

namespace ColorDash.Api.Models.Responses;

public record GuessResultResponse(
    GuessResult Result,
    ScoreDto Score,
    int TriesLeft,
    string[]? NextColors,
    string? NextTargetLabel);