import { Box, GridItem, Spinner } from "@chakra-ui/react";
interface Props {
  index: number;
  color: string;
  isCorrect: boolean;
  handleColorClick: (index: number) => void;
  isClicked: boolean;
  isLoading: boolean;
}
export function Colorblock({
  index,
  color,
  isCorrect,
  handleColorClick,
  isClicked,
  isLoading,
}: Props) {
  return (
    <GridItem
      w="100%"
      h={["130", "178"]}
      bg={color}
      borderRadius="3xl"
      borderWidth={"2px"}
      borderColor={"black"}
      boxShadow="lg"
      position="relative"
      onClick={() => handleColorClick(index)}
      visibility={isClicked && !isCorrect ? "hidden" : "visible"}
      cursor={isLoading ? "wait" : "pointer"}
    >
      {isLoading && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="3xl"
          bg="blackAlpha.400"
        >
          <Spinner size="lg" color="white" thickness="4px" speed="0.55s" />
        </Box>
      )}
    </GridItem>
  );
}
