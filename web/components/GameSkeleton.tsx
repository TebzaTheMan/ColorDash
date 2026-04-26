import { Box, Flex, Grid, Skeleton, useMediaQuery } from "@chakra-ui/react";
import { CancelButton } from "components/CancelButton";

function InfobarItemSkeleton() {
  return (
    <Flex direction="column" alignItems="center" gap={2}>
      <Skeleton h="22px" w="70px" borderRadius="md" />
      <Skeleton h="32px" w="80px" borderRadius="md" />
    </Flex>
  );
}

export function GameSkeleton() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <main>
      {!isLargerThan768 && (
        <Box marginTop="8" marginLeft="8">
          <CancelButton />
        </Box>
      )}
      <Flex
        alignItems="center"
        marginTop="8"
        justifyContent="space-between"
        marginLeft="8"
        marginRight="8"
      >
        <InfobarItemSkeleton />
        <InfobarItemSkeleton />
        <InfobarItemSkeleton />
      </Flex>

      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]}
        mt="16"
        mb="8"
        ml={["0", "8"]}
      >
        <Box
          gridColumn={["1", "1", "2"]}
          justifySelf="center"
        >
          <Skeleton h="36px" w={["160px", "200px"]} borderRadius="md" />
        </Box>
      </Grid>

      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
        ml={["10", "32", "32", "72"]}
        mr={["10", "32", "32", "72"]}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} h={["130px", "178px"]} borderRadius="3xl" />
        ))}
      </Grid>
    </main>
  );
}
