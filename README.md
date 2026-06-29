# Tallos

Tallos is a B2B platform where teams **spin up AI agents** to help them get work done.

- **Today (MVP):** one built-in productivity agent.
- **Coming (v2):** create and configure your own agents.

## Tech stack

- [TanStack Start](https://tanstack.com/start) — full-stack React, SSR via Nitro
- React 19 · [Tailwind CSS v4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com)
- [Vite 8](https://vite.dev) · TypeScript 7
- [Bun](https://bun.com) — package manager & runtime
- [oxlint](https://oxc.rs) + oxfmt (via [ultracite](https://ultracite.ai))

## Getting started

```bash
bun install
bun run dev
```

Then open http://localhost:3000.

## Scripts

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `bun run dev`   | Start the dev server on port 3000                    |
| `bun run build` | Production build (Vite → Nitro output in `.output/`) |
| `bun run start` | Run the built production server                      |
| `bun run check` | Lint + format check (oxlint + oxfmt)                 |
| `bun run fix`   | Auto-fix lint and formatting issues                  |

## Project structure

```
src/
  router.tsx        # TanStack Start router (getRouter)
  routes/           # file-based routes (__root.tsx, index.tsx, …)
  styles/app.css    # Tailwind entry + shadcn theme
  lib/utils.ts      # cn() class-name helper
  components/ui/    # shadcn components
```

Routing is file-based: add a file under `src/routes/` and the route tree (`src/routeTree.gen.ts`) is regenerated automatically.

## Roadmap

- **MVP** — a single productivity agent.
- **v2** — let users dynamically create and configure their own agents.
