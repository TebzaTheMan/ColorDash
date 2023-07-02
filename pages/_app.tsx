import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { HighscoreProvider } from "features/Highscore";
import { GameProvider } from "contexts";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#2D3748",
      600: "#171923",
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <HighscoreProvider>
        <GameProvider>
          <Component {...pageProps} />
          <Analytics />
        </GameProvider>
      </HighscoreProvider>
    </ChakraProvider>
  );
}
