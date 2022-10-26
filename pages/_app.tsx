import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { HighscoreProvider } from "features/Highscore";
import { InfobarProvider } from "features/Infobar/contexts/Infobar.context";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <HighscoreProvider>
        <InfobarProvider>
          <Component {...pageProps} />
        </InfobarProvider>
      </HighscoreProvider>
    </ChakraProvider>
  );
}
