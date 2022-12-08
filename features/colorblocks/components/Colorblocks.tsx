import { Box, Grid, Heading, useToast } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { Colorblock } from "./Colorblock";
import { InfobarContext } from "features/Infobar";
import { useContext, useState } from "react";
import { CancelButton } from "components/CancelButton";
import { useColors } from "features/colorblocks";

export function Colorblocks() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colors, correctColor, generateNewColors } = useColors();
  const emptyColorsClickedArr = new Array(colors.length);
  const [colorsClicked, setColorsClicked] = useState(emptyColorsClickedArr);
  const [infobarData, infobarDispatch] = useContext(InfobarContext);
  const toast = useToast();

  const handleColorClick = (index: number, isCorrect: boolean) => {
    if (isCorrect) {
      // show correct color toast!
      toast({
        title: "Correct color",
        status: "success",
        duration: 600,
        position: "top",
      });
      infobarDispatch({ type: "CORRECT_COLOR", score: 10 });
      setColorsClicked(emptyColorsClickedArr); // reset colors from being clicked!
      generateNewColors();
    } else {
      toast({
        title: "Incorrect color",
        status: "error",
        duration: 600,
        position: "top",
      });
      if (infobarData.triesLeft == 1) {
        infobarDispatch({ type: "RESET_TRIES" });
        setColorsClicked(emptyColorsClickedArr); // reset colors from being clicked!
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
            <CancelButton />
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
        {correctColor !== "" &&
          colors.map((color, index) => {
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
