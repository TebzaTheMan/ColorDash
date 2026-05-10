import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import NavBar from "components/NavBar";
import { ArrowRightIcon } from "components/icons";
import { HighScore } from "features/Highscore";
import type { GameMode } from "lib/api/generated/model";

const MODES: { id: GameMode; label: string; sub: string }[] = [
  { id: "rgb", label: "RGB", sub: "red · green · blue" },
  { id: "hsl", label: "HSL", sub: "hue · saturation · lightness" },
];

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>("rgb");

  return (
    <>
      <Head>
        <title>Color Dash — Match the readout. Beat the clock.</title>
        <meta
          name="description"
          content="Color Dash is a fast-paced color-literacy reflex game. A target color reads as rgb() or hsl() — tap the matching swatch before the clock zeroes."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative z-content min-h-screen flex flex-col px-4 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 max-w-[960px] mx-auto">
        <NavBar active="home" />

        <section className="flex-1 flex flex-col justify-center max-w-[720px]">
          <h1 className="font-bold text-ink-0 text-display-hero m-0 mb-8 sm:mb-10">
            Read the
            <br />
            <span className="bg-hero-text bg-clip-text text-transparent [filter:drop-shadow(0_0_24px_oklch(0.90_0.19_168_/_0.25))]">
              color code.
            </span>
          </h1>

          <div>
            <div className="mono text-mono-xs tracking-mono-xl text-ink-3 uppercase mb-2.5">
              Select color model
            </div>
            <div
              role="tablist"
              className="inline-flex flex-wrap gap-1 p-1 bg-bg-1 border border-line rounded-card shadow-infobar"
            >
              {MODES.map((m) => {
                const active = gameMode === m.id;
                return (
                  <button
                    key={m.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setGameMode(m.id)}
                    className={`focus-ring flex-1 sm:flex-none sm:min-w-[180px] px-[22px] py-3.5 border-0 rounded-btn font-semibold tracking-mono-sm uppercase text-left text-mono-md cursor-pointer transition-all duration-200 ease-in-out ${
                      active
                        ? "bg-tab-active text-neon shadow-tab-active"
                        : "bg-transparent text-ink-2 shadow-none"
                    }`}
                  >
                    <div
                      className={`text-base mb-0.5 ${
                        active ? "text-neon" : "text-ink-0"
                      }`}
                    >
                      {m.label}
                    </div>
                    <div
                      className={`mono text-mono-xs tracking-mono-md opacity-70 ${
                        active ? "text-neon" : "text-ink-3"
                      }`}
                    >
                      {m.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center gap-6 flex-wrap">
            <Link
              href={`/play/${gameMode}`}
              className="btn-primary focus-ring inline-flex items-center gap-3.5 !px-7 !py-5 !text-[15px] no-underline"
            >
              <span>Start dash</span>
              <ArrowRightIcon size={18} />
            </Link>

            <HighScore mode={gameMode} />
          </div>

          <div className="mt-8">
            <Link
              href="/how-to-play"
              className="focus-ring no-underline inline-flex items-center gap-2 text-ink-2 text-[13px] border-b border-dashed border-line pb-1 hover:text-ink-0"
            >
              New here? Read the rules
              <ArrowRightIcon size={14} strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
