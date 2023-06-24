import { Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";

export function HighScore() {
  const [highscoreData] = useContext(HighscoreContext);
  return (
    <>
      <Text fontSize="lg">High Score</Text>
      <Heading size="lg" as="h1">
        {highscoreData.current.points} / {highscoreData.current.total}
      </Heading>
    </>
  );
}
