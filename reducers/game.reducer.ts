import { IGameAction, IGameDependencies, IGameState } from "types";
import { generateColors, pickCorrectColor } from "game/colors";
import { handleTimeUp, processGuess, resetGame, startGame } from "game/engine";

const liveDependencies: IGameDependencies = {
  generateColors,
  pickCorrectColor,
  now: Date.now,
};

export const GameReducer = (
  state: IGameState,
  action: IGameAction
): IGameState => {
  switch (action.type) {
    case "START_MODE":
      return startGame(action.mode!, liveDependencies);

    case "RESET":
      return resetGame(state, liveDependencies);

    case "TIME_UP":
      return handleTimeUp(state, action.isNewHighscore);

    case "SUBMIT_GUESS":
      return processGuess(state, action.index!, liveDependencies);

    default:
      return state;
  }
};
