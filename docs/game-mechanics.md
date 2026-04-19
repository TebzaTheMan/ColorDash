# Game Mechanics

## Objective

Identify which of 6 displayed color blocks matches a target color label (e.g. `rgb(120, 45, 200)`) before time runs out.

## Game Modes

| Mode | Color Format                                          | Example Label        |
| ---- | ----------------------------------------------------- | -------------------- |
| RGB  | Red, Green, Blue (0–255 each)                         | `rgb(120, 45, 200)`  |
| HSL  | Hue (0–360°), Saturation (0–100%), Lightness (0–100%) | `hsl(210, 60%, 45%)` |

Both modes display the same style of 6-block grid; the difference is in how colors are generated and labelled.

## Round Structure

Each **round** consists of:

1. 6 color blocks displayed (one is the correct match)
2. A target color label shown above the blocks
3. Player has **3 tries** to click the correct block
4. Round ends when the player gets it right, or exhausts all 3 tries

## Scoring

Points are awarded per correct guess based on how many tries were used:

| Tries remaining when correct | Points awarded |
| ---------------------------- | -------------- |
| 3 (first try)                | 10             |
| 2 (second try)               | 5              |
| 1 (third try)                | 2              |

If all 3 tries are exhausted without a correct guess, **0 points** are awarded for that round and new colors are generated.

**Final score** = total points earned / total possible points (as a percentage-style ratio).

`IScore = { points: number, total: number }` — `total` grows by `MaxPointsPerRound` (10) for each round played.

## Timer

- Each game lasts **30 seconds** (`GameDurationSeconds`)
- Timer starts when the play page loads
- When timer reaches 0, the game ends immediately regardless of round state
- A **2-second expiry tolerance** (`ExpiryToleranceSeconds`) is applied server-side to account for network latency on the final guess

## Session Lifecycle

```
start → Active → [guess × N] → Completed (manual end or time up)
                              → Expired   (server-side, after 32s)
```

- `Active`: accepting guesses
- `Completed`: game ended via `/game/{id}/end`
- `Expired`: session too old — backend rejects further requests with HTTP 410

## Highscores

- Tracked **per device** (via `X-Device-ID` header / `localStorage` key)
- Tracked **per game mode** (RGB and HSL scored separately)
- A score only replaces the stored highscore if it is strictly higher
- Frontend persists highscores in `localStorage` via `HighscoreContext`
- Backend persists in the database via `HighscoreService` and `HighscoreRepository`

## Configuration Reference

All values are set in `api/appsettings.json → GameSettings`. See [tech-stack.md](tech-stack.md) for the full configuration block.

| Setting                  | Default | Effect                                  |
| ------------------------ | ------- | --------------------------------------- |
| `NumColors`              | 6       | Number of color blocks per round        |
| `GameDurationSeconds`    | 30      | Total game time                         |
| `DefaultTries`           | 3       | Tries allowed per round                 |
| `MaxPointsPerRound`      | 10      | Points possible if correct on first try |
| `ExpiryToleranceSeconds` | 2       | Extra grace time for the final guess    |
