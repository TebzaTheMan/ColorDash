import { useEffect } from "react";
import { CheckIcon, XIcon } from "components/icons";

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
          <CheckIcon size={14} strokeWidth={3} />
        ) : (
          <XIcon size={12} strokeWidth={3} />
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
