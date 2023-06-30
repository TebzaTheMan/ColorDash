import { GetServerSidePropsContext } from "next";
import { Colorblocks } from "features/colorblocks";
import { Infobar } from "features/Infobar";
import { GameContext } from "contexts";
import { GameoverModal } from "features/GameoverModal";
import Head from "next/head";
import { useContext, useEffect } from "react";
import { TMode } from "types";

interface Props {
  mode: TMode;
}
export default function Play({ mode }: Props) {
  const [GameData, gameDispatch] = useContext(GameContext);
  const isTimeUp = GameData.timeUp;

  useEffect(() => {
    gameDispatch({
      type: "CHANGE_MODE",
      mode: mode,
    });
  }, []);

  if (GameData.mode == null) {
    return;
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
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { mode } = context.query; // Access the URL parameter from the context object
  if (mode === undefined || (mode !== "rgb" && mode !== "hsl")) {
    return {
      notFound: true, // Return a 404 page if the mode is invalid
    };
  }
  return {
    props: {
      mode: mode as TMode,
    },
  };
}
