# ColorDash — Documentation Index

**Color Dash** is a fast-paced, educational color-matching game that trains players to identify RGB and HSL colors from their numeric representations. It is a monorepo with two independent apps: `web/` (Next.js frontend) and `api/` (.NET 10 backend).

## When to Load Each Doc

| If you are working on...                     | Load these files                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| Understanding the project for the first time | All files                                                                  |
| Frontend game logic, state, or components    | [architecture.md](architecture.md), [game-mechanics.md](game-mechanics.md) |
| Backend services, sessions, or data layer    | [architecture.md](architecture.md), [api-reference.md](api-reference.md)   |
| Adding or debugging an API endpoint          | [api-reference.md](api-reference.md), [file-index.md](file-index.md)       |
| Running, building, or testing the project    | [commands.md](commands.md)                                                 |
| Finding where a piece of logic lives         | [file-index.md](file-index.md)                                             |
| Understanding game rules or scoring          | [game-mechanics.md](game-mechanics.md)                                     |
| Checking library versions or config values   | [tech-stack.md](tech-stack.md)                                             |

## Doc Files

- [architecture.md](architecture.md) — System architecture, domain model, and game data flow
- [api-reference.md](api-reference.md) — All REST endpoints with request/response shapes and error codes
- [tech-stack.md](tech-stack.md) — Library versions, runtime targets, and game configuration values
- [commands.md](commands.md) — All development, build, and test commands
- [file-index.md](file-index.md) — Critical files and their single responsibility
- [game-mechanics.md](game-mechanics.md) — Game rules, modes, scoring system, and session lifecycle

## Development Guidelines

- **Game logic changes** go through `web/game/` (pure functions) — not directly in components or reducers.
- **Backend** follows clean architecture: repositories for data access, services for business logic, endpoints only for routing. Do not put logic in endpoints.
- **`X-Device-ID` header** is mandatory on all game API calls — always pass it in frontend requests.
- **Database**: PostgreSQL in dev and prod. Local Postgres runs via `docker-compose.yml` at the repo root.
- Write tests for any new game engine or service logic.
- Follow existing code patterns before introducing new abstractions.
