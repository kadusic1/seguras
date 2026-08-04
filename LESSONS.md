# Lessons Learned

## Em dashes and emojis forbidden in project files

Do not use em dashes (---) or emojis in any project documentation or plan files. Use regular hyphens and plain text only.

Context: Plan files in `plans/agentic-workflow-plan/` had em dashes and a checkmark emoji, which the user flagged and requested removed.

## `color` vs `colorScheme` prop naming inversion

When renaming a prop from `color` (which meant "what text color to use") to `colorScheme` (which means "what background scheme I'm on"), beware the inversion: old `color="white"` gave white text, new `colorScheme="white"` gives black text (it means "on a white background"). A component with no explicit prop that defaulted to `"white"` now gets inverted colors. Always check call sites that relied on the default.

Context: HeroSlide's Heading/Text had no `color` prop (defaulted to `"white"`, got white text via `textColourMap`). Refactored to `colorScheme` defaulting to `"white"`, which resolved to `schemes.white.text.primary = "text-black"`. Fixed by passing `colorScheme="black"` explicitly in the hero overlay.

## Biome vcs.root regression in v2.1.2 - v2.3.x

When `biome.json` is in a subdirectory and `vcs.useIgnoreFile: true`, Biome has a confirmed bug (#6964) where `vcs.root` is ignored. It always looks for `.gitignore` in the same directory as `biome.json` regardless of the `root` setting. Fixed in Biome v2.4.8+.

Fix: upgrade to Biome 2.4.8+ and set `"root": "../"` in biome.json (relative to the config file, pointing to repo root).

Context: Moved biome.json to `frontend/biome.json` during monorepo migration. Pre-commit hook failed because biome couldn't find `.gitignore` in `frontend/`. Upgraded from v2.2.0 to v2.5.5 and added `"root": "../"` to resolve it.

## Lefthook `{staged_files}` with `cd` in run command

When a lefthook `run` command does `cd subdir && ...`, the `{staged_files}` variable still contains paths relative to the git root. Using them directly after `cd` produces wrong paths (e.g. `frontend/frontend/file.ts`).

Fix: use `git -C .. add {staged_files}` to reference the repo root from the subdirectory.

## React Hook Form submit values are strings, even for `type="number"`

RHF never coerces field values unless `valueAsNumber: true` is set. A `<FormField type="number">` (or `type="text"` with `inputMode="numeric"`) submits `hours_available` as the string `"5"`, which Go's `encoding/json` rejects when the target struct field is `int` (400 "invalid json body"). Also note the browser sanitizes non-numeric input in `type="number"` to an empty string, which is why custom validation messages never fire for garbage input.

Fix: convert at the payload boundary in the submit handler, e.g. `hours_available: Number(data.hoursAvailable)`. Do not change the backend contract to accept strings.

Context: Switching the jobs form's hours field from `type="number"` to `type="text"` + `inputMode="numeric"` exposed that submission sent a string, which the Go backend rejected. The latent bug existed with `type="number"` too, since RHF does not coerce by default.
