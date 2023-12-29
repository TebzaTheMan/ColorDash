import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { HighscoreProvider } from "features/Highscore";
import { GameProvider } from "contexts";
import "styles/global.css";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#171923",
      600: "#282c3e",
    },
    text: {
      main: "#171923",
    },
    background: {
      main: "#f5f6f7",
      50: "#f1f2f4",
      100: "#e3e6e8",
      200: "#c6ccd2",
      300: "#aab3bb",
      400: "#8e99a4",
      500: "#717f8e",
      600: "#5b6671",
      700: "#444c55",
      800: "#2d3339",
      900: "#17191c",
    },
    primary: {
      main: "#171923",
      50: "#f0f0f5",
      100: "#e0e2eb",
      200: "#c1c5d7",
      300: "#a2a8c3",
      400: "#848bae",
      500: "#656e9a",
      600: "#51587b",
      700: "#3c425d",
      800: "#282c3e",
      900: "#14161f",
    },
    secondary: {
      main: "#b2b6c9",
      50: "#f0f1f5",
      100: "#e1e2ea",
      200: "#c3c6d5",
      300: "#a5a9c0",
      400: "#878dab",
      500: "#697096",
      600: "#545a78",
      700: "#3f435a",
      800: "#2a2d3c",
      900: "#15161e",
    },
    accent: {
      main: "#eb9d56",
      50: "#fcf2e8",
      100: "#fae5d1",
      200: "#f4cba4",
      300: "#efb076",
      400: "#ea9648",
      500: "#e47c1b",
      600: "#b76315",
      700: "#894a10",
      800: "#5b320b",
      900: "#2e1905",
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
