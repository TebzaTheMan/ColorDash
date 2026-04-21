import { createContext, ReactNode, useReducer } from "react";
import { GameReducer } from "reducers";
import { IGameState } from "types";
import type { GameMode } from "lib/api/generated/model";
import { DEFAULT_GAME_STATE } from "game/constants";
import { gameApi } from "lib/api/gameApi";

interface IGameContext {
  state: IGameState;
  startGame: (mode: GameMode) => Promise<void>;
  submitGuess: (colorIndex: number) => Promise<void>;
  endGame: () => Promise<void>;
  reset: () => void;
}

export const GameContext = createContext<IGameContext>({
  state: DEFAULT_GAME_STATE,
  startGame: async () => {},
  submitGuess: async () => {},
  endGame: async () => {},
  reset: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(GameReducer, DEFAULT_GAME_STATE);

  const startGame = async (mode: GameMode) => {
    const response = await gameApi.startGame(mode);
    if (response.status === 201) {
      dispatch({
        type: "GAME_STARTED",
        data: response.data,
        sessionId: response.data.sessionId,
      });
    }
  };

  const submitGuess = async (colorIndex: number) => {
    if (!state.sessionId) return;
    const response = await gameApi.submitGuess(state.sessionId, colorIndex);
    if (response.status === 200) {
      dispatch({
        type: "GUESS_RESULT",
        data: response.data,
        guessIndex: colorIndex,
      });
    }
  };

  const endGame = async () => {
    if (!state.sessionId) return;
    const response = await gameApi.endGame(state.sessionId);
    if (response.status === 200) {
      dispatch({ type: "GAME_ENDED", data: response.data });
    }
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <GameContext.Provider value={{ state, startGame, submitGuess, endGame, reset }}>
      {children}
    </GameContext.Provider>
  );
}
