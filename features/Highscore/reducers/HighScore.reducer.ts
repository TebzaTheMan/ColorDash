import { UPDATE_SCORE, LOAD_STORED_STATE } from "../constants/actions";
import { IHighscoreAction, IHighscoreState } from "../types";

const reducer = (state: IHighscoreState, action: IHighscoreAction) => {
  switch (action.type) {
    case LOAD_STORED_STATE:
      return action.storedState;
    case UPDATE_SCORE:
      return { current: state.current + action.score! };
    default:
      return state;
  }
};
export default reducer;
