import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import Link from "next/dist/client/link";
import { Colorblock } from "./Colorblock";

const NUM_COLORS = 6;
// generate a random rgb color value
const getRgbColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const value = `rgb(${red}, ${green}, ${blue})`;
  return value;
};
// generaate an array of colors
const getRGBcolors = () => {
  const colors = [];
  for (let i = 0; i < NUM_COLORS; i++) {
    colors.push(getRgbColor());
  }
  return colors;
};

export function Colorblocks() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const colors = getRGBcolors();
  // assign correct color to one random color
  const correctColor = colors[Math.floor(Math.random() * NUM_COLORS)];
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
          {correctColor}
        </Heading>
      </Grid>

      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
        ml={["10", "32", "32", "72"]}
        mr={["10", "32", "32", "72"]}
      >
        {colors.map((color, index) => {
          return (
            <Colorblock
              color={color}
              key={index}
              isCorrect={color == correctColor ? true : false}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
