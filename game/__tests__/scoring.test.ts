import { describe, it, expect } from "vitest";
import { calculateScore, isNewHighscore, buildRoundScore } from "../scoring";
import { MAX_POINTS_PER_ROUND, SCORING_RULES } from "../constants";

describe("calculateScore", () => {
  it.each(SCORING_RULES)(
    "should return $points points when $triesLeft tries are left",
    ({ triesLeft, points }) => {
      expect(calculateScore(triesLeft)).toBe(points);
    }
  );

  it.each([0, -1, 999])(
    "should return 0 when triesLeft is %i and no rule exists",
    (triesLeft) => {
      expect(calculateScore(triesLeft)).toBe(0);
    }
  );
});

describe("isNewHighscore", () => {
  it.each([
    {
      current: { points: 5, total: 20 },
      best: { points: 10, total: 10 },
      expected: true,
      case: "current total is higher than best",
    },
    {
      current: { points: 10, total: 10 },
      best: { points: 5, total: 20 },
      expected: false,
      case: "current total is lower than best",
    },
    {
      current: { points: 8, total: 10 },
      best: { points: 5, total: 10 },
      expected: true,
      case: "totals are equal but current points are higher",
    },
    {
      current: { points: 3, total: 10 },
      best: { points: 5, total: 10 },
      expected: false,
      case: "totals are equal but current points are lower",
    },
    {
      current: { points: 5, total: 10 },
      best: { points: 5, total: 10 },
      expected: false,
      case: "totals and points are equal",
    },
    {
      current: { points: 0, total: 0 },
      best: { points: 0, total: 0 },
      expected: false,
      case: "both scores are zero",
    },
  ])("should return $expected when $case", ({ current, best, expected }) => {
    expect(isNewHighscore(current, best)).toBe(expected);
  });
});

describe("buildRoundScore", () => {
  it.each(SCORING_RULES)(
    "should build a score with $points points and max total when $triesLeft tries are left",
    ({ triesLeft, points }) => {
      expect(buildRoundScore(triesLeft)).toEqual({
        points,
        total: MAX_POINTS_PER_ROUND,
      });
    }
  );

  it("should always use MAX_POINTS_PER_ROUND as total", () => {
    for (const tries of [1, 2, 3]) {
      expect(buildRoundScore(tries).total).toBe(MAX_POINTS_PER_ROUND);
    }
  });
});
