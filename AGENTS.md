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
- Run `bun run type-check` before considering any task done
- Never install duplicate dependencies - check `package.json` first
- Use `@/` path aliases for all imports
<!-- END:seguras-project-rules -->
