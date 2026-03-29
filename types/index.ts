export type TMode = "rgb" | "hsl" | null;

export const gameModes = ["hsl", "rgb"];

export interface IGameAction {
  type: "START_MODE" | "SUBMIT_GUESS" | "TIME_UP" | "RESET";
  mode?: TMode;
  index?: number;
  isNewHighscore?: boolean;
}

export type ClickOutcomeResult =
  | "correct"
  | "wrong_but_continue"
  | "wrong_and_exhausted";

export interface IGameState {
  mode: TMode;
  score: IScore;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;

  colors: string[];
  targetColor: string;
  clickedColors: boolean[];
  gameStartTimestamp: number;

  lastGuessResult?: {
    result: ClickOutcomeResult;
    id: number;
  };
}

export interface IScore {
  points: number;
  total: number;
}
