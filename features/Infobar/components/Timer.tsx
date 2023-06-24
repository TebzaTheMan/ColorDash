import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GameContext } from "contexts";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";
import { useTimer } from "react-timer-hook";
import { Text } from "@chakra-ui/react";
import { IScore, TMode } from "types";

const processModeQuery = (mode: string | string[] | undefined): TMode => {
  if (undefined) {
    return "rgb";
  }
  if (mode === "rgb" || mode == "hsl") {
    return mode;
  }
  return "rgb";
};
export function Timer() {
  const [gameData, gameDispatch] = useContext(GameContext);
  const [highscoreData, highscoreDispatch] = useContext(HighscoreContext);
  const router = useRouter();
  const { mode } = router.query;
  const modeQuery = processModeQuery(mode);
  const ALLOWED_SECONDS = 30;
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ALLOWED_SECONDS);

  const isNewHighScore = (currentScore: IScore, highScore: IScore) => {
    if (currentScore.total === highScore.total) {
      if (currentScore.points > highScore.points) {
        return true;
      } else {
        return false;
      }
    }
    return currentScore.total > highScore.total;
  };
  const { seconds, minutes, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      const score = gameData.score;
      const isNewHighscore = isNewHighScore(score, highscoreData[modeQuery]);
      gameDispatch({
        type: "TIME_UP",
        isNewHighscore,
      });
      if (isNewHighscore) {
        highscoreDispatch({
          type: "UPDATE_SCORE",
          score,
          mode: modeQuery,
        });
      }
    },
  });
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Time left</Text>
      <Heading size="lg" as="h1" color={isRunning ? "black" : "red.500"}>
        {minutes + " : " + seconds}
      </Heading>
    </Flex>
  );
}
