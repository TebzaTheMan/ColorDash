namespace ColorDash.Api.Models.Responses;

public record GuessResultResponse(
    string Result,
    ScoreDto Score,
    int TriesLeft,
    bool GameOver,
    string[]? NextColors,
    string? NextTargetLabel);