import { describe, it, expect } from "vitest";
import { resolveColorClick } from "../engine";
import { IGameState } from "types";
import { DEFAULT_GAME_STATE, SCORING_RULES } from "../constants";

// Helper to create game state with overrides
const makeState = (overrides: Partial<IGameState> = {}): IGameState => ({
  ...DEFAULT_GAME_STATE,
  mode: "rgb",
  ...overrides,
});

describe("resolveColorClick", () => {
  describe("when the user selects the correct color", () => {
    it.each(SCORING_RULES)(
      "should return correct with $points points when $triesLeft tries are left",
      ({ triesLeft, points }) => {
        const state = makeState({ triesLeft });
        const outcome = resolveColorClick(true, state);

        expect(outcome).toMatchObject({
          result: "correct",
          score: { points },
        });
      }
    );

    it("should include a score in the outcome", () => {
      const state = makeState({ triesLeft: 3 });
      const outcome = resolveColorClick(true, state);

      expect(outcome).toHaveProperty("score");
    });
  });

  describe("when the user selects the wrong color", () => {
    describe("and there are tries remaining", () => {
      it.each([3, 2])(
        "should return wrong_but_continue when %i tries are left",
        (triesLeft) => {
          const state = makeState({ triesLeft });
          const outcome = resolveColorClick(false, state);

          expect(outcome.result).toBe("wrong_but_continue");
        }
      );
    });

    describe("and no tries remain", () => {
      it.each([1, 0])(
        "should return wrong_and_exhausted when %i tries are left",
        (triesLeft) => {
          const state = makeState({ triesLeft });
          const outcome = resolveColorClick(false, state);

          expect(outcome.result).toBe("wrong_and_exhausted");
        }
      );
    });

    it("should not include a score in the outcome", () => {
      const state = makeState({ triesLeft: 3 });
      const outcome = resolveColorClick(false, state);

      expect(outcome).not.toHaveProperty("score");
    });
  });
});
