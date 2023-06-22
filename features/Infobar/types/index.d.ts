import { IScore } from "types";

export interface IInfobarAction {
  type:
    | "RESET"
    | "DECREMENT_TRIES"
    | "CORRECT_COLOR"
    | "RESET_TRIES"
    | "TIME_UP";
  score?: IScore;
  isNewHighscore?: boolean;
}
export interface IInfobarState {
  score: IScore;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;
}
