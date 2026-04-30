# Commands

## Root Scripts (run from repo root)

```bash
npm run dev:web        # Start frontend dev server on http://localhost:3000
npm run dev:api        # Start backend API server
npm run check:web      # Full frontend validation: format + lint + types + build + test
npm run format:web     # Format frontend code with Prettier
npm run test:api       # Run backend xUnit test suite
```

## Docker Compose (local Postgres + API + Web)

```bash
docker compose up postgres -d         # Start Postgres only (host dev against it)
docker compose up                     # Start postgres + api + web
docker compose down                   # Stop and remove containers
docker compose down -v                # Also remove the postgres data volume
```

## Frontend Scripts (`cd web` first, or use root `npm run` prefix)

```bash
npm run dev            # Start Next.js dev server (uses --webpack flag)
npm run build          # Production build
npm run start          # Start production server
npm run test           # Run Vitest once
npm run test:watch     # Vitest in watch mode
npm run check-types    # TypeScript type check only (tsc --noEmit)
npm run check-lint     # ESLint check only
npm run check-format   # Prettier check only
npm run format         # Format all frontend files with Prettier
npm run test-all       # Full pipeline: format + lint + types + build + test
npm run generate:api   # Regenerate API client from api/Client/ColorDash.Api.json via orval
```

## Backend Scripts (`cd api` first)

```bash
dotnet run --project ColorDash.Api.csproj                          # Start API
dotnet test --project ColorDash.Tests/ColorDash.Tests.csproj       # Run tests
dotnet ef migrations add <MigrationName>                           # Add EF Core migration
dotnet ef database update                                          # Apply migrations to DB
dotnet build                                                       # Build only
```
