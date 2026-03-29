import { IGameDependencies, IGameState, TMode } from "types";
import { DEFAULT_GAME_STATE, NUM_COLORS } from "./constants";
import { buildRoundScore } from "./scoring";

// The pure engine functions for the game logic. All side effects are injected.

export const startGame = (mode: TMode, deps: IGameDependencies): IGameState => {
  const newColors = deps.generateColors(mode);
  return {
    ...DEFAULT_GAME_STATE,
    mode,
    colors: newColors,
    targetColor: deps.pickCorrectColor(newColors),
    clickedColors: Array(NUM_COLORS).fill(false),
    gameStartTimestamp: deps.now(),
  };
};

export const resetGame = (
  state: IGameState,
  deps: IGameDependencies
): IGameState => {
  if (!state.mode) return DEFAULT_GAME_STATE;
  const newColors = deps.generateColors(state.mode);
  return {
    ...DEFAULT_GAME_STATE,
    mode: state.mode,
    colors: newColors,
    targetColor: deps.pickCorrectColor(newColors),
    clickedColors: Array(NUM_COLORS).fill(false),
    gameStartTimestamp: deps.now(),
  };
};

export const handleTimeUp = (
  state: IGameState,
  isNewHighscore: boolean | undefined
): IGameState => {
  return { ...state, timeUp: true, isNewHighscore };
};

export const processGuess = (
  state: IGameState,
  index: number,
  deps: IGameDependencies
): IGameState => {
  if (state.timeUp || !state.mode) return state;

  // Prevent clicking already clicked colors
  if (state.clickedColors[index]) return state;

  const isCorrect = state.colors[index] === state.targetColor;

  // Calculate next ID purely based on state
  const nextGuessId = state.lastGuessResult ? state.lastGuessResult.id + 1 : 1;

  if (isCorrect) {
    const outcomeScore = buildRoundScore(state.triesLeft);
    const newColors = deps.generateColors(state.mode);
    return {
      ...state,
      score: {
        points: state.score.points + outcomeScore.points,
        total: state.score.total + outcomeScore.total,
      },
      correctColors: state.correctColors + 1,
      triesLeft: DEFAULT_GAME_STATE.triesLeft,
      colors: newColors,
      targetColor: deps.pickCorrectColor(newColors),
      clickedColors: Array(NUM_COLORS).fill(false),
      lastGuessResult: { result: "correct", id: nextGuessId },
    };
  }

  const newClickedColors = [...state.clickedColors];
  newClickedColors[index] = true;

  if (state.triesLeft <= 1) {
    const newColors = deps.generateColors(state.mode);
    return {
      ...state,
      triesLeft: DEFAULT_GAME_STATE.triesLeft,
      colors: newColors,
      targetColor: deps.pickCorrectColor(newColors),
      clickedColors: Array(NUM_COLORS).fill(false),
      lastGuessResult: {
        result: "wrong_and_exhausted",
        id: nextGuessId,
      },
    };
  }

  // wrong_but_continue
  return {
    ...state,
    triesLeft: state.triesLeft - 1,
    clickedColors: newClickedColors,
    lastGuessResult: { result: "wrong_but_continue", id: nextGuessId },
  };
};
