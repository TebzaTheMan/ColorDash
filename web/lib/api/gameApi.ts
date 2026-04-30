import {
  startGame,
  submitGuess,
  endGame,
  getHighscores,
} from "./generated/colordash";
import type { GameMode } from "./generated/model";

export const gameApi = {
  startGame: (mode: GameMode, options?: RequestInit) =>
    startGame({ mode }, options),
  submitGuess: (
    sessionId: string,
    colorIndex: number,
    idempotencyKey: string
  ) =>
    submitGuess(
      sessionId,
      { colorIndex },
      {
        headers: { "Idempotency-Key": idempotencyKey },
      }
    ),
  endGame: (sessionId: string) => endGame(sessionId),
  getHighscores: () => getHighscores(),
};
