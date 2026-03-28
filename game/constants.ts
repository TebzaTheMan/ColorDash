import { IGameState } from "types";

/** Number of color blocks shown per round */
export const NUM_COLORS = 6;

/** Seconds allowed per game session */
export const GAME_DURATION_SECONDS = 30;

/** Number of tries a player starts each round with */
export const DEFAULT_TRIES = 3;

/** Maximum points achievable per correct answer (first-try perfect score) */
export const MAX_POINTS_PER_ROUND = 10;

export const DEFAULT_GAME_STATE: IGameState = {
  score: {
    points: 0,
    total: 0,
  },
  timeUp: false,
  triesLeft: DEFAULT_TRIES,
  correctColors: 0,
  isNewHighscore: false,
  mode: null,
};
