import { IGameState } from "types";

// needs to match with the backend
export const SCORING_RULES: {
  triesLeft: number;
  points: number;
  label: string;
}[] = [
  { triesLeft: 3, points: 10, label: "First try" },
  { triesLeft: 2, points: 5, label: "Second try" },
  { triesLeft: 1, points: 2, label: "Third try" },
];

export const DEFAULT_GAME_STATE: IGameState = {
  mode: undefined,
  score: {
    points: 0,
    total: 0,
  },
  triesLeft: 0,
  correctColors: 0,
  timeUp: false,
  isNewHighscore: false,
  colors: [],
  targetColor: "",
  clickedColors: [],
  expiresAt: null,
  sessionId: null,
  correctColorIndex: null,
};
