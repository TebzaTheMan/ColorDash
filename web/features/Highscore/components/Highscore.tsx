import { Box, Center, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";
import type { GameMode } from "lib/api/generated/model";

interface IProps {
  mode: GameMode;
}
export function HighScore({ mode }: IProps) {
  const { highscores } = useContext(HighscoreContext);
  const score = highscores[mode];
  return (
    <Box mt={"8"}>
      <Text fontSize="lg">{mode?.toUpperCase()} High Score</Text>
      <Center>
        <Heading size="lg" as="h1">
          {score ? `${score.points} / ${score.total}` : "--/--"}
        </Heading>
      </Center>
    </Box>
  );
}
