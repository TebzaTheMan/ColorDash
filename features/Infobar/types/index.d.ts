export interface IAction<T> {
  type: string;
  storedState?: T;
}
export interface IInfobarAction extends IAction<IInfobarState> {
  score?: number;
  storedState?: T;
}

interface time {
  minutes: number;
  seconds: number;
}
export interface IInfobarState {
  score: number;
  timeLeft: time;
  triesLeft: number;
  correctColors: number;
}
