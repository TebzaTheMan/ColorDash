import { Flex, Heading } from "@chakra-ui/react";
import { GameContext } from "contexts";
import { HighscoreContext } from "features/Highscore";
import { useContext, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { Text } from "@chakra-ui/react";
import { GAME_DURATION_SECONDS } from "game/constants";

export function Timer() {
  const { state: gameData, endGame } = useContext(GameContext);
  const { refresh } = useContext(HighscoreContext);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(
    expiryTimestamp.getSeconds() + GAME_DURATION_SECONDS
  );

  const { seconds, minutes, isRunning, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      endGame();
    },
  });

  useEffect(() => {
    if (gameData.timeUp && gameData.isNewHighscore) {
      refresh();
    }
  }, [gameData.timeUp]);

  useEffect(() => {
    if (gameData.gameStartTimestamp) {
      const newExpiry = new Date();
      newExpiry.setSeconds(newExpiry.getSeconds() + GAME_DURATION_SECONDS);
      restart(newExpiry);
    }
  }, [gameData.gameStartTimestamp, restart]);

  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Time left</Text>
      <Heading size="lg" as="h1" color={isRunning ? "black" : "red.500"}>
        {minutes.toString().padStart(2, "0") +
          " : " +
          seconds.toString().padStart(2, "0")}
      </Heading>
    </Flex>
  );
}
