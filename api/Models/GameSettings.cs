namespace ColorDash.Api.Models;

public class GameSettings
{
    public int NumColors { get; set; }
    public int GameDurationSeconds { get; set; }
    public int DefaultTries { get; set; }
    public int MaxPointsPerRound { get; set; }
    public int ExpiryToleranceSeconds { get; set; }
    public ScoringRule[] ScoringRules { get; set; } = [];
}

public class ScoringRule
{
    public int TriesLeft { get; set; }
    public int Points { get; set; }
}