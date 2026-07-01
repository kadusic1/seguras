@~/.config/opencode/AGENTS.md
@LESSONS.md

Every user-corrected mistake must be recorded immediately in `LESSONS.md` for continuous learning.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:seguras-project-rules -->
# Seguras Project Rules

- This is a **Next.js 16** project - use `next/link` not `react-router`, use RSC patterns
- **Server-first:** every component is a Server Component by default. Use `'use client'` only for interactivity; push it as deep as possible
- **`app/` is for routing only** -- keep it thin. A `page.tsx` must be readable in 30 seconds (compose, don't implement). No business logic, DB calls, or validation rules in page files
- Business logic goes in `features/<name>/` (each with `components/`, `hooks/`, `actions/`, `queries/`, `types.ts`, `index.ts` as public API). Reusable UI in `components/`. Infrastructure in `lib/`
- Use private folders (`_components/`, `_lib/`) inside route directories for route-specific code; promote to shared folders only when 2+ routes use it
- Use route groups `(marketing)`, `(app)`, `(auth)` from day one
- Use `server-only` on files that access DB, API keys, or tokens to prevent accidental client imports
- Dependency flow: `app/` -> `features/`/`components/` -> `lib/` (never the reverse)
- Run `bun run type-check` before considering any task done
- Never install duplicate dependencies - check `package.json` first
- Use `@/` path aliases for all imports
<!-- END:seguras-project-rules -->
