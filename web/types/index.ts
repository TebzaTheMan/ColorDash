import type {
  GameMode,
  GuessResult,
  GameStartedResponse,
  GuessResultResponse,
  EndGameResponse,
  ScoreDto,
} from "lib/api/generated/model";

export type IGameAction =
  | { type: "RESET" }
  | { type: "GAME_STARTED"; data: GameStartedResponse; sessionId: string }
  | { type: "GUESS_RESULT"; data: GuessResultResponse; guessIndex: number }
  | { type: "GAME_ENDED"; data: EndGameResponse };

export interface IGameState {
  mode: GameMode | undefined;
  score: ScoreDto;
  triesLeft: number;
  correctColors: number;
  timeUp: boolean;
  isNewHighscore?: boolean;

  colors: string[];
  targetColor: string;
  clickedColors: boolean[];
  expiresAt: string | null;
  sessionId: string | null;
  correctColorIndex: number | null;

  lastGuessResult?: {
    result: GuessResult;
    id: number;
  };
}
