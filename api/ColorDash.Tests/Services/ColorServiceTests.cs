using System.Text.RegularExpressions;
using ColorDash.Api.Domain;
using ColorDash.Api.Models;
using ColorDash.Api.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace ColorDash.Tests.Services;

public partial class ColorServiceTests
{
    [GeneratedRegex(@"^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$")]
    private static partial Regex RgbPattern();

    [GeneratedRegex(@"^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$")]
    private static partial Regex HslPattern();

    private static ColorService CreateService(int numColors = 6) =>
        new(Options.Create(new GameSettings { NumColors = numColors }));

    // --- GenerateColors ---

    [Theory]
    [InlineData(1)]
    [InlineData(6)]
    [InlineData(10)]
    public void GenerateColors_ReturnsCorrectCount(int numColors)
    {
        var service = CreateService(numColors);
        var colors = service.GenerateColors(GameMode.Rgb);
        Assert.Equal(numColors, colors.Length);
    }

    [Fact]
    public void GenerateColors_RgbMode_ReturnsValidFormat()
    {
        var service = CreateService();
        var colors = service.GenerateColors(GameMode.Rgb);

        foreach (var color in colors)
        {
            var match = RgbPattern().Match(color);
            Assert.True(match.Success, $"'{color}' is not a valid RGB color string");

            Assert.InRange(int.Parse(match.Groups[1].Value), 0, 255);
            Assert.InRange(int.Parse(match.Groups[2].Value), 0, 255);
            Assert.InRange(int.Parse(match.Groups[3].Value), 0, 255);
        }
    }

    [Fact]
    public void GenerateColors_HslMode_ReturnsValidFormat()
    {
        var service = CreateService();
        var colors = service.GenerateColors(GameMode.Hsl);

        foreach (var color in colors)
        {
            var match = HslPattern().Match(color);
            Assert.True(match.Success, $"'{color}' is not a valid HSL color string");

            Assert.InRange(int.Parse(match.Groups[1].Value), 0, 360);
            Assert.InRange(int.Parse(match.Groups[2].Value), 0, 100);
            Assert.InRange(int.Parse(match.Groups[3].Value), 0, 100);
        }
    }

    [Fact]
    public void GenerateColors_UnknownMode_ThrowsArgumentOutOfRangeException()
    {
        var service = CreateService();
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            service.GenerateColors((GameMode)999));
    }

    // --- PickCorrectIndex ---

    [Fact]
    public void PickCorrectIndex_ReturnsIndexWithinBounds()
    {
        var service = CreateService();
        var colors = new[] { "red", "green", "blue" };

        for (int i = 0; i < 50; i++)
        {
            int index = service.PickCorrectIndex(colors);
            Assert.InRange(index, 0, colors.Length - 1);
        }
    }

    [Fact]
    public void PickCorrectIndex_SingleElement_AlwaysReturnsZero()
    {
        var service = CreateService();
        var colors = new[] { "rgb(0, 0, 0)" };

        for (int i = 0; i < 10; i++)
        {
            Assert.Equal(0, service.PickCorrectIndex(colors));
        }
    }
}
