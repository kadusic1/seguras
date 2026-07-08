# Lessons Learned

## Em dashes and emojis forbidden in project files

Do not use em dashes (---) or emojis in any project documentation or plan files. Use regular hyphens and plain text only.

Context: Plan files in `plans/agentic-workflow-plan/` had em dashes and a checkmark emoji, which the user flagged and requested removed.

## `color` vs `colorScheme` prop naming inversion

When renaming a prop from `color` (which meant "what text color to use") to `colorScheme` (which means "what background scheme I'm on"), beware the inversion: old `color="white"` gave white text, new `colorScheme="white"` gives black text (it means "on a white background"). A component with no explicit prop that defaulted to `"white"` now gets inverted colors. Always check call sites that relied on the default.

Context: HeroSlide's Heading/Text had no `color` prop (defaulted to `"white"`, got white text via `textColourMap`). Refactored to `colorScheme` defaulting to `"white"`, which resolved to `schemes.white.text.primary = "text-black"`. Fixed by passing `colorScheme="black"` explicitly in the hero overlay.
