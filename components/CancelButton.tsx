import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GameContext } from "contexts";
import { useContext } from "react";

export function CancelButton() {
  const router = useRouter();
  const [, infobarDispatch] = useContext(GameContext);
  return (
    <Button
      variant="outline"
      size={["md", "lg"]}
      onClick={() => {
        infobarDispatch({ type: "RESET" });
        router.push("/");
      }}
    >
      Cancel
    </Button>
  );
}
