# Tech Stack

## Frontend (`web/`)

| Concern       | Library                | Version             |
| ------------- | ---------------------- | ------------------- |
| Framework     | Next.js                | 16.2.1              |
| UI runtime    | React                  | 18.2.0              |
| Language      | TypeScript             | 6.0.2 (strict mode) |
| UI components | Chakra UI              | 2.3.6               |
| CSS-in-JS     | Emotion                | (Chakra peer dep)   |
| Animation     | Framer Motion          | 7.6.1               |
| Timer         | react-timer-hook       | 3.0.5               |
| Testing       | Vitest                 | 4.1.2               |
| Linting       | ESLint (Google config) | —                   |
| Formatting    | Prettier               | 3.x                 |
| API codegen   | Orval                  | 8.8.0               |
| Analytics     | Vercel Analytics       | —                   |

TypeScript config: strict mode, `moduleResolution: node`, `jsx: react-jsx`, path alias `@/*` → project root, incremental compilation enabled.

## Backend (`api/`)

| Concern         | Technology               | Version                                     |
| --------------- | ------------------------ | ------------------------------------------- |
| Runtime         | .NET                     | 10.0                                        |
| Framework       | ASP.NET Core Minimal API | 10.0                                        |
| Language        | C#                       | (nullable enabled, implicit usings)         |
| ORM             | Entity Framework Core    | 10.0.5                                      |
| Database        | PostgreSQL 16            | via `Npgsql.EntityFrameworkCore.PostgreSQL` |
| API docs        | ASP.NET Core OpenAPI     | 10.0                                        |

Local Postgres runs in Docker — see `docker-compose.yml` at the repo root.

## Game Configuration

Located in `api/appsettings.json` under the `GameSettings` key. Bound to `api/Models/GameSettings.cs`.

```json
{
  "GameSettings": {
    "NumColors": 6,
    "GameDurationSeconds": 30,
    "DefaultTries": 3,
    "MaxPointsPerRound": 10,
    "ExpiryToleranceSeconds": 10,
    "ScoringRules": [
      { "triesLeft": 3, "points": 10 },
      { "triesLeft": 2, "points": 5 },
      { "triesLeft": 1, "points": 2 }
    ]
  }
}
```

Dev database connection string is in `api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=colordash;Username=colordash;Password=colordash"
  }
}
```
