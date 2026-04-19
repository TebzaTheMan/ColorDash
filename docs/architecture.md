# Architecture

## High-Level Overview

```
Frontend (Next.js)                    Backend (.NET Minimal API)
├── Pure Game Engine (web/game/)      ├── Endpoints  (route handlers)
├── React UI + Features               ├── Services   (business logic)
├── Reducers + Context (state)        ├── Repositories (data access)
└── localStorage (highscores)         └── Domain     (entities + enums)
```

## Frontend Architecture

### Game Engine (`web/game/`)
The core game logic is **pure TypeScript with zero React dependencies**. All state transitions are deterministic functions: given a state and an action, they return a new state. Side effects (color generation, current time) are injected via the `IGameDependencies` interface so the engine remains fully testable without mocking React internals.

Key functions in `web/game/engine.ts`:
- `startGame(deps)` → initial `IGameState`
- `processGuess(state, colorIndex, deps)` → `{ newState, outcome }`
- `handleTimeUp(state, currentHighscore)` → `IGameState` with `timeUp: true`

### State Management
React Reducer + Context API — no external state library.
- `GameContext` (`web/contexts/game.context.tsx`) — wraps the play page, holds active game state via `useLocalStorageReducer`
- `HighscoreContext` (`web/features/Highscore/contexts/HighScore.context.tsx`) — persists per-mode highscores to `localStorage`
- `game.reducer.ts` — dispatches actions to the pure engine functions

### Feature Modules (`web/features/`)
Each feature owns its components, context, and reducer. Keep feature-specific logic inside the feature folder.
- `colorblocks/` — renders the 6 clickable color blocks and the target label
- `Highscore/` — displays and persists the player's best score
- `Infobar/` — shows live score, countdown timer, and tries remaining
- `GameoverModal/` — end-of-game overlay with stats and replay button

### Pages
- `pages/index.tsx` — mode selection (RGB / HSL), routes to `/play/[mode]`
- `pages/play/[mode].tsx` — active game page, wires together all features and the timer

## Backend Architecture

Follows clean architecture layering: `Domain → Data → Services → Endpoints`

```
Endpoints   →   Services   →   Repositories   →   Domain / EF Core
```

- **Endpoints** (`api/Endpoints/`) — thin route handlers that parse requests, call services, return responses. No business logic here.
- **Services** (`api/Services/`) — all business logic lives here (session lifecycle, guess evaluation, color generation, highscore updates).
- **Repositories** (`api/Data/Repositories/`) — EF Core data access only; no logic.
- **Domain** (`api/Domain/`) — plain C# classes/enums; no EF dependencies.

### Device Identification
All game endpoints require an `X-Device-ID: {guid}` header. The backend uses this to:
1. Associate sessions with a device
2. Enforce ownership — a device cannot guess on another device's session (403)
3. Track highscores per device

### Session Expiry
Sessions expire after `GameDurationSeconds + ExpiryToleranceSeconds` (30 + 2 = 32s). Requests to expired sessions return **HTTP 410 Gone**. The 2-second tolerance handles network latency on the final guess.

## Domain Model

### Frontend Types (`web/types/index.ts`)
```typescript
type TMode = "rgb" | "hsl" | null

interface IGameState {
  mode: TMode
  score: IScore
  colors: string[]         // 6 CSS color strings, e.g. "rgb(12,34,56)"
  targetLabel: string      // the label shown to the player
  triesLeft: number        // 0–3
  timeUp: boolean
  isNewHighscore: boolean
  correctCount: number
  roundCount: number
  startedAt: number        // unix ms
  expiresAt: number        // unix ms
}

interface IScore { points: number; total: number }

type ClickOutcomeResult = "correct" | "wrong_but_continue" | "wrong_and_exhausted"

interface IGameDependencies {
  generateColors: (mode: TMode, count: number) => string[]
  getCurrentTime: () => number
}
```

### Backend Domain (`api/Domain/`)
```csharp
enum GameMode    { Rgb, Hsl }
enum GuessResult { Correct, WrongButContinue, WrongAndExhausted }
enum SessionStatus { Active, Completed, Expired }

class GameSession {
  Guid Id;  Guid DeviceId;  GameMode Mode;
  string[] Colors;  string TargetLabel;  int CorrectIndex;
  int TriesLeft;  ScoreDto Score;
  SessionStatus Status;
  DateTime StartedAt;  DateTime ExpiresAt;
}

class Highscore {
  Guid DeviceId;  GameMode Mode;  int Points;  int Total;
}
```

## Data Flow

### Starting a Game
1. User picks mode on home page → navigates to `/play/[mode]`
2. Page dispatches `START_MODE` → reducer calls `startGame(deps)`
3. Colors generated client-side, game state initialised, 30s timer starts

### Gameplay Loop
1. User clicks a color block → `SUBMIT_GUESS` dispatched with block index
2. Reducer calls `processGuess(state, index, deps)` → returns `ClickOutcomeResult`
3. **Correct**: score updated, new colors generated, tries reset, round counter incremented
4. **WrongButContinue**: tries decremented, error toast shown
5. **WrongAndExhausted**: tries reset to 3, new colors generated (no points awarded for that round)
6. UI updates; timer keeps running

### Game End
1. Timer hits 0 → `TIME_UP` dispatched with current highscore value
2. Reducer calls `handleTimeUp(state, highscore)` → `timeUp = true`, `isNewHighscore` computed
3. `GameoverModal` renders final score breakdown
4. If new highscore → `HighscoreContext` updated and persisted to `localStorage`
5. User clicks "Replay" → `RESET` → fresh game
