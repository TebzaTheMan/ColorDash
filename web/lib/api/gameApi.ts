import {
  startGame,
  submitGuess,
  endGame,
  getHighscores,
} from './generated/colordash';
import type { GameMode } from './generated/model';

export const gameApi = {
  startGame: (mode: GameMode) => startGame({ mode }),
  submitGuess: (sessionId: string, colorIndex: number) =>
    submitGuess(sessionId, { colorIndex }),
  endGame: (sessionId: string) => endGame(sessionId),
  getHighscores: () => getHighscores(),
};
