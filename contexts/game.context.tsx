import { createContext, ReactNode, Dispatch } from "react";
import { GameReducer } from "reducers";
import { useReducer } from "react";
import { IGameAction, IGameState } from "types";

export const defaultGame: IGameState = {
  score: {
    points: 0,
    total: 0,
  },
  timeUp: false,
  triesLeft: 3,
  correctColors: 0,
  isNewHighscore: false,
};
export const GameContext = createContext<[IGameState, Dispatch<IGameAction>]>([
  defaultGame,
  () => {},
]);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(GameReducer, defaultGame);
  return (
    <GameContext.Provider value={[state, dispatch]}>
      {children}
    </GameContext.Provider>
  );
}
