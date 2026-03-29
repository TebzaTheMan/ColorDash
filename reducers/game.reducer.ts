import { IGameAction, IGameState } from "types";
import { DEFAULT_GAME_STATE, NUM_COLORS } from "game/constants";
import { generateColors, pickCorrectColor } from "game/colors";
import { resolveColorClick } from "game/engine";

let guessIdCounter = 0;

export const GameReducer = (
  state: IGameState,
  action: IGameAction
): IGameState => {
  switch (action.type) {
    case "START_MODE": {
      const mode = action.mode!;
      const newColors = generateColors(mode);
      return {
        ...DEFAULT_GAME_STATE,
        mode,
        colors: newColors,
        targetColor: pickCorrectColor(newColors),
        clickedColors: Array(NUM_COLORS).fill(false),
        gameStartTimestamp: Date.now(),
      };
    }

    case "RESET": {
      if (!state.mode) return DEFAULT_GAME_STATE;
      const newColors = generateColors(state.mode);
      return {
        ...DEFAULT_GAME_STATE,
        mode: state.mode,
        colors: newColors,
        targetColor: pickCorrectColor(newColors),
        clickedColors: Array(NUM_COLORS).fill(false),
        gameStartTimestamp: Date.now(),
      };
    }

    case "TIME_UP":
      return { ...state, timeUp: true, isNewHighscore: action.isNewHighscore };

    case "SUBMIT_GUESS": {
      if (state.timeUp || !state.mode) return state;

      const index = action.index!;
      // Prevent clicking already clicked colors
      if (state.clickedColors[index]) return state;

      const isCorrect = state.colors[index] === state.targetColor;
      const outcome = resolveColorClick(isCorrect, state);
      guessIdCounter += 1;

      if (outcome.result === "correct") {
        const newColors = generateColors(state.mode);
        return {
          ...state,
          score: {
            points: state.score.points + outcome.score.points,
            total: state.score.total + outcome.score.total,
          },
          correctColors: state.correctColors + 1,
          triesLeft: DEFAULT_GAME_STATE.triesLeft,
          colors: newColors,
          targetColor: pickCorrectColor(newColors),
          clickedColors: Array(NUM_COLORS).fill(false),
          lastGuessResult: { result: "correct", id: guessIdCounter },
        };
      }

      const newClickedColors = [...state.clickedColors];
      newClickedColors[index] = true;

      if (outcome.result === "wrong_and_exhausted") {
        const newColors = generateColors(state.mode);
        return {
          ...state,
          triesLeft: DEFAULT_GAME_STATE.triesLeft,
          colors: newColors,
          targetColor: pickCorrectColor(newColors),
          clickedColors: Array(NUM_COLORS).fill(false),
          lastGuessResult: {
            result: "wrong_and_exhausted",
            id: guessIdCounter,
          },
        };
      }

      // wrong_but_continue
      return {
        ...state,
        triesLeft: state.triesLeft - 1,
        clickedColors: newClickedColors,
        lastGuessResult: { result: "wrong_but_continue", id: guessIdCounter },
      };
    }

    default:
      return state;
  }
};
