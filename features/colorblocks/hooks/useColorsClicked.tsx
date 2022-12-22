import { useState } from "react";

export const useColorsClicked = (numOfColors: number) => {
  const emptyColorsClickedArr = new Array(numOfColors);
  const [colorsClicked, setColorsClicked] = useState(emptyColorsClickedArr);

  const isColorClicked = (index: number) => {
    return colorsClicked[index];
  };

  const setColorClicked = (index: number) => {
    const c = colorsClicked;
    c[index] = true;
    setColorsClicked(c);
  };
  const resetClickedColors = () => {
    setColorsClicked(emptyColorsClickedArr);
  };
  return {
    isColorClicked,
    setColorClicked,
    resetClickedColors,
  };
};
