import Head from "next/head";
import Link from "next/link";
import NavBar from "components/NavBar";
import {
  GAME_DURATION_SECONDS,
  NUM_COLORS,
  DEFAULT_TRIES,
  SCORING_RULES,
} from "game/constants";

const SCORING_TILE_COLORS = ["text-neon", "text-amber", "text-violet"];
const SCORING_TILE_ORDINALS = ["1st", "2nd", "3rd"];

const TIPS: { tag: string; tip: string }[] = [
  {
    tag: "RGB",
    tip: "Big R + small G,B trends red. Equal R=G=B reads grey. Saturation comes from the spread between the three values.",
  },
  {
    tag: "HSL",
    tip: "Hue is a 360° wheel: 0° red, 120° green, 240° blue. Lightness drives black↔white; saturation drives grey↔neon.",
  },
  {
    tag: "EYE",
    tip: "Scan the grid in pairs. Toss out the obvious mismatches first, then compare the remaining 2-3 closely.",
  },
  {
    tag: "NERVE",
    tip: "Don't panic-tap. A wrong guess on try 1 still leaves you 5 points on try 2 — but only if you steady up.",
  },
];

function StatTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="card bg-panel p-4 sm:p-5 min-h-[110px] sm:min-h-[116px] flex flex-col justify-between">
      <div className="mono text-mono-xs tracking-mono-xl text-ink-3 uppercase">
        {label}
      </div>
      <div className="mono text-3xl sm:text-[38px] font-bold text-neon text-shadow-neon-soft tabular-nums leading-none">
        {value}
        {unit && (
          <span className="text-sm text-ink-3 font-medium tracking-mono-md ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function HowToPlay() {
  return (
    <>
      <Head>
        <title>How to Play — Color Dash</title>
        <meta
          name="description"
          content="Match a target color code to one of six swatches before the clock zeroes. Read the rules, scoring, and tips for Color Dash."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative z-content min-h-screen flex flex-col px-4 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 max-w-[960px] mx-auto">
        <NavBar active="howto" />

        <section className="mb-12 sm:mb-16">
          <div className="mono text-mono-sm tracking-mono-2xl text-neon uppercase mb-4 sm:mb-5">
            ▸ Manual · Section 01
          </div>
          <h1 className="font-bold text-ink-0 text-display-hero m-0 mb-5">
            How to play.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-ink-1 max-w-[640px] m-0">
            Each round shows a target color expressed as a code like
            <span className="mono text-neon"> rgb(120, 45, 200)</span>. Pick the
            matching swatch from the grid before time runs out.
          </p>
        </section>

        <section className="mb-14 sm:mb-18">
          <div className="mono text-mono-xs tracking-mono-xl text-ink-3 uppercase mb-2.5 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon shadow-led-neon-sm" />
            Ruleset
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatTile
              label="Time per game"
              value={GAME_DURATION_SECONDS}
              unit="sec"
            />
            <StatTile label="Swatches per round" value={NUM_COLORS} />
            <StatTile label="Tries per round" value={DEFAULT_TRIES} />
          </div>
        </section>

        <section className="mb-14 sm:mb-18">
          <h2 className="font-heading text-2xl sm:text-[28px] font-bold tracking-[-0.015em] m-0 mb-4 text-ink-0">
            Scoring
          </h2>
          <p className="text-ink-1 text-sm sm:text-base leading-relaxed m-0 mb-5 sm:mb-6 max-w-[600px]">
            Points are awarded based on which try lands the correct match.
            Faster recognition → bigger payoff.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {SCORING_RULES.map((rule, i) => (
              <div
                key={rule.triesLeft}
                className="card bg-bg-1 p-3 sm:p-[18px] relative overflow-hidden"
              >
                <div className="mono text-mono-xs tracking-mono-xl text-ink-3 uppercase mb-2">
                  {SCORING_TILE_ORDINALS[i]} try
                </div>
                <div
                  className={`mono text-xl sm:text-[28px] font-bold ${
                    SCORING_TILE_COLORS[i] ?? "text-ink-0"
                  }`}
                >
                  +{rule.points}
                  <span className="text-[10px] sm:text-[11px] text-ink-3 font-medium tracking-mono-md ml-1">
                    PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 px-4 py-3.5 sm:px-[18px] border border-dashed border-line rounded-btn text-ink-1 text-sm leading-relaxed">
            Final score ={" "}
            <span className="mono text-neon">points earned / max possible</span>{" "}
            across all rounds played. Beat your best to flag a new high score.
          </div>
        </section>

        <section className="mb-14 sm:mb-18">
          <h2 className="font-heading text-2xl sm:text-[28px] font-bold tracking-[-0.015em] m-0 mb-5 text-ink-0">
            Tips & tricks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {TIPS.map((t) => (
              <div
                key={t.tag}
                className="card bg-bg-1 p-4 sm:p-[22px] flex gap-3 sm:gap-4"
              >
                <div className="mono text-mono-xs tracking-mono-xl text-neon uppercase min-w-[52px] pt-[3px]">
                  {t.tag}
                </div>
                <div className="text-ink-1 text-sm sm:text-[15px] leading-relaxed">
                  {t.tip}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 sm:mb-18">
          <h2 className="font-heading text-2xl sm:text-[28px] font-bold tracking-[-0.015em] m-0 mb-5 text-ink-0">
            Deep dive
          </h2>
          <a
            href="https://tebza.dev/how-to-identify-color-from-an-rgb-value"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring block no-underline p-5 sm:p-7 rounded-panel border border-neon-soft bg-[linear-gradient(180deg,oklch(0.18_0.05_168),oklch(0.14_0.03_168))] relative overflow-hidden shadow-[0_0_0_1px_oklch(0.90_0.19_168_/_0.15),0_0_40px_oklch(0.90_0.19_168_/_0.08)] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_oklch(0.90_0.19_168_/_0.35),0_0_60px_oklch(0.90_0.19_168_/_0.18)]"
          >
            <div className="absolute top-0 right-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-neon text-neon-on-bg mono text-[9px] font-bold tracking-mono-xl uppercase rounded-bl-lg">
              ↗ External
            </div>
            <div className="mono text-mono-xs tracking-mono-2xl text-neon uppercase mb-3 flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon shadow-led-neon-sm" />
              Further reading
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-[-0.01em] m-0 mb-2.5 text-ink-0 max-w-[560px]">
              How to identify color from an RGB value
            </h3>
            <p className="m-0 mb-4 text-ink-1 text-sm sm:text-[15px] leading-relaxed max-w-[600px]">
              The mental shortcuts behind Color Dash, how to scan an RGB
              triplet, spot the dominant channel, predict the color family from
              the top two values, and judge brightness from how high the numbers
              climb.
            </p>
            <span className="mono inline-flex items-center gap-2 text-neon text-xs tracking-mono-sm font-semibold">
              Read the article
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        </section>

        <div className="flex gap-3 items-center flex-wrap">
          <Link
            href="/play/rgb"
            className="btn-primary focus-ring inline-flex items-center gap-3 no-underline"
          >
            Got it · Start dash
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </main>
    </>
  );
}
