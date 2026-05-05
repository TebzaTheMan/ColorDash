import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-0": "var(--bg-0)",
        "bg-1": "var(--bg-1)",
        "bg-2": "var(--bg-2)",
        "ink-0": "var(--ink-0)",
        "ink-1": "var(--ink-1)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        neon: "var(--neon)",
        "neon-soft": "var(--neon-soft)",
        hot: "var(--hot)",
        "hot-soft": "var(--hot-soft)",
        amber: "var(--amber)",
        violet: "var(--violet)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        "tab-active": "oklch(0.22 0.08 168)",
        "neon-on-bg": "oklch(0.12 0.02 168)",
        "toast-ok-bg": "oklch(0.20 0.10 168)",
        "toast-err-bg": "oklch(0.20 0.12 18)",
        "panel-header": "oklch(0.10 0.012 275)",
        "modal-backdrop": "oklch(0.08 0.012 275 / 0.85)",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        heading: ["var(--font-oxanium)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "mono-2xs": ["9px", { letterSpacing: "0.22em" }],
        "mono-xs": ["10px", { lineHeight: "1.4" }],
        "mono-sm": ["11px", { lineHeight: "1.4" }],
        "mono-md": ["13px", { lineHeight: "1.4" }],
        "display-hero": [
          "clamp(48px, 8vw, 96px)",
          { lineHeight: "0.98", letterSpacing: "-0.035em" },
        ],
        "display-score": [
          "clamp(56px, 14vw, 88px)",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
      },
      letterSpacing: {
        "mono-sm": "0.06em",
        "mono-md": "0.12em",
        "mono-lg": "0.18em",
        "mono-xl": "0.22em",
        "mono-2xl": "0.3em",
      },
      boxShadow: {
        "led-neon-sm": "0 0 6px var(--neon)",
        "led-neon": "0 0 10px var(--neon)",
        "led-hot": "0 0 10px var(--hot)",
        "led-hot-sm": "0 0 6px var(--hot)",
        "led-amber": "0 0 10px var(--amber)",
        swatch:
          "0 1px 0 0 rgba(255,255,255,0.04), 0 8px 18px -8px rgba(0,0,0,0.7), 0 24px 40px -16px rgba(0,0,0,0.6)",
        "swatch-skeleton":
          "inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 18px -8px rgba(0,0,0,0.5)",
        "terminal-bezel":
          "inset 0 1px 0 0 rgba(255,255,255,0.04), inset 0 0 40px 0 rgba(0,0,0,0.6), 0 8px 24px -8px rgba(0,0,0,0.6)",
        infobar: "inset 0 1px 0 rgba(255,255,255,0.04)",
        "tab-active":
          "inset 0 0 0 1px oklch(0.90 0.19 168 / 0.4), 0 0 16px oklch(0.90 0.19 168 / 0.15)",
        "btn-primary":
          "0 0 0 1px oklch(0.90 0.19 168 / 0.6), 0 0 28px 0 oklch(0.90 0.19 168 / 0.35), inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -2px 0 0 rgba(0,0,0,0.18)",
        "btn-primary-hover":
          "0 0 0 1px oklch(0.90 0.19 168 / 0.8), 0 0 36px 0 oklch(0.90 0.19 168 / 0.55), inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -2px 0 0 rgba(0,0,0,0.18)",
        panel:
          "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px var(--line), 0 0 60px oklch(0.90 0.19 168 / 0.08)",
        "toast-ok":
          "0 0 0 1px var(--neon-soft), 0 16px 40px -8px rgba(0,0,0,0.5), 0 0 24px oklch(0.90 0.19 168 / 0.3)",
        "toast-err":
          "0 0 0 1px var(--hot-soft), 0 16px 40px -8px rgba(0,0,0,0.5), 0 0 24px oklch(0.72 0.24 18 / 0.3)",
        "highscore-badge": "0 0 16px oklch(0.90 0.19 168 / 0.5)",
        "scan-line": "0 0 12px var(--neon)",
      },
      backgroundImage: {
        panel: "linear-gradient(180deg, var(--bg-1), var(--bg-0))",
        infobar:
          "linear-gradient(180deg, var(--bg-1), oklch(0.11 0.012 275))",
        "hero-text": "linear-gradient(120deg, var(--neon), var(--violet))",
        "scan-line":
          "linear-gradient(90deg, transparent, var(--neon), transparent)",
        "swatch-gloss":
          "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.18) 100%)",
        "terminal-bezel":
          "radial-gradient(ellipse at 50% 0%, oklch(0.9 0.19 168 / 0.1), transparent 60%), linear-gradient(180deg, oklch(0.1 0.01 275), oklch(0.07 0.01 275))",
        scanlines:
          "repeating-linear-gradient(transparent 0 2px, rgba(255,255,255,0.012) 2px 3px)",
        shimmer:
          "linear-gradient(90deg, var(--bg-1) 0%, var(--bg-2) 50%, var(--bg-1) 100%)",
      },
      borderRadius: {
        card: "14px",
        panel: "18px",
        btn: "10px",
        "btn-lg": "12px",
      },
      backdropBlur: {
        modal: "12px",
      },
      zIndex: {
        stage: "0",
        content: "1",
        "swatch-label": "4",
        "swatch-overlay": "5",
        scanlines: "100",
        toast: "200",
        modal: "300",
      },
      textShadow: {
        neon: "0 0 12px oklch(0.90 0.19 168 / 0.3)",
        "neon-strong":
          "0 0 20px oklch(0.90 0.19 168 / 0.6), 0 0 4px oklch(0.90 0.19 168 / 0.9)",
        "neon-soft": "0 0 12px oklch(0.90 0.19 168 / 0.5)",
        "neon-glow": "0 0 24px oklch(0.90 0.19 168 / 0.15)",
        "score-best": "0 0 32px oklch(0.90 0.19 168 / 0.5)",
        hot: "0 0 16px oklch(0.72 0.24 18 / 0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-led": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        "spin-fast": {
          to: { transform: "rotate(360deg)" },
        },
        dot: {
          "0%, 60%, 100%": {
            color: "var(--ink-3)",
            transform: "translateY(0)",
          },
          "30%": {
            color: "var(--neon)",
            transform: "translateY(-4px)",
            textShadow: "0 0 8px var(--neon)",
          },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translate(-50%, -12px)" },
          to: { opacity: "1", transform: "translate(-50%, 0)" },
        },
        "panel-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        led: "pulse-led 1.4s ease-in-out infinite",
        "scan-line": "scan-line 1.6s linear infinite",
        shake: "shake 0.4s ease-in-out",
        pop: "pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.4)",
        "spin-fast": "spin-fast 0.7s linear infinite",
        dot: "dot 1.2s ease-in-out infinite",
        "toast-in": "toast-in 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.4)",
        "panel-in": "panel-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2)",
        "fade-in": "fade-in 0.3s ease",
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "text-shadow": (value) => ({ textShadow: value as string }),
        },
        { values: theme("textShadow") as Record<string, string> }
      );
    }),
  ],
} satisfies Config;

export default config;
