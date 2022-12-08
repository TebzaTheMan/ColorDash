export interface IAction<T> {
  type: "UPDATE_SCORE" | "LOAD_STORED_STATE";
  storedState?: T;
}

export interface IHighscoreState {
  current: number;
}
export interface IHighscoreAction extends IAction<IHighscoreState> {
  score?: number;
  storedState?: T;
}
