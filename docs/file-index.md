# File Index

Key files and their single responsibility. Read this before searching the codebase — the file you need is likely listed here.

## Frontend (`web/`)

| File                                                      | Responsibility                                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `web/pages/index.tsx`                                     | Home page — mode selection (RGB / HSL)                                                                                      |
| `web/pages/play/[mode].tsx`                               | Active game page — wires timer, color blocks, modals, context                                                               |
| `web/contexts/game.context.tsx`                           | `GameContext` provider — holds active game state; exposes `startGame`, `submitGuess`, `endGame`, `reset`                    |
| `web/reducers/game.reducer.ts`                            | Game state reducer — maps API-response actions (`GAME_STARTED`, `GUESS_RESULT`, `GAME_ENDED`) and `RESET` to state          |
| `web/game/constants.ts`                                   | Shared game constants (game duration, `SCORING_RULES` array, default state) — must stay in sync with `api/appsettings.json` |
| `web/types/index.ts`                                      | Frontend TypeScript types — `IGameState`, `IGameAction` (API shapes come from generated model)                              |
| `web/features/Highscore/contexts/HighScore.context.tsx`   | Highscore context — fetches per-mode best scores from the API; provides `refresh()` and `isLoading`                         |
| `web/components/GameSkeleton.tsx`                         | Skeleton loading state for the play page — mirrors Infobar + color block grid layout                                        |
| `web/features/colorblocks/components/Colorblocks.tsx`     | Renders the 6 clickable color blocks                                                                                        |
| `web/features/Infobar/components/Infobar.tsx`             | Score / timer / tries bar                                                                                                   |
| `web/features/GameoverModal/components/GameoverModal.tsx` | End-of-game overlay with stats and replay                                                                                   |
| `web/lib/api/gameApi.ts`                                  | High-level API wrapper: `startGame`, `submitGuess`, `endGame`, `getHighscores`                                              |
| `web/lib/api/customFetch.ts`                              | Fetch wrapper — prepends base URL, injects `X-Device-ID` header, throws on non-2xx                                          |
| `web/lib/api/deviceId.ts`                                 | Device ID persistence: generates a UUID on first run and stores it in `localStorage`                                        |
| `web/lib/api/generated/colordash.ts`                      | Orval-generated API functions (do not edit manually)                                                                        |
| `web/lib/api/generated/model/`                            | Orval-generated TypeScript types for all API request/response shapes                                                        |
| `web/orval.config.ts`                                     | Orval config — reads `api/Client/ColorDash.Api.json`, writes to `web/lib/api/generated/`                                    |
| `web/.env.example`                                        | Environment variable template — copy to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`                                     |
| `web/next.config.js`                                      | Next.js configuration                                                                                                       |
| `web/tsconfig.json`                                       | TypeScript config (strict, path aliases)                                                                                    |
| `web/.eslintrc.js`                                        | ESLint config (Google style)                                                                                                |
| `web/vitest.config.ts`                                    | Vitest configuration                                                                                                        |

## Backend (`api/`)

| File                                           | Responsibility                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `api/Program.cs`                               | App entry point — DI registration, middleware, EF Core setup, route mapping                  |
| `api/appsettings.json`                         | Base configuration including `GameSettings`                                                  |
| `api/appsettings.Development.json`             | Dev overrides — PostgreSQL connection string (points at the Dockerised Postgres)             |
| `api/Domain/GameSession.cs`                    | Game session entity                                                                          |
| `api/Domain/Highscore.cs`                      | Highscore entity                                                                             |
| `api/Domain/GameMode.cs`                       | Enum: `Rgb`, `Hsl`                                                                           |
| `api/Domain/GuessResult.cs`                    | Enum: `Correct`, `WrongButContinue`, `WrongAndExhausted`                                     |
| `api/Domain/Exceptions/SessionExceptions.cs`   | Typed exceptions thrown by `GameService`; mapped to HTTP status codes in `Program.cs`        |
| `api/Data/AppDbContext.cs`                     | EF Core `DbContext` — registers entities, configures schema                                  |
| `api/Data/Repositories/SessionRepository.cs`   | CRUD for `GameSession` — no business logic                                                   |
| `api/Data/Repositories/HighscoreRepository.cs` | CRUD for `Highscore` — no business logic                                                     |
| `api/Services/GameService.cs`                  | Session lifecycle: start, guess evaluation, expiry, end                                      |
| `api/Services/ColorService.cs`                 | Server-side color generation per mode                                                        |
| `api/Services/HighscoreService.cs`             | Highscore retrieval and update logic                                                         |
| `api/Endpoints/GameEndpoints.cs`               | Route handlers for `/game/start`, `/game/{id}/guess`, `/game/{id}/end`                       |
| `api/Endpoints/HighscoreEndpoints.cs`          | Route handler for `GET /highscores`                                                          |
| `api/Models/GameSettings.cs`                   | Config POCO bound from `appsettings.json`                                                    |
| `api/Models/Requests/`                         | `StartGameRequest`, `GuessRequest`, `DeviceId` value object                                  |
| `api/Models/Responses/`                        | `GameStartedResponse`, `GuessResultResponse`, `EndGameResponse`, `ScoreDto`, `ErrorResponse` |
| `api/Client/ColorDash.Api.json`                | Auto-generated OpenAPI 3.1 spec (produced at build time)                                     |
| `api/Migrations/`                              | EF Core migration history (PostgreSQL — `uuid`, `jsonb`, `timestamp with time zone`)         |
| `api/ColorDash.Tests/`                         | xUnit test project for services                                                              |

## Root

| File                 | Responsibility                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `docker-compose.yml` | Local dev stack — Postgres 16 plus optional containerised api/web with volume-mounted source |
