import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GameContext } from "contexts";
import { useContext } from "react";

export function CancelButton() {
  const router = useRouter();
  const { reset } = useContext(GameContext);
  return (
    <Button
      variant="solid"
      size={["md", "lg"]}
      onClick={() => {
        reset();
        router.push("/");
      }}
    >
      Cancel
    </Button>
  );
}
