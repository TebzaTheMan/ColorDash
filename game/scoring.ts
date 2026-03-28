import { IScore } from "types";
import { MAX_POINTS_PER_ROUND } from "./constants";

export const calculateScore = (triesLeft: number): number => {
  switch (triesLeft) {
    case 3:
      return 10;
    case 2:
      return 5;
    case 1:
      return 2;
    default:
      return 0;
  }
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
