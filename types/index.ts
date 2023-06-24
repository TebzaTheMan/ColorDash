export interface IGameAction {
  type:
    | "RESET"
    | "DECREMENT_TRIES"
    | "CORRECT_COLOR"
    | "RESET_TRIES"
    | "TIME_UP";
  score?: IScore;
  isNewHighscore?: boolean;
}
export interface IGameState {
  score: IScore;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;
}

export interface IScore {
  points: number;
  total: number;
}
