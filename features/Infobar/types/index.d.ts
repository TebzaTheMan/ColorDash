export interface IInfobarAction {
  type:
    | "RESET"
    | "DECREMENT_TRIES"
    | "CORRECT_COLOR"
    | "RESET_TRIES"
    | "TIME_UP";
  score?: number;
}
export interface IInfobarState {
  score: number;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
}
