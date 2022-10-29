import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { InfobarContext } from "features/Infobar";
import { useContext } from "react";

export function CancelButton() {
  const router = useRouter();
  const [, infobarDispatch] = useContext(InfobarContext);
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
