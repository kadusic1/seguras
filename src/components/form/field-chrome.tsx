"use client";

import type { ReactNode } from "react";
import type { NeutralColorScheme } from "@/lib/colours";
import { schemes } from "@/lib/colours";

/**
 * Props for {@link FieldChrome}.
 *
 * @internal
 */
export interface FieldChromeProps {
  /** Field name (used for error message `id` and label `htmlFor`). */
  name: string;
  /** Visible label text rendered above the field. */
  label: string;
  /** Show a red asterisk next to the label when `true`. */
  required?: boolean;
  /** Field-level error object from react-hook-form (checked for a string `.message`). */
  error?: { message?: unknown };
  /** Color scheme token inherited from the parent Form. */
  bgScheme: NeutralColorScheme;
  /**
   * Semantic wrapper element.
   * - `"label"` (default) — renders a `<div>` with an inner `<label htmlFor={name}>`.
   * - `"fieldset"` — renders a `<fieldset>` with a `<legend>` (for checkbox groups).
   */
  as?: "label" | "fieldset";
  /** Field control(s) rendered inside the chrome. */
  children: ReactNode;
}

/**
 * Layout wrapper that renders a label, required indicator, child control, and
 * an error message for a single form field.
 *
 * Used internally by {@link FormField}, {@link SelectField}, and
 * {@link CheckboxGroupField}.
 *
 * @internal
 */
export function FieldChrome({
  name,
  label,
  required,
  error,
  bgScheme,
  as = "label",
  children,
}: FieldChromeProps) {
  const s = schemes[bgScheme];
  const Wrapper = as === "fieldset" ? "fieldset" : "div";
  const LabelTag = as === "fieldset" ? "legend" : "label";
  const labelProps = as === "fieldset" ? {} : { htmlFor: name };

  return (
    <Wrapper className={as === "fieldset" ? "border-0 p-0 m-0" : undefined}>
      <LabelTag
        {...labelProps}
        className={`mb-1 block text-sm font-semibold ${s.text.primary}`}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </LabelTag>
      {children}
      {typeof error?.message === "string" && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-sm text-red-500"
        >
          {error.message}
        </p>
      )}
    </Wrapper>
  );
}
