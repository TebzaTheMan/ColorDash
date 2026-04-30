import { createContext, ReactNode, useReducer, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { GameReducer } from "reducers";
import { IGameState } from "types";
import type { GameMode } from "lib/api/generated/model";
import { DEFAULT_GAME_STATE } from "game/constants";
import { gameApi } from "lib/api/gameApi";

const SESSION_GONE_STATUSES: readonly number[] = [403, 404, 410];

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
  // Concurrent callers share this promise so dedup doesn't look like a failure.
  const startPromiseRef = useRef<Promise<boolean> | null>(null);
  const startKeyRef = useRef<string | null>(null);
  const guessKeyRef = useRef<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const showSessionGone = () => {
    toast({
      title: "Session no longer valid",
      description: "Returning to the home page.",
      status: "warning",
      duration: 4000,
      isClosable: true,
    });
  };

  const showNetworkError = () => {
    toast({
      title: "Network error",
      description: "Please check your connection and try again.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  };

  const reset = () => {
    startKeyRef.current = null;
    guessKeyRef.current = null;
    dispatch({ type: "RESET" });
  };

  const abandonSession = () => {
    reset();
    router.push("/");
  };

  const handleSessionResponseError = (status: number) => {
    if (SESSION_GONE_STATUSES.includes(status)) {
      showSessionGone();
      abandonSession();
      return;
    }
    showNetworkError();
  };

  const startGame = (mode: GameMode): Promise<boolean> => {
    if (startPromiseRef.current) return startPromiseRef.current;
    setIsStarting(true);
    if (!startKeyRef.current) startKeyRef.current = crypto.randomUUID();

    const run = (async (): Promise<boolean> => {
      try {
        const response = await gameApi.startGame(mode, {
          headers: { "Idempotency-Key": startKeyRef.current! },
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
        setIsStarting(false);
        startPromiseRef.current = null;
      }
    })();

    startPromiseRef.current = run;
    return run;
  };

  const submitGuess = async (colorIndex: number) => {
    if (!state.sessionId) return;
    if (!guessKeyRef.current) guessKeyRef.current = crypto.randomUUID();
    const response = await gameApi.submitGuess(
      state.sessionId,
      colorIndex,
      guessKeyRef.current
    );
    if (response.status === 200) {
      guessKeyRef.current = null;
      dispatch({
        type: "GUESS_RESULT",
        data: response.data,
        guessIndex: colorIndex,
      });
      return;
    }
    handleSessionResponseError(response.status);
  };

  const endGame = async () => {
    if (!state.sessionId) return;
    const response = await gameApi.endGame(state.sessionId);
    if (response.status === 200) {
      dispatch({ type: "GAME_ENDED", data: response.data });
      return;
    }
    handleSessionResponseError(response.status);
  };

  return (
    <GameContext.Provider
      value={{ state, isStarting, startGame, submitGuess, endGame, reset }}
    >
      {children}
    </GameContext.Provider>
  );
}
