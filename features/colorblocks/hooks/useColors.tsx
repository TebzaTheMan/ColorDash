import { useEffect, useState } from "react";

const NUM_COLORS = 6;
// generate a random rgb color value
const getRgbColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const value = `rgb(${red}, ${green}, ${blue})`;
  return value;
};
// generate an array of colors
const getRGBcolors = () => {
  const colors = [];
  for (let i = 0; i < NUM_COLORS; i++) {
    colors.push(getRgbColor());
  }
  return colors;
};

export function useColors() {
  const [colors, setColors] = useState<Array<string>>(new Array(NUM_COLORS));
  const [correctColor, setCorrectColor] = useState("");

  const generateNewColors = () => {
    setColors(getRGBcolors);
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
