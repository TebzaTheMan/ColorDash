import { IScore, TMode } from "types";

export interface IAction<T> {
  type: "UPDATE_SCORE" | "LOAD_STORED_STATE";
  storedState?: T;
}

export interface IHighscoreState {
  rgb: IScore;
  hsl: IScore;
}
export interface IHighscoreAction extends IAction<IHighscoreState> {
  score?: IScore;
  storedState?: T;
  mode?: TMode;
}
