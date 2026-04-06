namespace ColorDash.Api.Domain;

public class Highscore
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public GameMode Mode { get; set; }
    public int Points { get; set; }
    public int Total { get; set; }
    public DateTime AchievedAt { get; set; }

    public Guid SessionId { get; set; }
    public GameSession Session { get; set; } = null!;
}