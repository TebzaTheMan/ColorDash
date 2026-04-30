import { useMediaQuery } from "@chakra-ui/react";
import { Box, Grid, Heading } from "@chakra-ui/react";
import { CancelButton } from "components/CancelButton";

interface Props {
  correctColor: string;
}

export default function Header({ correctColor }: Props) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <Grid
      templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]}
      mt="16"
      mb="8"
      ml={["0", "8"]}
    >
      {isLargerThan768 && (
        <Box justifySelf={"flex-start"}>
          <CancelButton />
        </Box>
      )}
      <Heading size="lg" as="h1" color="gray.600" justifySelf={"center"}>
        {correctColor}
      </Heading>
    </Grid>
  );
}
