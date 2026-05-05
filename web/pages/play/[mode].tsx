import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Colorblocks } from "features/colorblocks";
import { Infobar } from "features/Infobar";
import { CancelButton } from "components/CancelButton";
import { GameContext, GameProvider } from "contexts";
import { useToast } from "contexts/toast.context";
import { GameoverModal } from "features/GameoverModal";
import { GameSkeleton } from "components/GameSkeleton";
import type { GameMode } from "lib/api/generated/model";

interface Props {
  mode: GameMode;
}

function PlayInner({ mode }: Props) {
  const { state: GameData, isStarting, startGame } = useContext(GameContext);
  const isTimeUp = GameData.timeUp;
  const router = useRouter();
  const { showToast } = useToast();
  const leavingRef = useRef(false);

  useEffect(() => {
    const onRouteChange = () => { leavingRef.current = true; };
    router.events.on("routeChangeStart", onRouteChange);
    return () => router.events.off("routeChangeStart", onRouteChange);
  }, [router.events]);

  useEffect(() => {
    startGame(mode).then((ok) => {
      if (!ok) {
        showToast("err", "SERVER UNAVAILABLE");
        router.push("/");
      }
    });
  }, [mode]);

  if (leavingRef.current) return null;

  if (isStarting || !GameData.mode) {
    return <GameSkeleton mode={mode} />;
  }

  return (
    <>
      <Head>
        <title>
          {isTimeUp
            ? `Game Over — ${GameData.mode.toUpperCase()} | Color Dash`
            : `${GameData.mode.toUpperCase()} | Color Dash`}
        </title>
        <meta
          name="description"
          content={`Color Dash ${GameData.mode.toUpperCase()} mode — match the readout against the swatches before the clock zeroes.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative z-content min-h-screen px-3 sm:px-6 pt-3 sm:pt-6 pb-6 sm:pb-12 max-w-[1280px] mx-auto flex flex-col gap-3 sm:gap-5">
        <div className="sm:hidden flex">
          <CancelButton />
        </div>
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
