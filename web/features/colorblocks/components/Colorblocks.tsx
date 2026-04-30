import { Box, Grid, useToast } from "@chakra-ui/react";
import { Colorblock } from "./Colorblock";
import { GameContext } from "contexts";
import { useContext, useEffect, useState } from "react";
import Header from "./Header";

export function Colorblocks() {
  const { state: gameData, submitGuess } = useContext(GameContext);
  const toast = useToast();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const handleColorClick = async (index: number) => {
    if (pendingIndex !== null) return;
    setPendingIndex(index);
    try {
      await submitGuess(index);
    } finally {
      setPendingIndex(null);
    }
  };

  useEffect(() => {
    if (!gameData.lastGuessResult) return;

    const { result } = gameData.lastGuessResult;

    if (result === "correct") {
      toast({
        title: "Correct color",
        status: "success",
        duration: 600,
        position: "top",
      });
    } else {
      toast({
        title: "Incorrect color",
        status: "error",
        duration: 600,
        position: "top",
      });
    }
  }, [gameData.lastGuessResult, toast]);

  return (
    <Box>
      <Header correctColor={gameData.targetColor} />
      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
        ml={["10", "32", "32", "72"]}
        mr={["10", "32", "32", "72"]}
      >
        {gameData.colors.map((color, index) => {
          return (
            <Colorblock
              color={color}
              key={index}
              index={index}
              isCorrect={gameData.correctColorIndex === index}
              isClicked={gameData.clickedColors[index]}
              isLoading={pendingIndex === index}
              handleColorClick={handleColorClick}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
