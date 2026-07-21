"use client";

import { useContext } from "react";
import {
  type FieldPath,
  type FieldValues,
  get,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { schemes } from "@/lib/colours";
import { FormCtx } from "./context";
import { FieldChrome } from "./field-chrome";
import { DEFAULT_RULES } from "./rules";
import type { FieldType } from "./types";

/**
 * Props for the {@link FormField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface FormFieldProps<T extends FieldValues> {
  /** Field path registered with react-hook-form. */
  name: FieldPath<T>;
  /** Visible label text. */
  label: string;
  /** Placeholder text for the `<input>`. */
  placeholder?: string;
  /** Additional validation rules merged on top of type-specific defaults. */
  rules?: RegisterOptions<T>;
  /**
   * Input type. Controls which default validation rules are applied:
   * - `"email"` — adds a pattern validator
   * - `"text"`, `"password"`, `"number"` — no built-in defaults
   */
  type?: FieldType;
}

/**
 * Single-line text, email, password, or number input field.
 *
 * Reads the colour scheme from {@link FormCtx} (set by a parent {@link Form})
 * and registers itself with react-hook-form via `useFormContext`.
 *
 * @example
 * ```tsx
 * <FormField name="email" label="Email" type="email" rules={{ required: "Email is required" }} />
 * ```
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  type = "text",
}: FormFieldProps<T>) {
  const bgScheme = useContext(FormCtx);
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name);
  const s = schemes[bgScheme];
  const effectiveRules = {
    ...(DEFAULT_RULES[type] ?? {}),
    ...rules,
  } as RegisterOptions<T>;

  return (
    <FieldChrome
      name={name}
      label={label}
      required={!!effectiveRules.required}
      error={error}
      bgScheme={bgScheme}
    >
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500 aria-invalid:border-red-500 ${s.input}`}
        {...register(name, effectiveRules)}
      />
    </FieldChrome>
  );
}
