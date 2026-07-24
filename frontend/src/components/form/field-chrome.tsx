"use client";

import type { ReactNode } from "react";
import { get, useFormContext } from "react-hook-form";
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
  /** Color scheme token inherited from the parent Form. */
  bgScheme: NeutralColorScheme;
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
  bgScheme,
  children,
}: FieldChromeProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);
  const s = schemes[bgScheme];

  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-1 block text-sm font-semibold ${s.text.primary}`}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>
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
    </div>
  );
}
