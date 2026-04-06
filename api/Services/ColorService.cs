using ColorDash.Api.Models;
using Microsoft.Extensions.Options;

namespace ColorDash.Api.Services;

public interface IColorService
{
    string[] GenerateColors(string mode);
    int PickCorrectIndex(string[] colors);
}

public class ColorService(IOptions<GameSettings> options) : IColorService
{
    private readonly GameSettings _settings = options.Value;
    private static readonly Random Rng = Random.Shared;

    public string[] GenerateColors(string mode)
    {
        var generator = mode == "hsl" ? GetHslColor : (Func<string>)GetRgbColor;
        return [.. Enumerable.Range(0, _settings.NumColors).Select(_ => generator())];
    }

    public int PickCorrectIndex(string[] colors) =>
        Rng.Next(colors.Length);

    private static string GetRgbColor()
    {
        int r = Rng.Next(256);
        int g = Rng.Next(256);
        int b = Rng.Next(256);
        return $"rgb({r}, {g}, {b})";
    }

    private static string GetHslColor()
    {
        int h = Rng.Next(361);
        int s = Rng.Next(101);
        int l = Rng.Next(101);
        return $"hsl({h}, {s}%, {l}%)";
    }
}