import { Flex, Heading } from "@chakra-ui/react";
import { InfobarContext } from "features/Infobar";
import { useContext } from "react";
import { Text } from "@chakra-ui/react";

export function Tries() {
  const [data] = useContext(InfobarContext);
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Tries Left</Text>
      <Heading size="lg" as="h1">
        {data.triesLeft}
      </Heading>
    </Flex>
  );
}
