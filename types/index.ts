export type TMode = "rgb" | "hsl" | null;

export const gameModes = ["hsl", "rgb"];

export interface IGameAction {
  type:
    | "RESET"
    | "DECREMENT_TRIES"
    | "CORRECT_COLOR"
    | "RESET_TRIES"
    | "TIME_UP"
    | "CHANGE_MODE";
  score?: IScore;
  isNewHighscore?: boolean;
  mode?: TMode;
}
export interface IGameState {
  score: IScore;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;
  mode: TMode;
}

export interface IScore {
  points: number;
  total: number;
}
