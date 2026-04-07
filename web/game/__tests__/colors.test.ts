import { describe, it, expect } from "vitest";
import {
  getRgbColor,
  getHslColor,
  generateColors,
  pickCorrectColor,
} from "../colors";
import { NUM_COLORS } from "../constants";

describe("getRgbColor", () => {
  it("should return a valid RGB string when called", () => {
    const color = getRgbColor();
    expect(color).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
  });

  it("should return RGB values within the range 0 to 255", () => {
    const color = getRgbColor();
    const matches = color.match(/\d+/g)!;
    const values = matches.map(Number);

    values.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    });
  });
});

describe("getHslColor", () => {
  it("should return a valid HSL string when called", () => {
    const color = getHslColor();
    expect(color).toMatch(/^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/);
  });

  it("should return a hue value between 0 and 360", () => {
    const color = getHslColor();
    const hue = Number(color.match(/\d+/)![0]);

    expect(hue).toBeGreaterThanOrEqual(0);
    expect(hue).toBeLessThanOrEqual(360);
  });

  it("should return a saturation value between 0 and 100", () => {
    const color = getHslColor();
    const saturation = Number(color.match(/\d+%/g)![0].replace("%", ""));

    expect(saturation).toBeGreaterThanOrEqual(0);
    expect(saturation).toBeLessThanOrEqual(100);
  });
});

describe("generateColors", () => {
  it("should return the correct number of colors when using RGB mode", () => {
    const colors = generateColors("rgb");
    expect(colors).toHaveLength(NUM_COLORS);
  });

  it("should return the correct number of colors when using HSL mode", () => {
    const colors = generateColors("hsl");
    expect(colors).toHaveLength(NUM_COLORS);
  });

  it("should return only RGB formatted colors when using RGB mode", () => {
    const colors = generateColors("rgb");

    colors.forEach((color) => {
      expect(color).toMatch(/^rgb\(/);
    });
  });

  it("should return only HSL formatted colors when using HSL mode", () => {
    const colors = generateColors("hsl");

    colors.forEach((color) => {
      expect(color).toMatch(/^hsl\(/);
    });
  });
});

describe("pickCorrectColor", () => {
  it("should return a color from the provided array", () => {
    const colors = ["rgb(0, 0, 0)", "rgb(255, 255, 255)", "rgb(128, 128, 128)"];

    const picked = pickCorrectColor(colors);

    expect(colors).toContain(picked);
  });

  it("should return the only color when the array contains a single value", () => {
    const colors = ["rgb(42, 42, 42)"];

    expect(pickCorrectColor(colors)).toBe("rgb(42, 42, 42)");
  });
});
