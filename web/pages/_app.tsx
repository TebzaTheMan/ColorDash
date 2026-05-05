import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { Oxanium, JetBrains_Mono } from "next/font/google";
import Head from "next/head";
import { HighscoreProvider } from "features/Highscore";
import { ToastProvider } from "contexts/toast.context";
import "styles/global.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-oxanium",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${oxanium.variable} ${jetbrainsMono.variable} min-h-screen`}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="stage-bg" />
      <div className="scanlines" />
      <ToastProvider>
        <HighscoreProvider>
          <Component {...pageProps} />
          <Analytics />
        </HighscoreProvider>
      </ToastProvider>
    </div>
  );
}
