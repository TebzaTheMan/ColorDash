import { Flex, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export function Score() {
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Score</Text>
      <Heading size="lg" as="h1">
        60
      </Heading>
    </Flex>
  );
}
