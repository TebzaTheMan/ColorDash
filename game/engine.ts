// The engine decides WHAT should happen on a color click; the UI decides HOW to react.

import { IGameState } from "types";
import { buildRoundScore } from "./scoring";
import { IScore } from "types";

// ─── Outcome Types ───────────────────────────────────────────────────────────

/** Player picked the correct color on this attempt */
export type CorrectOutcome = {
  result: "correct";
  score: IScore;
};

/** Player picked wrong, but still has tries remaining — eliminate the block */
export type WrongContinueOutcome = {
  result: "wrong_but_continue";
};

/** Player picked wrong and exhausted all tries — reset the round */
export type WrongExhaustedOutcome = {
  result: "wrong_and_exhausted";
};

export type ClickOutcome =
  | CorrectOutcome
  | WrongContinueOutcome
  | WrongExhaustedOutcome;

// ─── Engine ──────────────────────────────────────────────────────────────────

export const resolveColorClick = (
  isCorrect: boolean,
  state: IGameState
): ClickOutcome => {
  if (isCorrect) {
    return {
      result: "correct",
      score: buildRoundScore(state.triesLeft),
    };
  }

  if (state.triesLeft <= 1) {
    return { result: "wrong_and_exhausted" };
  }

  return { result: "wrong_but_continue" };
};
