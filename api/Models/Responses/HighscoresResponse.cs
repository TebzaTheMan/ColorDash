namespace ColorDash.Api.Models.Responses;

public record HighscoresResponse(
    ScoreDto? Rgb,
    ScoreDto? Hsl);