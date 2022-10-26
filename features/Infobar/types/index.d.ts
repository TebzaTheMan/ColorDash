export interface IAction<T> {
  type: string;
  storedState?: T;
}
export interface IInfobarAction extends IAction<IInfobarState> {
  storedState?: T;
  score?: number;
}
export interface IInfobarState {
  score: number;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
}
