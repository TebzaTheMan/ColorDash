import { Colorblocks } from "features/colorblocks";
import { Infobar, InfobarContext } from "features/Infobar";
import { GameoverModal } from "features/GameoverModal";
import Head from "next/head";
import { useContext } from "react";
export default function Play() {
  const [infobarData] = useContext(InfobarContext);
  const isTimeUp = infobarData.timeUp;

  return (
    <>
      <Head>
        <title>{isTimeUp ? "Game Over" : "Guessing Colors Now"}</title>
        <meta
          name="description"
          content="Guess the color react game, objective of identifying as much colors as you can in the given time"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Infobar />
        <Colorblocks />
        <GameoverModal />
      </main>
    </>
  );
}
