# Color Dash — Design System

## Design Aesthetic

Dark, instrument-grade UI. Inspired by oscilloscopes, mission-control terminals, and analog synthesizer panels. The palette is cold (blue-violet midnight) with a single neon accent (cyan-lime) as the primary signal color, plus hot red for warnings and amber/violet as secondary system colors.

The tone is deadpan and technical — uppercase monospace labels, tick-mark decorations, LED blink animations. No gradients on backgrounds, no mascots, no popups.

---

## Color System

All colors defined in OKLCH for perceptual uniformity.

### Background Scale

| Token    | Value                   | Use               |
| -------- | ----------------------- | ----------------- |
| `--bg-0` | `oklch(0.13 0.012 275)` | Page background   |
| `--bg-1` | `oklch(0.16 0.014 275)` | Cards, nav        |
| `--bg-2` | `oklch(0.20 0.016 275)` | Shimmer highlight |

### Ink (text) Scale

| Token     | Value                   | Use              |
| --------- | ----------------------- | ---------------- |
| `--ink-0` | `oklch(0.98 0.005 275)` | Primary text     |
| `--ink-1` | `oklch(0.86 0.012 275)` | Body text        |
| `--ink-2` | `oklch(0.74 0.018 275)` | Secondary labels |
| `--ink-3` | `oklch(0.62 0.02 275)`  | Muted / captions |

### Accent Colors

| Token      | Value                  | Role                                                                                       |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `--neon`   | `oklch(0.90 0.19 168)` | Primary signal — cyan-lime. Used for active states, readouts, high scores, correct answers |
| `--hot`    | `oklch(0.72 0.24 18)`  | Warning red. Used for wrong answers, timer urgency, session-ended state                    |
| `--amber`  | `oklch(0.84 0.16 78)`  | Initializing / caution states                                                              |
| `--violet` | `oklch(0.72 0.21 305)` | Logo tile, gradient partner to neon                                                        |

### Borders

| Token         | Value                                              |
| ------------- | -------------------------------------------------- |
| `--line`      | `oklch(0.28 0.02 275)` — hard border               |
| `--line-soft` | `oklch(0.22 0.018 275 / 0.6)` — ambient grid lines |

---

## Typography

| Role                     | Family           | Weight  | Notes                                                                         |
| ------------------------ | ---------------- | ------- | ----------------------------------------------------------------------------- |
| Display / headings       | `Oxanium`        | 700–800 | `letter-spacing: -0.02em`, uppercase where used as labels                     |
| Body / UI default        | `JetBrains Mono` | 400–700 | All prose, buttons, inputs; monospace baseline throughout                     |
| Code / readouts / labels | `JetBrains Mono` | 400–700 | Uppercase system labels, timer, target readout; `letter-spacing: 0.18–0.30em` |

**Label convention:** All metadata labels (section tags, stat headers, status lines) are set in `JetBrains Mono`, 9–11px, `letter-spacing: 0.18–0.30em`, `text-transform: uppercase`, `color: var(--ink-3)`.

**Numerals:** `font-variant-numeric: tabular-nums` on all score/time/stat displays.

---

## Layout

- **Max content width:** 960px (marketing screens), 1280px (gameplay)
- **Page padding:** `32px` sides, `48px` bottom
- **Grid gap standard:** `16–20px`
- **Component gap:** `flex` + `gap` throughout; never inline flow for UI elements
- **Swatch grid:** 3 columns (`repeat(3, 1fr)`), collapses to 2 on `max-width: 720px`

---

## Component Library

### Swatch

A color tile the player taps to guess. Physically styled with:

- Specular highlight overlay (`linear-gradient`, top edge bright)
- Shadow underlay (bottom edge dark)
- Inner bevel (box-shadow inset)
- Drop shadow beneath (`swatch-shadow`)
- Border radius: `18px`
- Height: `180px` (default), `220px` (big)
- Corner label (01–06) in monospace

States: `idle`, `correct` (`.pop` keyframe), `wrong` (`.shake` + 35% opacity + ✕ icon), `loading` (spinner), `disabled`, `revealed` (desaturated).

### TargetReadout

Terminal-bezel panel displaying the target color function. Styled with CRT scanline overlay, green glow text, tick-mark decorations, and a pulsing LED indicator. The function name and parentheses are dimmed; the numeric arguments glow full neon.

### Infobar

Three-column grid bar: `[Quit button + Score] | [Timer] | [Tries pips]`. Tries are shown as three `10×10` square pips — filled neon (or hot red on last try). Timer switches to red + shake animation at ≤10 seconds.

### Logo

2×2 grid of colored squares: neon / violet / amber / hot. Each square has a matching glow box-shadow.

### NavBar

Pill-shaped segmented nav. Active item: `oklch(0.22 0.08 168)` background, neon text, inner border glow. `ONLINE` status dot in top right.

### Toast

Fixed-position notification, top-center. Slides down with a spring easing. Green for correct match (`+N · MATCH`), red for misses (`NO MATCH`, `OUT OF TRIES`). Auto-dismisses after 1500ms.

### Buttons

| Variant        | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `.btn-primary` | Neon fill, dark text, multi-layer glow box-shadow, lifts on hover  |
| `.btn-ghost`   | Transparent, `--line` border, upper-case label, brightens on hover |

### Cards

`.card`: `linear-gradient(180deg, var(--bg-1), var(--bg-0))`, `1px solid var(--line)`, `border-radius: 14px`.

`.terminal-bezel`: Darker variant with CRT scanline overlay, inset shadow, and a neon radial highlight at the top edge. Used for the target readout and the "What it teaches" list on the About screen.

### StatTile

Bordered card showing a single numeric stat from the server config. Neon numeral at 38px, monospace label in ink-3.

### Shimmer

Loading skeleton: `background-size: 200%` gradient animated via `background-position` over 1.6s. Applied to score display, swatch grid placeholders, and config tiles during simulated API loading.

---

## Animations

| Name         | Target                     | Description                                  |
| ------------ | -------------------------- | -------------------------------------------- |
| `shimmer`    | Skeleton loaders           | Horizontal gradient sweep, 1.6s linear       |
| `pulse-led`  | LED dots                   | Opacity 1→0.35→1, 1.4s ease-in-out           |
| `neon-pulse` | Focused elements           | Box-shadow glow breath                       |
| `shake`      | Wrong swatch, urgent timer | Horizontal jitter, 0.4s                      |
| `pop`        | Correct swatch             | Scale 1→1.04→1, 0.45s spring                 |
| `scan-line`  | Loading readout bezel      | Vertical light sweep, 1.6s linear            |
| `toast-in`   | Toast notification         | Slide down + fade, 0.3s spring               |
| `panel-in`   | Game Over modal            | Fade + translateY + scale, 0.35s spring      |
| `dot`        | Loading ellipsis           | Vertical bounce + neon color, 1.2s staggered |
| `spin`       | Swatch loading spinner     | Full rotation, 0.7s linear                   |
| `fade-in`    | Game Over overlay          | Opacity 0→1, 0.3s                            |
