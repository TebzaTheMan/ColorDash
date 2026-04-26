import { createContext, ReactNode, useEffect, useState } from "react";
import { gameApi } from "lib/api/gameApi";
import type { GetHighscores200 } from "lib/api/generated/model";

interface IHighscoreContext {
  highscores: GetHighscores200;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const HighscoreContext = createContext<IHighscoreContext>({
  highscores: {},
  isLoading: true,
  refresh: async () => {},
});

export function HighscoreProvider({ children }: { children: ReactNode }) {
  const [highscores, setHighscores] = useState<GetHighscores200>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    const response = await gameApi.getHighscores();
    if (response.status === 200) {
      setHighscores(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <HighscoreContext.Provider value={{ highscores, isLoading, refresh }}>
      {children}
    </HighscoreContext.Provider>
  );
}
