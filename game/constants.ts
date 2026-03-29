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
  mode: null,
  score: {
    points: 0,
    total: 0,
  },
  triesLeft: DEFAULT_TRIES,
  correctColors: 0,
  timeUp: false,
  isNewHighscore: false,
  colors: [],
  targetColor: "",
  clickedColors: Array(NUM_COLORS).fill(false),
};

export const SCORING_RULES = [
  { triesLeft: 3, points: 10 },
  { triesLeft: 2, points: 5 },
  { triesLeft: 1, points: 2 },
];
