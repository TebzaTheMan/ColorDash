import { IInfobarAction, IInfobarState } from "../types";

const reducer = (state: IInfobarState, action: IInfobarAction) => {
  switch (action.type) {
    case "TIME_UP":
      return { ...state, timeUp: true };
    default:
      return state;
  }
};
export default reducer;
