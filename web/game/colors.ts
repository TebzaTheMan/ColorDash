import { TMode } from "types";
import { NUM_COLORS } from "./constants";

export const getRgbColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export const getHslColor = (): string => {
  const h = Math.floor(Math.random() * 361);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Generate a full set of colors for a round.
 */
export const generateColors = (mode: TMode): string[] => {
  const generator = mode === "hsl" ? getHslColor : getRgbColor;
  return Array.from({ length: NUM_COLORS }, generator);
};

/**
 * Pick the correct (target) color from a set of colors.
 * Randomised so the correct answer changes each round.
 */
export const pickCorrectColor = (colors: string[]): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};
