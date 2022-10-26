import { createContext, ReactNode, Dispatch } from "react";
import InfobarReducer from "../reducers/Infobar.reducer";
import useLocalStorageReducer from "hooks/useLocalStorageReducer";
import { IInfobarAction, IInfobarState } from "../types";

const defaultInfobar: IInfobarState = {
  score: 0,
  timeLeft: { minutes: 0, seconds: 0 },
  triesLeft: 3,
  correctColors: 0,
};
export const InfobarContext = createContext<
  [IInfobarState, Dispatch<IInfobarAction>]
>([defaultInfobar, () => {}]);

export function InfobarProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useLocalStorageReducer<IInfobarState>(
    "Infobar",
    InfobarReducer,
    defaultInfobar
  );
  return (
    <InfobarContext.Provider value={[state, dispatch]}>
      {children}
    </InfobarContext.Provider>
  );
}
