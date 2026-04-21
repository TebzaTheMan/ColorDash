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

### State Management

React Reducer + Context API — no external state library. All game logic is now server-side; the frontend only manages UI state derived from API responses.

- `GameContext` (`web/contexts/game.context.tsx`) — wraps the play page, holds active game state via `useReducer`. Exposes async methods (`startGame`, `submitGuess`, `endGame`, `reset`) that call the backend API and dispatch results into the reducer.
- `HighscoreContext` (`web/features/Highscore/contexts/HighScore.context.tsx`) — fetches per-mode highscores from the API on mount; provides a `refresh()` method called after a new highscore is confirmed.
- `game.reducer.ts` — handles local actions (`RESET`) and API-response actions (`GAME_STARTED`, `GUESS_RESULT`, `GAME_ENDED`).

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

Primitive game types are defined here; API shapes (`GameMode`, `ScoreDto`, `GuessResult`, `GameStartedResponse`, `GuessResultResponse`, `EndGameResponse`) come from the Orval-generated `web/lib/api/generated/model/`.

```typescript
// IGameAction is a discriminated union of reducer actions
type IGameAction =
  | { type: "RESET" }
  | { type: "GAME_STARTED"; data: GameStartedResponse; sessionId: string }
  | { type: "GUESS_RESULT"; data: GuessResultResponse; guessIndex: number }
  | { type: "GAME_ENDED"; data: EndGameResponse };

interface IGameState {
  mode: GameMode | undefined;
  score: ScoreDto; // { points, total }
  triesLeft: number; // 0–3
  correctColors: number; // correct guesses this session
  timeUp: boolean;
  isNewHighscore?: boolean;

  colors: string[]; // CSS color strings from the backend
  targetColor: string; // the label shown to the player
  clickedColors: boolean[]; // tracks which blocks have been clicked this round
  gameStartTimestamp: number;
  sessionId: string | null;
  correctColorIndex: number | null;

  lastGuessResult?: {
    result: GuessResult; // "correct" | "wrong_but_continue" | "wrong_and_exhausted"
    id: number;
  };
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
2. Page calls `startGame(mode)` on `GameContext`
3. `GameContext` calls `gameApi.startGame(mode)` → `POST /game/start`
4. Backend generates session, colors, and target label; returns `GameStartedResponse`
5. `GAME_STARTED` dispatched → reducer initialises state from API response; 30s client-side timer resets

### Gameplay Loop

1. User clicks a color block → `submitGuess(colorIndex)` called on `GameContext`
2. `GameContext` calls `gameApi.submitGuess(sessionId, colorIndex)` → `POST /game/{id}/guess`
3. Backend evaluates guess, updates score and tries; returns `GuessResultResponse`
4. `GUESS_RESULT` dispatched → reducer updates state:
   - **Correct** (`nextColors` present): score updated, new colors/target set, `clickedColors` reset
   - **WrongButContinue**: tries decremented, clicked block marked
   - **WrongAndExhausted** (`nextColors` present): tries reset, new colors set, no points
5. `gameOver: true` in response → `timeUp` set, game ends without a separate timer event

### Game End

1. Timer hits 0 → `endGame()` called on `GameContext`
2. `GameContext` calls `gameApi.endGame(sessionId)` → `POST /game/{id}/end`
3. Backend computes final score and highscore; returns `EndGameResponse`
4. `GAME_ENDED` dispatched → `timeUp = true`, `isNewHighscore` set from backend response
5. `GameoverModal` renders final score breakdown
6. If new highscore → `Timer` component calls `HighscoreContext.refresh()` → re-fetches highscores from the API
7. User clicks "Replay" → `RESET` → fresh game (triggers new `startGame` call)
