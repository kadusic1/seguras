import type { RegisterOptions } from "react-hook-form";

/**
 * Regex that validates a basic email format.
 *
 * Accepts strings with exactly one `@` and at least one character on each side.
 * Does **not** perform full RFC 5322 validation.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Default validation rules keyed by input type.
 *
 * Each field component merges these defaults with any user-supplied rules via
 * `register(name, { ...DEFAULT_RULES[type], ...rules })`.
 *
 * Currently only `"email"` has a default rule (pattern validation); the
 * remaining types return `undefined` and are skipped.
 */
export const DEFAULT_RULES: Partial<
  Record<"text" | "email" | "password" | "number", RegisterOptions>
> = {
  email: {
    pattern: {
      value: EMAIL_PATTERN,
      message: "Enter a valid email address",
    },
  },
};
