import { GridItem } from "@chakra-ui/react";
interface Props {
  index: number;
  color: string;
  isCorrect: boolean;
  handleColorClick: Function;
  isClicked: boolean;
}
export function Colorblock({
  index,
  color,
  isCorrect,
  handleColorClick,
  isClicked,
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
      onClick={() => {
        handleColorClick(index, isCorrect);
      }}
      visibility={isClicked && !isCorrect ? "hidden" : "visible"}
    />
  );
}
