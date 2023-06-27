import { Box, Center, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";

export function HighScore() {
  const [highscoreData] = useContext(HighscoreContext);
  return (
    <>
      <Box>
        <Text fontSize="lg">RGB High Score</Text>
        <Center>
          <Heading size="lg" as="h1">
            {highscoreData.rgb.points} / {highscoreData.rgb.total}
          </Heading>
        </Center>
      </Box>
      <Box>
        <Text fontSize="lg">HSL High Score</Text>
        <Center>
          <Heading size="lg" as="h1">
            {highscoreData.hsl.points} / {highscoreData.hsl.total}
          </Heading>
        </Center>
      </Box>
    </>
  );
}
