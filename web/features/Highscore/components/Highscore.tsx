import { useContext } from "react";
import { HighscoreContext } from "features/Highscore";
import type { GameMode } from "lib/api/generated/model";
import { ShimmerBlock } from "components/ShimmerBlock";

interface IProps {
  mode: GameMode;
}

export function HighScore({ mode }: IProps) {
  const { highscores, isLoading } = useContext(HighscoreContext);
  const score = highscores[mode];

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-[18px] py-2.5 sm:py-3 border border-line rounded-btn-lg bg-bg-1">
      <div className="mono text-mono-2xs text-ink-3 uppercase leading-[1.4]">
        {mode.toUpperCase()}
        <br />
        High score
      </div>
      <div className="w-px h-7 bg-line" />
      {isLoading ? (
        <ShimmerBlock width={130} height={28} />
      ) : (
        <div className="mono text-[clamp(20px,5.5vw,26px)] font-bold text-neon tabular-nums tracking-[0.02em] text-shadow-neon-soft">
          {score ? score.points : "—"}
          <span className="text-ink-2 font-medium">
            {" / "}
            {score ? score.total : "—"}
          </span>
        </div>
      )}
    </div>
  );
}
