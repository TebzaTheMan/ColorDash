namespace ColorDash.Api.Models.Responses;

public record GameStartedResponse(
    Guid SessionId,
    string Mode,
    string[] Colors,
    string TargetLabel,
    int TriesLeft,
    DateTime StartedAt,
    DateTime ExpiresAt);