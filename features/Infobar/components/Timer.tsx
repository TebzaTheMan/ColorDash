import { Flex, Heading } from "@chakra-ui/react";
import { InfobarContext } from "features/Infobar";
import { useContext } from "react";
import { Text } from "@chakra-ui/react";

export function Timer() {
  const [data] = useContext(InfobarContext);
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Time left</Text>
      <Heading size="lg" as="h1">
        {data.timeLeft.minutes + " : " + data.timeLeft.seconds}
      </Heading>
    </Flex>
  );
}
