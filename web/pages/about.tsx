import Head from "next/head";
import Link from "next/link";
import NavBar from "components/NavBar";
import { ArrowRightIcon } from "components/icons";

const TEACHES = [
  "Translating numeric color into perceived color",
  "Recognising hue families from raw RGB triplets",
  "Reading lightness & saturation in HSL",
  "Calibrating gut response under time pressure",
];

const PERSONAS: { who: string; why: string }[] = [
  {
    who: "Designers",
    why: "Building palettes from numeric specs, code reviews, design tokens.",
  },
  {
    who: "Developers",
    why: "Reading CSS at a glance, knowing what a value actually looks like.",
  },
  {
    who: "Color nerds",
    why: "For the same reason chess players play bullet chess.",
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About — Color Dash</title>
        <meta
          name="description"
          content="Color Dash is a fast color-literacy reflex test for designers and developers. Read color codes, pick the matching swatch, beat the clock."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative z-content min-h-screen flex flex-col px-4 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 max-w-[960px] mx-auto">
        <NavBar active="about" />

        <section className="mb-12 sm:mb-14">
          <div className="mono text-mono-sm tracking-mono-2xl text-neon uppercase mb-4 sm:mb-5">
            ▸ About
          </div>
          <h1 className="font-bold text-ink-0 text-display-hero m-0">
            A reading test, dressed as a game.
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 sm:gap-10 mb-14 sm:mb-18">
          <div>
            <p className="text-base sm:text-lg leading-[1.7] text-ink-1 m-0 mb-5 sm:mb-6">
              Designers and developers stare at color codes all day
              <span className="mono text-neon"> rgb()</span>,
              <span className="mono text-neon"> hsl()</span>, hex without ever
              building real intuition for what those numbers actually{" "}
              <em>look like</em>. Color Dash is a small reflex test designed to
              fix that.
            </p>
            <p className="text-[15px] sm:text-base leading-[1.7] text-ink-1 m-0 mb-5 sm:mb-6">
              Read a code. Pick the swatch. Beat the clock. Do it enough times
              and your eyes start translating numbers into pigment without
              conscious effort. That&apos;s the whole pitch.
            </p>
            <p className="text-[15px] sm:text-base leading-[1.7] text-ink-1 m-0">
              It&apos;s also designed for the way these things actually get
              played: one-handed on a phone, late, while waiting for something.
              Big satisfying tap targets, no cute mascots, no popups telling you
              to upgrade.
            </p>
          </div>

          <div className="terminal-bezel p-5 sm:p-7">
            <div className="mono text-[9px] tracking-mono-xl text-ink-3 uppercase mb-3.5">
              What it teaches
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {TEACHES.map((t, i) => (
                <li
                  key={t}
                  className="flex gap-2.5 items-start text-ink-1 text-sm leading-snug relative z-content"
                >
                  <span className="mono text-neon text-mono-sm pt-[3px]">
                    0{i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-14 sm:mb-18">
          {PERSONAS.map((p) => (
            <div key={p.who} className="card bg-bg-1 p-5 sm:p-[26px]">
              <div className="mono text-mono-xs tracking-mono-xl text-neon uppercase mb-3">
                For {p.who.toLowerCase()}
              </div>
              <div className="text-ink-1 text-[15px] leading-relaxed">
                {p.why}
              </div>
            </div>
          ))}
        </section>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/play/rgb"
            className="btn-primary focus-ring inline-flex items-center gap-3 no-underline"
          >
            Try it
            <ArrowRightIcon />
          </Link>
        </div>
      </main>
    </>
  );
}
