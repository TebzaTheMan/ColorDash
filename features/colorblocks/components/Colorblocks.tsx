import { Box, Grid, useToast } from "@chakra-ui/react";
import { Colorblock } from "./Colorblock";
import { InfobarContext } from "features/Infobar";
import { useContext } from "react";
import { useColors, useColorsClicked } from "features/colorblocks";
import Header from "./Header";

const calculateScore = (numTriesLeft: number) => {
  switch (numTriesLeft) {
    case 3:
      return 10;
    case 2:
      return 5;
    case 1:
      return 2;
    default:
      return 0;
  }
};
export function Colorblocks() {
  const { colors, correctColor, generateNewColors } = useColors();
  const { resetClickedColors, isColorClicked, setColorClicked } =
    useColorsClicked(colors.length);
  const [infobarData, infobarDispatch] = useContext(InfobarContext);
  const toast = useToast();

  const handleColorClick = (index: number, isCorrect: boolean) => {
    if (isCorrect) {
      // show correct color toast!
      toast({
        title: "Correct color",
        status: "success",
        duration: 600,
        position: "top",
      });
      infobarDispatch({
        type: "CORRECT_COLOR",
        score: calculateScore(infobarData.triesLeft),
      });
      resetClickedColors();
      generateNewColors();
    } else {
      toast({
        title: "Incorrect color",
        status: "error",
        duration: 600,
        position: "top",
      });
      if (infobarData.triesLeft == 1) {
        infobarDispatch({ type: "RESET_TRIES" });
        resetClickedColors();
        generateNewColors();
      } else {
        setColorClicked(index);
        infobarDispatch({ type: "DECREMENT_TRIES" });
      }
    }
  };

  return (
    <Box>
      <Header correctColor={correctColor} />
      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
        ml={["10", "32", "32", "72"]}
        mr={["10", "32", "32", "72"]}
      >
        {colors.map((color, index) => {
          return (
            <Colorblock
              color={color}
              key={index}
              index={index}
              isCorrect={color == correctColor ? true : false}
              isClicked={isColorClicked(index)}
              handleColorClick={handleColorClick}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
