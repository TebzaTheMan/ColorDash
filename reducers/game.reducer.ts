import { defaultGame } from "contexts/game.context";
import { IGameAction, IGameState } from "types";

export const GameReducer = (state: IGameState, action: IGameAction) => {
  switch (action.type) {
    case "RESET":
      return defaultGame;
    case "TIME_UP":
      return { ...state, timeUp: true, isNewHighscore: action.isNewHighscore };
    case "DECREMENT_TRIES":
      return { ...state, triesLeft: state.triesLeft - 1 };
    case "CORRECT_COLOR":
      return {
        ...state,
        score: {
          points: state.score.points + action.score!.points,
          total: state.score.total + action.score!.total,
        },
        correctColors: state.correctColors + 1,
        triesLeft: defaultGame.triesLeft,
      };
    case "RESET_TRIES":
      return {
        ...state,
        triesLeft: defaultGame.triesLeft,
      };
    default:
      return state;
  }
};
