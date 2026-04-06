namespace ColorDash.Api.Domain;

public class GameSession
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public string Mode { get; set; } = null!;
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

    public Highscore? Highscore { get; set; }
}

public enum SessionStatus { Active, Completed, Expired }