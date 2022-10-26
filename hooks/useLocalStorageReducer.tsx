import { IAction } from "features/Highscore/types";
import { useReducer, useEffect, Reducer } from "react";

function useLocalStorageReducer<S>(
  key: string,
  reducer: Reducer<S, IAction<S>>,
  defaultValue: S
) {
  const [state, dispatch] = useReducer(reducer, defaultValue);

  useEffect(() => {
    if (localStorage.getItem(key)) {
      // if key exists
      dispatch({
        type: "LOAD_STORED_STATE",
        storedState: JSON.parse(localStorage.getItem(key)!),
      });
    }
  }, []);

  useEffect(() => {
    if (state !== defaultValue) {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return { state: state, dispatch: dispatch };
}
export default useLocalStorageReducer;
