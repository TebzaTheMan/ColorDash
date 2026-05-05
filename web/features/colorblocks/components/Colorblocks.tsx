import { useContext, useEffect, useState } from "react";
import { GameContext } from "contexts";
import { useToast } from "contexts/toast.context";
import { DEFAULT_GAME_MODE } from "game/constants";
import { Colorblock, SwatchState } from "./Colorblock";
import { TargetReadout } from "./TargetReadout";

export function Colorblocks() {
  const { state: gameData, submitGuess } = useContext(GameContext);
  const { showToast } = useToast();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const handleColorClick = async (index: number) => {
    if (pendingIndex !== null) return;
    setPendingIndex(index);
    try {
      await submitGuess(index);
    } finally {
      setPendingIndex(null);
    }
  };

  useEffect(() => {
    if (!gameData.lastGuessResult) return;
    const { result, pointsAwarded } = gameData.lastGuessResult;

    if (result === "correct") {
      showToast("ok", `+${Math.max(pointsAwarded, 0)} · MATCH`);
    } else if (result === "wrong_and_exhausted") {
      showToast("err", "OUT OF TRIES");
    } else {
      showToast("err", "NO MATCH");
    }
  }, [gameData.lastGuessResult, showToast]);

  const swatchState = (index: number): SwatchState => {
    if (pendingIndex === index) return "loading";
    if (gameData.correctColorIndex === index) return "correct";
    if (gameData.clickedColors[index]) return "wrong";
    if (gameData.timeUp) return "revealed";
    return "idle";
  };

  return (
    <>
      <TargetReadout
        target={gameData.targetColor}
        mode={gameData.mode ?? DEFAULT_GAME_MODE}
        status={gameData.triesLeft === 0 ? "lock" : "live"}
      />
      <div className="flex items-center justify-center gap-4 mt-3 mb-1">
        <div className="mono text-mono-xs tracking-mono-xl text-ink-3 uppercase">
          Round {gameData.correctColors + 1}
        </div>
        <div className="hidden sm:block h-px w-10 bg-line" />
        <div className="hidden sm:block mono text-mono-xs tracking-mono-xl text-ink-3 uppercase">
          Tap the swatch matching the readout
        </div>
      </div>
      <div className="dash-grid mt-2">
        {gameData.colors.map((color, index) => (
          <Colorblock
            key={`${gameData.sessionId}-${index}`}
            color={color}
            index={index}
            state={swatchState(index)}
            onClick={handleColorClick}
          />
        ))}
      </div>
    </>
  );
}
