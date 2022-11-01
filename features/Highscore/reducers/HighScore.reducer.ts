import { IHighscoreAction, IHighscoreState } from "../types";

const reducer = (state: IHighscoreState, action: IHighscoreAction) => {
  switch (action.type) {
    case "LOAD_STORED_STATE":
      return action.storedState;
    case "UPDATE_SCORE":
      return {
        previous: state.current,
        current: action.score!,
      };
    default:
      return state;
  }
};
export default reducer;
