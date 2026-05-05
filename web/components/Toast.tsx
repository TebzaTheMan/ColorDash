import { useEffect } from "react";

export type ToastKind = "ok" | "err";

interface Props {
  kind: ToastKind;
  msg: string;
  onDone: () => void;
}

export function Toast({ kind, msg, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  const isOk = kind === "ok";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-toast-in fixed top-6 left-1/2 -translate-x-1/2 z-toast flex items-center gap-3 px-[18px] py-3 rounded-btn-lg max-w-[calc(100vw-24px)] ${
        isOk
          ? "bg-toast-ok-bg border border-neon shadow-toast-ok"
          : "bg-toast-err-bg border border-hot shadow-toast-err"
      }`}
    >
      <span
        className={`inline-grid place-items-center w-[22px] h-[22px] rounded-full ${
          isOk ? "bg-neon text-neon-on-bg" : "bg-hot text-ink-0"
        }`}
      >
        {isOk ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 12 10 18 20 6" />
          </svg>
        ) : (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        )}
      </span>
      <div
        className={`mono text-xs font-semibold tracking-[0.1em] uppercase ${
          isOk ? "text-neon" : "text-hot"
        }`}
      >
        {msg}
      </div>
    </div>
  );
}
