import { createContext, ReactNode, useEffect, useState } from "react";
import { gameApi } from "lib/api/gameApi";
import type { GetHighscores200 } from "lib/api/generated/model";

interface IHighscoreContext {
  highscores: GetHighscores200;
  refresh: () => Promise<void>;
}

export const HighscoreContext = createContext<IHighscoreContext>({
  highscores: {},
  refresh: async () => {},
});

export function HighscoreProvider({ children }: { children: ReactNode }) {
  const [highscores, setHighscores] = useState<GetHighscores200>({});

  const refresh = async () => {
    const response = await gameApi.getHighscores();
    if (response.status === 200) {
      setHighscores(response.data);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <HighscoreContext.Provider value={{ highscores, refresh }}>
      {children}
    </HighscoreContext.Provider>
  );
}
