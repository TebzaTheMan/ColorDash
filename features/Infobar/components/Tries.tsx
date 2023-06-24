import { Flex, Heading } from "@chakra-ui/react";
import { GameContext } from "contexts";
import { useContext } from "react";
import { Text } from "@chakra-ui/react";

export function Tries() {
  const [gameData] = useContext(GameContext);
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Tries Left</Text>
      <Heading size="lg" as="h1">
        {gameData.triesLeft}
      </Heading>
    </Flex>
  );
}
