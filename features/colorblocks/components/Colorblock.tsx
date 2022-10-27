import { useState } from "react";
import { GridItem } from "@chakra-ui/react";
interface Props {
  color: string;
  isCorrect: boolean;
}
export function Colorblock({ color, isCorrect }: Props) {
  const [isClicked, setisClicked] = useState(false);
  return (
    <GridItem
      w="100%"
      h={["130", "178"]}
      bg={color}
      borderRadius="3xl"
      boxShadow="lg"
      onClick={() => {
        setisClicked(true);
      }}
      visibility={isClicked && !isCorrect ? "hidden" : "inherit"}
    />
  );
}
