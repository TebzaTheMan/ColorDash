import { Box, Flex } from "@chakra-ui/react";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { Tries } from "./Tries";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useMediaQuery } from "@chakra-ui/react";

export function Infobar() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {!isLargerThan768 && (
        <Box marginTop="8" marginLeft="8">
          <Link href="/" passHref>
            <Button size="sm" variant="outline">
              CANCEL
            </Button>
          </Link>
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
