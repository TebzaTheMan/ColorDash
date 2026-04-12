# ColorDash - Project Information

## Project Overview

Color Dash is a fast-paced, educational, and addictive color-matching game designed to sharpen your understanding of RGB and HSL color models. Race against the clock to identify the target color from a set of options, aiming for a perfect score before time runs out! The project is a monorepo broken down into 2 folders the web( frontend) and api(backend)

## Essential Commands

### Development

```bash
npm run dev:web
npm run check:web
npm run format:web
npm run dev:api
npm run test:api

## Directory Structure
```

your-project/
├── web/ # the frontend lives here
├── api/ # the backend lives here
├── package.json # the orchestrator
└── .claude/ # RIPER workflow configuration

```

## Technology Stack
frontend
- NextJs (ReactJS)
- ChakraUI
- typescript
- vitest
-eslint,prettier,husky

backend
- .NET
- sqlite for dev
- postgres for prod


## RIPER Workflow

This project uses the RIPER development process for structured, context-efficient development.

### Available Commands
- `/riper:strict` - Enable strict RIPER protocol enforcement
- `/riper:research` - Research mode for information gathering
- `/riper:innovate` - Innovation mode for brainstorming (optional)
- `/riper:plan` - Planning mode for specifications
- `/riper:execute` - Execution mode for implementation
- `/riper:execute <substep>` - Execute a specific substep from the plan
- `/riper:review` - Review mode for validation
- `/memory:save` - Save context to memory bank
- `/memory:recall` - Retrieve from memory bank
- `/memory:list` - List all memories

### Workflow Phases
1. **Research & Innovate** - Understand and explore the codebase and requirements
2. **Plan** - Create detailed technical specifications saved to memory bank
3. **Execute** - Implement exactly what was specified in the approved plan
4. **Review** - Validate implementation against the plan

### Using the Workflow
1. Start with `/riper:strict` to enable strict mode enforcement
2. Use `/riper:research` to investigate the codebase
3. Optionally use `/riper:innovate` to brainstorm approaches
4. Create a plan with `/riper:plan`
5. Execute with `/riper:execute` (or `/riper:execute 1.2` for specific steps)
6. Validate with `/riper:review`

## Memory Bank Policy

### ⚠️ CRITICAL: Repository-Level Memory Bank
- Memory-bank location: Use `git rev-parse --show-toplevel` to find root, then `[ROOT]/.claude/memory-bank/`
- NEVER create memory-banks in subdirectories or packages
- All memories are branch-aware and date-organized
- Memories persist across sessions and can be shared with team

### Memory Bank Structure
```

.claude/memory-bank/
├── [branch-name]/
│ ├── plans/ # Technical specifications
│ ├── reviews/ # Code review reports
│ └── sessions/ # Session context

```

## Development Guidelines
- Follow existing code patterns
- Write tests for new functionality
- Document complex logic
```
