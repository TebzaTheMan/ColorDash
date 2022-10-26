import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { HighscoreProvider } from "features/Highscore";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <HighscoreProvider>
        <Component {...pageProps} />
      </HighscoreProvider>
    </ChakraProvider>
  );
}
