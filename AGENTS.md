# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is **Impact Creator Hub** — a Next.js 16 (App Router) application with React 19. It serves static creator profile pages designed for brand-ready collaborations.

### Tech stack

- **Runtime:** Node.js 22 (managed via nvm)
- **Package manager:** npm (lockfile: `package-lock.json`)
- **Framework:** Next.js 16 with Turbopack (dev) and App Router
- **UI:** React 19, plain CSS (`app/globals.css`)

### Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (starts on port 3000 by default) |
| Production build | `npm run build` |
| Start prod server | `npm run start` |

### Notes for cloud agents

- No linter or formatter is currently configured in the project. If one is added later, run it before committing.
- No automated test framework is configured yet. If tests are added, check `package.json` scripts for the test command.
- The dev server uses Turbopack and starts in ~250ms. Hot reload works automatically.
- There are no environment variables or secrets required to run this app — it is fully static.
- No database or external services are needed.
