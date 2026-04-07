import { IScore } from "types";
import { MAX_POINTS_PER_ROUND, SCORING_RULES } from "./constants";

export const calculateScore = (triesLeft: number): number => {
  const rule = SCORING_RULES.find((r) => r.triesLeft === triesLeft);
  return rule ? rule.points : 0;
};

export const isNewHighscore = (current: IScore, best: IScore): boolean => {
  if (current.total === best.total) {
    return current.points > best.points;
  }
  return current.total > best.total;
};

export const buildRoundScore = (triesLeft: number): IScore => ({
  points: calculateScore(triesLeft),
  total: MAX_POINTS_PER_ROUND,
});
