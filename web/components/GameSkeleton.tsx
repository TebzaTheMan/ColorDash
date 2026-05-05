import type { GameMode } from "lib/api/generated/model";
import { ShimmerBlock } from "components/ShimmerBlock";

interface Props {
  mode: GameMode;
}

export function GameSkeleton({ mode }: Props) {
  return (
    <main className="relative z-content min-h-screen px-3 sm:px-6 pt-3 sm:pt-6 pb-6 sm:pb-8 max-w-[1280px] mx-auto flex flex-col gap-3 sm:gap-6">
      <div className="sm:hidden flex">
        <ShimmerBlock width={78} height={32} radius={8} />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 px-3 sm:px-5 py-3 sm:py-3.5 rounded-card bg-bg-1 border border-line">
        <div className="flex gap-3 sm:gap-[18px] items-center">
          <div className="hidden sm:block">
            <ShimmerBlock width={78} height={32} radius={8} />
          </div>
          <ShimmerBlock width={130} height={38} radius={6} />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShimmerBlock width={70} height={12} radius={4} />
          <ShimmerBlock width={110} height={28} radius={6} />
        </div>
        <div className="flex justify-end items-center gap-3.5">
          <ShimmerBlock width={90} height={32} radius={6} />
        </div>
      </div>

      <div className="terminal-bezel px-4 sm:px-6 py-3 sm:py-[18px] flex items-center justify-between gap-3 sm:gap-6 max-w-[720px] mx-auto w-full">
        <div className="flex items-center gap-3 relative z-content">
          <span className="led inline-block w-2 h-2 rounded-full bg-amber shadow-led-amber" />
          <div>
            <div className="mono text-mono-2xs text-ink-3 uppercase mb-0.5">
              Target ▸ {mode.toUpperCase()}
            </div>
            <div className="mono text-mono-sm tracking-mono-sm text-amber uppercase">
              ◆ INITIALIZING…
            </div>
          </div>
        </div>
        <div className="mono text-2xl text-ink-3 tracking-mono-sm relative z-content">
          <span className="loading-dots">
            <span>·</span>
            <span>·</span>
            <span>·</span>
          </span>
        </div>
        <div className="absolute left-0 right-0 h-0.5 bg-scan-line shadow-scan-line animate-scan-line" />
      </div>

      <div className="dash-grid mt-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden h-[120px] sm:h-[180px] rounded-panel bg-bg-1 border border-line shadow-swatch-skeleton"
          >
            <div
              className="shimmer absolute inset-0 opacity-50"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
            <span className="mono absolute top-2.5 left-3 text-mono-xs tracking-mono-md text-ink-3">
              0{i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center mt-2">
        <span className="mono text-mono-sm tracking-mono-xl text-ink-3 uppercase">
          ▸ booting session · calibrating swatches
        </span>
      </div>
    </main>
  );
}
