import { Box, Grid, useToast } from "@chakra-ui/react";
import { Colorblock } from "./Colorblock";
import { GameContext } from "contexts";
import { useContext } from "react";
import { useColors, useColorsClicked } from "features/colorblocks";
import Header from "./Header";
import { resolveColorClick } from "game/engine";

export function Colorblocks() {
  const [gameData, gameDispatch] = useContext(GameContext);
  const { colors, correctColor, generateNewColors } = useColors(gameData.mode);
  const { resetClickedColors, isColorClicked, setColorClicked } =
    useColorsClicked(colors.length);
  const toast = useToast();

  const handleColorClick = (index: number, isCorrect: boolean) => {
    const outcome = resolveColorClick(isCorrect, gameData);

    switch (outcome.result) {
      case "correct":
        toast({
          title: "Correct color",
          status: "success",
          duration: 600,
          position: "top",
        });
        gameDispatch({ type: "CORRECT_COLOR", score: outcome.score });
        resetClickedColors();
        generateNewColors();
        break;

      case "wrong_and_exhausted":
        toast({
          title: "Incorrect color",
          status: "error",
          duration: 600,
          position: "top",
        });
        gameDispatch({ type: "RESET_TRIES" });
        resetClickedColors();
        generateNewColors();
        break;

      case "wrong_but_continue":
        toast({
          title: "Incorrect color",
          status: "error",
          duration: 600,
          position: "top",
        });
        setColorClicked(index);
        gameDispatch({ type: "DECREMENT_TRIES" });
        break;
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
