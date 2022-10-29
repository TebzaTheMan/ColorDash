import { Box, Flex } from "@chakra-ui/react";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { Tries } from "./Tries";
import { useMediaQuery } from "@chakra-ui/react";
import { CancelButton } from "components/CancelButton";

export function Infobar() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {!isLargerThan768 && (
        <Box marginTop="8" marginLeft="8">
          <CancelButton />
        </Box>
      )}

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
    </>
  );
}
