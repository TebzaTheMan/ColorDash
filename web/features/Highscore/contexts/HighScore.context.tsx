import { createContext, ReactNode, Dispatch } from "react";
import HighScoreReducer from "../reducers/HighScore.reducer";
import useLocalStorageReducer from "hooks/useLocalStorageReducer";
import { IHighscoreAction, IHighscoreState } from "../types";

const defaultHighscore: IHighscoreState = {
  rgb: {
    points: 0,
    total: 0,
  },
  hsl: {
    points: 0,
    total: 0,
  },
};
export const HighscoreContext = createContext<
  [IHighscoreState, Dispatch<IHighscoreAction>]
>([defaultHighscore, () => {}]);

export function HighscoreProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useLocalStorageReducer<IHighscoreState>(
    "highscore",
    HighScoreReducer,
    defaultHighscore
  );
  return (
    <HighscoreContext.Provider value={[state, dispatch]}>
      {children}
    </HighscoreContext.Provider>
  );
}
