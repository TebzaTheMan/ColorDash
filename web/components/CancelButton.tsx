import { useRouter } from "next/router";
import { useContext } from "react";
import { GameContext } from "contexts";

export function CancelButton() {
  const router = useRouter();
  const { reset } = useContext(GameContext);
  return (
    <button
      type="button"
      className="btn-ghost focus-ring !px-3 !py-2 !text-mono-sm"
      onClick={() => {
        reset();
        router.push("/");
      }}
    >
      ← Quit
    </button>
  );
}
