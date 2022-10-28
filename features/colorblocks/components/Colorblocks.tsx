import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Colorblock } from "./Colorblock";
import { InfobarContext } from "features/Infobar";
import { useContext, useState } from "react";

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
let colors = getRGBcolors();
let correctColor = colors[Math.floor(Math.random() * NUM_COLORS)]; // assign correct color to one random color

const generateNewColors = () => {
  colors = getRGBcolors();
  correctColor = colors[Math.floor(Math.random() * NUM_COLORS)];
};

export function Colorblocks() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [colorsClicked, setColorsClicked] = useState(new Array(NUM_COLORS));
  const router = useRouter();
  const [infobarData, infobarDispatch] = useContext(InfobarContext);

  const handleColorClick = (index: number, isCorrect: boolean) => {
    if (isCorrect) {
      infobarDispatch({ type: "CORRECT_COLOR", score: 10 });
      setColorsClicked(new Array(NUM_COLORS)); // reset colors from being clicked!
      generateNewColors();
    } else {
      if (infobarData.triesLeft == 1) {
        infobarDispatch({ type: "RESET_TRIES" });
        setColorsClicked(new Array(NUM_COLORS)); // reset colors from being clicked!
        generateNewColors();
      } else {
        const c = colorsClicked;
        c[index] = true;
        setColorsClicked(c);
        infobarDispatch({ type: "DECREMENT_TRIES" });
      }
    }
  };
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
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                infobarDispatch({ type: "RESET" });
                router.push("/");
              }}
            >
              CANCEL
            </Button>
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
              index={index}
              isCorrect={color == correctColor ? true : false}
              isClicked={colorsClicked[index]}
              handleColorClick={handleColorClick}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
