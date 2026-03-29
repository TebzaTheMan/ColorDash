import { useState } from "react";
import { TMode } from "types";
import { generateColors, pickCorrectColor } from "game/colors";

export function useColors(mode: TMode) {
  const [colors, setColors] = useState<string[]>(() => generateColors(mode));
  const [correctColor, setCorrectColor] = useState(() =>
    pickCorrectColor(colors)
  );

  const generateNewColors = () => {
    setColors(generateColors(mode));
    setCorrectColor(pickCorrectColor(colors));
  };

  return { colors, correctColor, generateNewColors };
}
