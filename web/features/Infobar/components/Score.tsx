import { useContext } from "react";
import { GameContext } from "contexts";
import { DEFAULT_GAME_MODE } from "game/constants";

export function Score() {
  const { state: gameData } = useContext(GameContext);
  const mode = gameData.mode ?? DEFAULT_GAME_MODE;

  return (
    <div className="min-w-0">
      <div className="mono text-mono-xs tracking-mono-lg text-ink-3 uppercase mb-1">
        {mode.toUpperCase()} · Score
      </div>
      <div className="text-[clamp(18px,5vw,22px)] font-bold tabular-nums tracking-[-0.01em]">
        <span className="text-neon">{gameData.score.points}</span>
        <span className="text-ink-3 font-medium">
          {" / "}
          {gameData.score.total}
        </span>
      </div>
    </div>
  );
}
