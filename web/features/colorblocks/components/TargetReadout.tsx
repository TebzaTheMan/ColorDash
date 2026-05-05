import { Fragment, useMemo } from "react";
import type { GameMode } from "lib/api/generated/model";

interface Props {
  target: string;
  mode: GameMode;
  status: "live" | "lock";
}

export function TargetReadout({ target, mode, status }: Props) {
  const parts = useMemo(() => {
    const m = target.match(/^(rgb|hsl)\((.+)\)$/i);
    if (!m) return null;
    return {
      fn: m[1].toLowerCase(),
      args: m[2].split(",").map((s) => s.trim()),
    };
  }, [target]);

  const isLock = status === "lock";

  return (
    <div className="terminal-bezel px-4 sm:px-6 py-3 sm:py-[18px] flex items-center justify-center sm:justify-between gap-3 sm:gap-6 max-w-[720px] mx-auto w-full">
      <div className="flex items-center gap-3 relative z-content">
        <span
          className={`led inline-block w-2 h-2 rounded-full ${
            isLock ? "bg-hot shadow-led-hot" : "bg-neon shadow-led-neon"
          }`}
        />
        <div className="hidden sm:block">
          <div className="mono text-mono-2xs text-ink-3 uppercase mb-0.5">
            Target ▸ {mode.toUpperCase()}
          </div>
          <div
            className={`mono text-mono-sm tracking-mono-sm uppercase ${
              isLock ? "text-hot" : "text-neon"
            }`}
          >
            {isLock ? "◆ LOCKED" : "◆ MATCH FUNCTION"}
          </div>
        </div>
      </div>

      <div className="mono relative z-content text-[clamp(16px,5vw,28px)] font-bold text-neon text-shadow-neon-strong tracking-[0.02em] tabular-nums">
        {parts ? (
          <>
            <span className="text-ink-1 opacity-70">{parts.fn}(</span>
            {parts.args.map((a, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="text-ink-2 opacity-70">, </span>}
                <span>{a}</span>
              </Fragment>
            ))}
            <span className="text-ink-1 opacity-70">)</span>
          </>
        ) : (
          target
        )}
      </div>

      <div className="hidden sm:flex flex-col gap-[3px] relative z-content">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-4 h-0.5 rounded-[1px] ${
              i < 3 ? "bg-neon" : "bg-ink-3 opacity-30"
            }`}
            style={i < 3 ? { opacity: 1 - i * 0.2 } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
