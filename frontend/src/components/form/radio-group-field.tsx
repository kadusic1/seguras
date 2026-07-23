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

/**
 * Props for the {@link RadioGroupField} component.
 *
 * @typeParam T - Shape of the form data (must extend `FieldValues`).
 */
export interface RadioGroupFieldProps<T extends FieldValues> {
  /** Field name registered with react-hook-form. */
  name: FieldPath<T>;
  /** Label rendered above the radio group. */
  label: string;
  /** Radio options displayed as a list. */
  options: { label: string; value: string }[];
  /** Validation rules forwarded to `register()`. */
  rules?: RegisterOptions<T>;
  /** Number of grid columns. Defaults to `1`. */
  columns?: 1 | 2;
}

/**
 * A radio group field rendered inside a {@link Form}.
 *
 * Wraps each radio input in a `<label>` element for accessible toggling and
 * groups them in a configurable column grid. Options are spread across the
 * grid so every choice is visible at once.
 *
 * @typeParam T - Shape of the form data (must extend `FieldValues`).
 */
export function RadioGroupField<T extends FieldValues>({
  name,
  label,
  options,
  rules,
  columns = 1,
}: RadioGroupFieldProps<T>) {
  const bgScheme = useContext(FormCtx);
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name);
  const s = schemes[bgScheme];

  return (
    <FieldChrome
      as="fieldset"
      name={name}
      label={label}
      required={!!rules?.required}
      error={error}
      bgScheme={bgScheme}
    >
      <div
        className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`${name}-${opt.value}`}
            className={`flex items-center gap-2 text-sm ${s.text.primary}`}
          >
            <input
              id={`${name}-${opt.value}`}
              type="radio"
              value={opt.value}
              className="h-4 w-4 border focus-visible:outline-2 focus-visible:outline-red-500"
              {...register(name, rules)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldChrome>
  );
}
