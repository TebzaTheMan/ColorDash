using ColorDash.Api.Domain;

namespace ColorDash.Api.Models.Responses;

public record GameStartedResponse(
    Guid SessionId,
    GameMode Mode,
    string[] Colors,
    string TargetLabel,
    int TriesLeft,
    DateTime StartedAt,
    DateTime ExpiresAt);