import { Flex, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export function Tries() {
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Tries Left</Text>
      <Heading size="lg" as="h1">
        3
      </Heading>
    </Flex>
  );
}
