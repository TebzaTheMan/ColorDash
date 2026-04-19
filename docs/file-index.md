# File Index

Key files and their single responsibility. Read this before searching the codebase — the file you need is likely listed here.

## Frontend (`web/`)

| File                                                      | Responsibility                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `web/pages/index.tsx`                                     | Home page — mode selection (RGB / HSL)                               |
| `web/pages/play/[mode].tsx`                               | Active game page — wires timer, color blocks, modals, context        |
| `web/contexts/game.context.tsx`                           | `GameContext` provider — holds active game state, dispatches actions |
| `web/reducers/game.reducer.ts`                            | Game state reducer — maps dispatch actions to engine function calls  |
| `web/game/engine.ts`                                      | Pure state machine: `startGame`, `processGuess`, `handleTimeUp`      |
| `web/game/colors.ts`                                      | RGB/HSL color generation and manipulation                            |
| `web/game/scoring.ts`                                     | Score calculation based on tries remaining                           |
| `web/game/constants.ts`                                   | Shared game constants (tries, points, etc.)                          |
| `web/game/__tests__/`                                     | Vitest unit tests for engine, colors, and scoring                    |
| `web/types/index.ts`                                      | All frontend TypeScript type definitions                             |
| `web/hooks/useLocalStorageReducer.tsx`                    | Reducer hook that persists state to `localStorage`                   |
| `web/features/Highscore/contexts/HighScore.context.tsx`   | Highscore context — persists per-mode best scores to `localStorage`  |
| `web/features/colorblocks/components/Colorblocks.tsx`     | Renders the 6 clickable color blocks                                 |
| `web/features/Infobar/components/Infobar.tsx`             | Score / timer / tries bar                                            |
| `web/features/GameoverModal/components/GameoverModal.tsx` | End-of-game overlay with stats and replay                            |
| `web/next.config.js`                                      | Next.js configuration                                                |
| `web/tsconfig.json`                                       | TypeScript config (strict, path aliases)                             |
| `web/.eslintrc.js`                                        | ESLint config (Google style)                                         |
| `web/vitest.config.ts`                                    | Vitest configuration                                                 |

## Backend (`api/`)

| File                                           | Responsibility                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `api/Program.cs`                               | App entry point — DI registration, middleware, EF Core setup, route mapping                  |
| `api/appsettings.json`                         | Base configuration including `GameSettings`                                                  |
| `api/appsettings.Development.json`             | Dev overrides — SQLite connection string                                                     |
| `api/Domain/GameSession.cs`                    | Game session entity                                                                          |
| `api/Domain/Highscore.cs`                      | Highscore entity                                                                             |
| `api/Domain/GameMode.cs`                       | Enum: `Rgb`, `Hsl`                                                                           |
| `api/Domain/GuessResult.cs`                    | Enum: `Correct`, `WrongButContinue`, `WrongAndExhausted`                                     |
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
| `api/Migrations/`                              | EF Core migration history                                                                    |
| `api/ColorDash.Tests/`                         | xUnit test project for services                                                              |
