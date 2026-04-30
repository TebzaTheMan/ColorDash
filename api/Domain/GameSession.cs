namespace ColorDash.Api.Domain;

public class GameSession
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public GameMode Mode { get; set; }
    public int CorrectIndex { get; set; }
    public string[] CurrentColors { get; set; } = [];
    public int ScorePoints { get; set; }
    public int ScoreTotal { get; set; }
    public int CorrectCount { get; set; }
    public int TriesLeft { get; set; }
    public SessionStatus Status { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? EndedAt { get; set; }

    public string? StartIdempotencyKey { get; set; }
    public string? LastGuessIdempotencyKey { get; set; }
    public string? LastGuessResponseJson { get; set; }
    public string? EndResponseJson { get; set; }

    public Highscore? Highscore { get; set; }
}

public enum SessionStatus { Active, Completed, Expired }