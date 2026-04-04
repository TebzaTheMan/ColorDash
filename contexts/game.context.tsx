import { createContext, ReactNode, Dispatch } from "react";
import { GameReducer } from "reducers";
import { useReducer } from "react";
import { IGameAction, IGameState } from "types";
import { DEFAULT_GAME_STATE } from "game/constants";

export const GameContext = createContext<[IGameState, Dispatch<IGameAction>]>([
  DEFAULT_GAME_STATE,
  () => {},
]);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(GameReducer, DEFAULT_GAME_STATE);
  return (
    <GameContext.Provider value={[state, dispatch]}>
      {children}
    </GameContext.Provider>
  );
}
