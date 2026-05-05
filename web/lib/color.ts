const luminanceCache = new Map<string, number>();

function parseRgb(args: string): [number, number, number] | null {
  const parts = args.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

function parseHsl(args: string): [number, number, number] | null {
  const parts = args.split(",").map((s) => s.trim());
  if (parts.length !== 3) return null;
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]);
  const l = parseFloat(parts[2]);
  if ([h, s, l].some((n) => Number.isNaN(n))) return null;
  return hslToRgb(h, s / 100, l / 100);
}

export function relativeLuminance(cssColor: string): number {
  const cached = luminanceCache.get(cssColor);
  if (cached !== undefined) return cached;

  const m = cssColor.match(/^(rgb|hsl)\((.+)\)$/i);
  const rgb = m
    ? m[1].toLowerCase() === "rgb"
      ? parseRgb(m[2])
      : parseHsl(m[2])
    : null;
  const lum = rgb ? 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] : 0.5;

  luminanceCache.set(cssColor, lum);
  return lum;
}
