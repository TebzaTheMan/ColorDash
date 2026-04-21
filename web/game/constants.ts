import { IGameState } from "types";

/** Number of color blocks shown per round */
export const NUM_COLORS = 6;

/** Seconds allowed per game session */
export const GAME_DURATION_SECONDS = 30;

/** Number of tries a player starts each round with */
export const DEFAULT_TRIES = 3;

export const DEFAULT_GAME_STATE: IGameState = {
  mode: undefined,
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
  gameStartTimestamp: 0,
  sessionId: null,
  correctColorIndex: null,
};
