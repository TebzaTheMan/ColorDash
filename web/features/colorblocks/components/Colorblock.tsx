import { useMemo } from "react";
import { CheckIcon, XIcon } from "components/icons";
import { relativeLuminance } from "lib/color";

export type SwatchState = "idle" | "loading" | "wrong" | "correct" | "revealed";

interface Props {
  index: number;
  color: string;
  state: SwatchState;
  onClick: (index: number) => void;
}

export function Colorblock({ index, color, state, onClick }: Props) {
  const isWrong = state === "wrong";
  const isCorrect = state === "correct";
  const isLoading = state === "loading";
  const isRevealed = state === "revealed";
  const isDisabled = state !== "idle";

  const isDark = useMemo(() => relativeLuminance(color) < 0.5, [color]);

  const label = `0${index + 1}`;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : () => onClick(index)}
      aria-label={`Swatch ${label}`}
      className={`swatch swatch-shadow focus-ring w-full h-[120px] sm:h-[180px] border-0 ${
        isDisabled ? "disabled" : ""
      } ${isCorrect ? "animate-pop" : ""} ${isWrong ? "animate-shake opacity-[0.35]" : "opacity-100"} ${
        isRevealed ? "[filter:saturate(0.4)_brightness(0.6)]" : ""
      }`}
      style={{ background: color }}
    >
      <span
        className={`mono absolute top-2.5 left-3 z-swatch-label text-mono-xs tracking-mono-md font-medium ${
          isDark ? "text-white/55" : "text-black/45"
        }`}
      >
        {label}
      </span>

      {isLoading && (
        <span className="absolute inset-0 z-swatch-overlay grid place-items-center">
          <span
            className="w-9 h-9 rounded-full border-[3px] animate-spin-fast"
            style={{
              borderColor: isDark
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.25)",
              borderTopColor: isDark ? "#fff" : "#000",
            }}
          />
        </span>
      )}

      {isWrong && (
        <span className="absolute inset-0 z-swatch-label grid place-items-center text-ink-0">
          <XIcon size={44} />
        </span>
      )}

      {isCorrect && (
        <span
          className={`absolute inset-0 z-swatch-label grid place-items-center ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <CheckIcon size={56} />
        </span>
      )}
    </button>
  );
}
