import { Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";

export function HighScore() {
  const [highscore] = useContext(HighscoreContext);
  return (
    <>
      <Text fontSize="lg">High Score</Text>
      <Heading size="lg" as="h1">
        {highscore.current.points} / {highscore.current.total}
      </Heading>
    </>
  );
}
