import { useEffect, useState } from "react";
import { TMode } from "types";

const NUM_COLORS = 6;
// generate a random rgb color value
const getRgbColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const value = `rgb(${red}, ${green}, ${blue})`;
  return value;
};
// generate an array of rgb colors
const getRGBcolors = () => {
  const colors = [];
  for (let i = 0; i < NUM_COLORS; i++) {
    colors.push(getRgbColor());
  }
  return colors;
};
// generate a random hsl color value
const getHSLColor = () => {
  const h = Math.floor(Math.random() * 361);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  const value = `hsl(${h}, ${s}%, ${l}%)`;
  return value;
};
// generate an array of hsl colors
const getHSLcolors = () => {
  const colors = [];
  for (let i = 0; i < NUM_COLORS; i++) {
    colors.push(getHSLColor());
  }
  return colors;
};

export function useColors(mode: TMode) {
  const [colors, setColors] = useState<Array<string>>(new Array(NUM_COLORS));
  const [correctColor, setCorrectColor] = useState("");

  const generateNewColors = () => {
    switch (mode) {
      case "rgb":
        return setColors(getRGBcolors);
      case "hsl":
        return setColors(getHSLcolors);
    }
  };

  useEffect(() => {
    generateNewColors();
  }, []);

  useEffect(() => {
    setCorrectColor(colors[Math.floor(Math.random() * NUM_COLORS)]);
  }, [colors]);

  return {
    colors: colors,
    correctColor: correctColor,
    generateNewColors: generateNewColors,
  };
}
