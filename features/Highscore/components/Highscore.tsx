import { Box, Center, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { HighscoreContext } from "features/Highscore";
import { useContext } from "react";
import { TMode } from "types";

interface IProps {
  mode: TMode;
}
export function HighScore({ mode }: IProps) {
  const [highscoreData] = useContext(HighscoreContext);
  return (
    <>
      <Box mt={"8"}>
        <Text fontSize="lg">{mode?.toUpperCase()} High Score</Text>
        <Center>
          <Heading size="lg" as="h1">
            {highscoreData[mode!].points} / {highscoreData[mode!].total}
          </Heading>
        </Center>
      </Box>
    </>
  );
}
