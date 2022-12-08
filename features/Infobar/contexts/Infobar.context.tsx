import { createContext, ReactNode, Dispatch } from "react";
import InfobarReducer from "../reducers/Infobar.reducer";
import { useReducer } from "react";
import { IInfobarAction, IInfobarState } from "../types";

export const defaultInfobar: IInfobarState = {
  score: 0,
  timeUp: false,
  triesLeft: 3,
  correctColors: 0,
  isNewHighscore: false,
};
export const InfobarContext = createContext<
  [IInfobarState, Dispatch<IInfobarAction>]
>([defaultInfobar, () => {}]);

export function InfobarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(InfobarReducer, defaultInfobar);
  return (
    <InfobarContext.Provider value={[state, dispatch]}>
      {children}
    </InfobarContext.Provider>
  );
}
