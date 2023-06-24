import { Colorblocks } from "features/colorblocks";
import { Infobar } from "features/Infobar";
import { GameContext } from "contexts";
import { GameoverModal } from "features/GameoverModal";
import Head from "next/head";
import { useContext } from "react";
export default function Play() {
  const [GameData] = useContext(GameContext);
  const isTimeUp = GameData.timeUp;

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
