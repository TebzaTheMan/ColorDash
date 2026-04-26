import { GetServerSidePropsContext } from "next";
import { Colorblocks } from "features/colorblocks";
import { Infobar } from "features/Infobar";
import { GameContext, GameProvider } from "contexts";
import { GameoverModal } from "features/GameoverModal";
import Head from "next/head";
import { useContext, useEffect } from "react";
import type { GameMode } from "lib/api/generated/model";
import { GameSkeleton } from "components/GameSkeleton";

interface Props {
  mode: GameMode;
}

function PlayInner({ mode }: Props) {
  const { state: GameData, isStarting, startGame } = useContext(GameContext);
  const isTimeUp = GameData.timeUp;

  useEffect(() => {
    startGame(mode);
  }, [mode]);

  if (isStarting || !GameData.mode) {
    return <GameSkeleton />;
  }
  return (
    <>
      <Head>
        <title>
          {isTimeUp
            ? `Game Over - ${GameData.mode.toUpperCase()} Mode | Color Dash`
            : `${GameData.mode.toUpperCase()} Mode | Color Dash`}
        </title>
        <meta
          name="description"
          content={`Engage in the ${GameData.mode} mode of Color Dash and put your color perception to the test. Guess the correct colors based on RGB codes within the time limit. Challenge yourself and earn high scores.`}
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

export default function Play({ mode }: Props) {
  return (
    <GameProvider>
      <PlayInner mode={mode} />
    </GameProvider>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { mode } = context.query;
  if (mode === undefined || (mode !== "rgb" && mode !== "hsl")) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      mode: mode as GameMode,
    },
  };
}
