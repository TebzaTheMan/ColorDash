import { Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ReplayIcon } from "components/icons";
import { GameContext } from "contexts";
import { DEFAULT_GAME_MODE } from "game/constants";

export function GameoverModal() {
  const { state: gameData, startGame, reset } = useContext(GameContext);
  const router = useRouter();
  const isOpen = gameData.timeUp;

  const onReplay = () => {
    const mode = gameData.mode;
    if (!mode) return;
    reset();
    startGame(mode);
  };

  const onHome = () => {
    reset();
    router.push("/");
  };

  const { points, total } = gameData.score;
  const accuracy = total > 0 ? Math.round((points / total) * 100) : 0;
  const correctCount = gameData.correctColors;
  const isHighscore = !!gameData.isNewHighscore;
  const mode = gameData.mode ?? DEFAULT_GAME_MODE;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onReplay} className="relative z-modal">
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="animate-fade-in fixed inset-0 bg-modal-backdrop backdrop-blur-modal"
            aria-hidden="true"
          />
        </TransitionChild>

        <div className="fixed inset-0 grid place-items-center p-3 sm:p-6">
          <TransitionChild
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 translate-y-3 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-95"
          >
            <DialogPanel className="animate-panel-in w-full max-w-[540px] bg-panel border border-line rounded-panel shadow-panel overflow-hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-5 bg-panel-header border-b border-line flex items-center justify-between gap-3 flex-wrap">
                <div className="mono text-mono-sm tracking-mono-xl text-ink-2 uppercase flex items-center gap-2.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-hot shadow-led-hot-sm" />
                  Session ended · {mode.toUpperCase()}
                </div>
                {isHighscore && (
                  <div className="mono px-2.5 py-1 bg-neon text-neon-on-bg rounded-md text-mono-xs font-bold tracking-mono-lg uppercase shadow-highscore-badge">
                    ★ New best
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 text-center">
                <div className="mono text-mono-xs tracking-mono-2xl text-ink-3 uppercase mb-2">
                  Final score
                </div>
                <div
                  className={`mono text-display-score font-bold tabular-nums ${
                    isHighscore
                      ? "text-neon text-shadow-score-best"
                      : "text-ink-0 text-shadow-neon-glow"
                  }`}
                >
                  {points}
                  <span className="text-ink-3 font-medium">/{total}</span>
                </div>
                <div className="mt-3 flex justify-center gap-6 text-ink-2 flex-wrap">
                  <span>
                    <span className="text-neon font-bold">{correctCount}</span>{" "}
                    match{correctCount === 1 ? "" : "es"}
                  </span>
                  <span className="text-ink-3">·</span>
                  <span>
                    <span className="text-neon font-bold">{accuracy}%</span>{" "}
                    accuracy
                  </span>
                </div>
              </div>

              <div className="px-4 sm:px-5 pt-4 pb-4 sm:pb-5 flex gap-3 border-t border-line bg-panel-header">
                <button
                  type="button"
                  onClick={onHome}
                  className="btn-ghost focus-ring flex-1 !px-4 !py-3.5"
                >
                  ← Home
                </button>
                <button
                  type="button"
                  onClick={onReplay}
                  className="btn-primary focus-ring flex-[2] !px-4 !py-3.5 inline-flex items-center justify-center gap-2.5"
                >
                  <ReplayIcon />
                  Replay
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
