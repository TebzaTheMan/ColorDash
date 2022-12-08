export interface IInfobarAction {
  type:
    | "RESET"
    | "DECREMENT_TRIES"
    | "CORRECT_COLOR"
    | "RESET_TRIES"
    | "TIME_UP";
  score?: number;
  isNewHighscore?: boolean;
}
export interface IInfobarState {
  score: number;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;
}
