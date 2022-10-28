export interface IAction {
  type: string;
}
export interface IInfobarAction extends IAction {
  score?: number;
}
export interface IInfobarState {
  score: number;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
}
