import { IGameAction, IGameState } from "types";
import { DEFAULT_GAME_STATE } from "game/constants";

export const GameReducer = (state: IGameState, action: IGameAction) => {
  switch (action.type) {
    case "RESET":
      return DEFAULT_GAME_STATE;
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
        triesLeft: DEFAULT_GAME_STATE.triesLeft,
      };
    case "RESET_TRIES":
      return {
        ...state,
        triesLeft: DEFAULT_GAME_STATE.triesLeft,
      };
    case "CHANGE_MODE":
      return {
        ...state,
        mode: action.mode!,
      };
    default:
      return state;
  }
};
