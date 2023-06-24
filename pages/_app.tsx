import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider } from "@chakra-ui/react";
import { HighscoreProvider } from "features/Highscore";
import { GameProvider } from "contexts";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <HighscoreProvider>
        <GameProvider>
          <Component {...pageProps} />
          <Analytics />
        </GameProvider>
      </HighscoreProvider>
    </ChakraProvider>
  );
}
