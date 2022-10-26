import { Flex } from "@chakra-ui/react";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { Tries } from "./Tries";

export function Infobar() {
  return (
    <Flex
      alignItems="center"
      marginTop="8"
      justifyContent={"space-between"}
      marginLeft="8"
      marginRight="8"
    >
      <Score />
      <Timer />
      <Tries />
    </Flex>
  );
}
