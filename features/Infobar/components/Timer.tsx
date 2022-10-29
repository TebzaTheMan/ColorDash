import { Flex, Heading } from "@chakra-ui/react";
import { InfobarContext } from "features/Infobar";
import { useContext } from "react";
import { useTimer } from "react-timer-hook";
import { Text } from "@chakra-ui/react";

export function Timer() {
  const [, inforbarDispatch] = useContext(InfobarContext);
  const ALLOWED_SECONDS = 30;
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ALLOWED_SECONDS);
  const { seconds, minutes, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      inforbarDispatch({ type: "TIME_UP" });
    },
  });
  return (
    <Flex direction={"column"} alignItems="center">
      <Text fontSize="lg">Time left</Text>
      <Heading size="lg" as="h1" color={isRunning ? "black" : "red.500"}>
        {minutes + " : " + seconds}
      </Heading>
    </Flex>
  );
}
