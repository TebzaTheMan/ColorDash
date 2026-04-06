namespace ColorDash.Api.Domain;

public class Highscore
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public string Mode { get; set; } = null!;
    public int Points { get; set; }
    public int Total { get; set; }
    public DateTime AchievedAt { get; set; }

    public Guid SessionId { get; set; }
    public GameSession Session { get; set; } = null!;
}