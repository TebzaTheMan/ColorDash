import { IGameAction, IGameState } from "types";
import { DEFAULT_GAME_STATE } from "game/constants";

export const GameReducer = (
  state: IGameState,
  action: IGameAction
): IGameState => {
  switch (action.type) {
    case "RESET":
      return DEFAULT_GAME_STATE;

    case "GAME_STARTED":
      return {
        ...DEFAULT_GAME_STATE,
        mode: action.data.mode as IGameState["mode"],
        colors: action.data.colors,
        targetColor: action.data.targetLabel,
        triesLeft: Number(action.data.triesLeft),
        expiresAt: action.data.expiresAt,
        sessionId: action.sessionId,
        clickedColors: new Array(action.data.colors.length).fill(false),
      };

    case "GUESS_RESULT": {
      const { data, guessIndex } = action;
      const isCorrect = data.result === "correct";
      const isNewRound = data.nextColors != null;

      const clickedColors = [...state.clickedColors];
      clickedColors[guessIndex] = true;

      return {
        ...state,
        score: {
          points: Number(data.score.points),
          total: Number(data.score.total),
        },
        triesLeft: Number(data.triesLeft),
        correctColors: isCorrect
          ? state.correctColors + 1
          : state.correctColors,
        colors: data.nextColors ?? state.colors,
        targetColor: data.nextTargetLabel ?? state.targetColor,
        clickedColors: isNewRound
          ? new Array((data.nextColors ?? state.colors).length).fill(false)
          : clickedColors,
        correctColorIndex: isNewRound
          ? null
          : isCorrect
            ? guessIndex
            : state.correctColorIndex,
        lastGuessResult: { result: data.result, id: Date.now() },
      };
    }

    case "GAME_ENDED":
      return {
        ...state,
        timeUp: true,
        isNewHighscore: action.data.isNewHighscore,
        score: {
          points: Number(action.data.finalScore.points),
          total: Number(action.data.finalScore.total),
        },
      };

    default:
      return state;
  }
};
