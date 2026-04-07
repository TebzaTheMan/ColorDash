import { Flex, Heading } from "@chakra-ui/react";
import { GameContext } from "contexts";
import { useContext } from "react";
import { Text } from "@chakra-ui/react";

export function Score() {
  const [gameData] = useContext(GameContext);
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Score</Text>
      <Heading size="lg" as="h1">
        {gameData.score.points} / {gameData.score.total}
      </Heading>
    </Flex>
  );
}
