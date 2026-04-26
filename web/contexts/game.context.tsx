import { createContext, ReactNode, useReducer, useRef, useState } from "react";
import { GameReducer } from "reducers";
import { IGameState } from "types";
import type { GameMode } from "lib/api/generated/model";
import { DEFAULT_GAME_STATE } from "game/constants";
import { gameApi } from "lib/api/gameApi";

interface IGameContext {
  state: IGameState;
  isStarting: boolean;
  startGame: (mode: GameMode) => Promise<boolean>;
  submitGuess: (colorIndex: number) => Promise<void>;
  endGame: () => Promise<void>;
  reset: () => void;
}

export const GameContext = createContext<IGameContext>({
  state: DEFAULT_GAME_STATE,
  isStarting: false,
  startGame: async () => false,
  submitGuess: async () => {},
  endGame: async () => {},
  reset: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(GameReducer, DEFAULT_GAME_STATE);
  const [isStarting, setIsStarting] = useState(false);
  // startingRef guards against concurrent calls (ref is synchronous; state is not).
  const startingRef = useRef(false);
  const startKeyRef = useRef<string | null>(null);
  const guessKeyRef = useRef<string | null>(null);

  const startGame = async (mode: GameMode): Promise<boolean> => {
    if (startingRef.current) return false;
    startingRef.current = true;
    setIsStarting(true);
    if (!startKeyRef.current) startKeyRef.current = crypto.randomUUID();
    try {
      const response = await gameApi.startGame(mode, {
        headers: { 'Idempotency-Key': startKeyRef.current },
      });
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: "GAME_STARTED",
          data: response.data,
          sessionId: response.data.sessionId,
        });
        return true;
      }
      return false;
    } finally {
      startingRef.current = false;
      setIsStarting(false);
    }
  };

  const submitGuess = async (colorIndex: number) => {
    if (!state.sessionId) return;
    if (!guessKeyRef.current) guessKeyRef.current = crypto.randomUUID();
    const response = await gameApi.submitGuess(state.sessionId, colorIndex, guessKeyRef.current);
    if (response.status === 200) {
      guessKeyRef.current = null;
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
    startKeyRef.current = null;
    guessKeyRef.current = null;
    dispatch({ type: "RESET" });
  };

  return (
    <GameContext.Provider value={{ state, isStarting, startGame, submitGuess, endGame, reset }}>
      {children}
    </GameContext.Provider>
  );
}
