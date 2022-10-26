import { Flex, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export function Timer() {
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Time left</Text>
      <Heading size="lg" as="h1">
        00 : 15
      </Heading>
    </Flex>
  );
}
