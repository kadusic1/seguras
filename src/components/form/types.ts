/**
 * Supported HTML input types for {@link FormField}.
 *
 * Determines which default validation rules are applied and which input
 * element is rendered.
 */
export type FieldType = "text" | "email" | "password" | "number";

/**
 * Color schemes supported by form components.
 *
 * A subset of the global {@link ColorScheme} — forms intentionally exclude
 * the `"red"` variant so they always have a neutral background.
 */
export type FormColorScheme = "white" | "black";
