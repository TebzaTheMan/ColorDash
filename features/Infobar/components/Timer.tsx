import { Flex, Heading } from "@chakra-ui/react";
import { GameContext } from "contexts";
import { HighscoreContext } from "features/Highscore";
import { useContext, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { Text } from "@chakra-ui/react";
import { GAME_DURATION_SECONDS } from "game/constants";

export function Timer() {
  const [gameData, gameDispatch] = useContext(GameContext);
  const [highscoreData, highscoreDispatch] = useContext(HighscoreContext);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(
    expiryTimestamp.getSeconds() + GAME_DURATION_SECONDS
  );

  const { seconds, minutes, isRunning, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      gameDispatch({
        type: "TIME_UP",
        highscore: highscoreData[gameData.mode!],
      });
    },
  });

  useEffect(() => {
    if (gameData.timeUp && gameData.isNewHighscore) {
      highscoreDispatch({
        type: "UPDATE_SCORE",
        score: gameData.score,
        mode: gameData.mode,
      });
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
        {minutes + " : " + seconds}
      </Heading>
    </Flex>
  );
}
