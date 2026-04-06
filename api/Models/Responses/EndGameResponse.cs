namespace ColorDash.Api.Models.Responses;

public record EndGameResponse(
    ScoreDto FinalScore,
    bool IsNewHighscore,
    ScoreDto Highscore,
    long SessionDurationMs);