import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import Link from "next/dist/client/link";
import { Colorblock } from "./Colorblock";

export function Colorblocks() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <Box>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]}
        mt="16"
        mb="8"
        ml={["0", "8"]}
      >
        {isLargerThan768 && (
          <Box justifySelf={"flex-start"}>
            <Link href="/" passHref>
              <Button size="lg" variant="outline">
                CANCEL
              </Button>
            </Link>
          </Box>
        )}
        <Heading size="lg" as="h1" color="gray.600" justifySelf={"center"}>
          rgb(99, 143, 179)
        </Heading>
      </Grid>

      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
        ml={["10", "32", "32", "72"]}
        mr={["10", "32", "32", "72"]}
      >
        <Colorblock />
        <Colorblock />
        <Colorblock />
        <Colorblock />
        <Colorblock />
        <Colorblock />
      </Grid>
    </Box>
  );
}
