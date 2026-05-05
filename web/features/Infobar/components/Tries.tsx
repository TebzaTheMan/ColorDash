import { useContext } from "react";
import { GameContext } from "contexts";

interface PipProps {
  filled: boolean;
  urgent: boolean;
}

function Pip({ filled, urgent }: PipProps) {
  let cls = "bg-transparent border-line shadow-none";
  if (filled && urgent) cls = "bg-hot border-transparent shadow-led-hot";
  else if (filled) cls = "bg-neon border-transparent shadow-led-neon";
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-sm border transition-all duration-200 ease-in-out ${cls}`}
    />
  );
}

export function Tries() {
  const { state: gameData } = useContext(GameContext);
  const tries = gameData.triesLeft;
  const urgent = tries === 1;

  return (
    <div className="text-right min-w-0">
      <div className="mono text-mono-xs tracking-mono-lg text-ink-3 uppercase mb-1">
        Tries
      </div>
      <span className="inline-flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <Pip key={i} filled={i < tries} urgent={urgent} />
        ))}
      </span>
    </div>
  );
}
