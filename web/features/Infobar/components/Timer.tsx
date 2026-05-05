import { useContext, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { GameContext } from "contexts";
import { HighscoreContext } from "features/Highscore";

export function Timer() {
  const { state: gameData, endGame } = useContext(GameContext);
  const { refresh } = useContext(HighscoreContext);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      endGame();
    },
  });

  useEffect(() => {
    if (gameData.timeUp && gameData.isNewHighscore) {
      refresh();
    }
  }, [gameData.timeUp]);

  useEffect(() => {
    if (gameData.expiresAt) {
      restart(new Date(gameData.expiresAt));
    }
  }, [gameData.expiresAt, restart]);

  const totalSeconds = minutes * 60 + seconds;
  const urgent = totalSeconds <= 10 && totalSeconds > 0;

  const timeStr =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`mono text-mono-xs tracking-mono-xl uppercase flex items-center gap-1.5 ${
          urgent ? "text-hot" : "text-ink-3"
        }`}
      >
        <span
          className={`led inline-block w-1.5 h-1.5 rounded-full ${
            urgent ? "bg-hot shadow-led-hot-sm" : "bg-neon shadow-led-neon-sm"
          }`}
        />
        T-Minus
      </div>
      <div
        className={`mono text-[clamp(22px,6vw,30px)] font-bold tabular-nums tracking-[0.05em] leading-none ${
          urgent
            ? "animate-shake text-hot text-shadow-hot"
            : "text-ink-0 text-shadow-neon"
        }`}
      >
        {timeStr}
      </div>
    </div>
  );
}
