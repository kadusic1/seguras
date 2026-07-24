"use client";

import { useContext } from "react";
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { schemes } from "@/lib/colours";
import { FormCtx } from "./context";
import { FieldChrome } from "./field-chrome";

/**
 * Props for the {@link CheckboxGroupField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface CheckboxGroupFieldProps<T extends FieldValues> {
  /** Field path registered with react-hook-form (all checkboxes share this name). */
  name: FieldPath<T>;
  /** Visible legend text for the group. */
  label: string;
  /** Checkbox options rendered inside the group. */
  options: { label: string; value: string }[];
  /** Validation rules passed to `register`. */
  rules?: RegisterOptions<T>;
}

/**
 * Multi-checkbox group rendered as a `<fieldset>` with a `<legend>`.
 *
 * All checkboxes share the same `name` so react-hook-form collects values as an
 * array. Reads the colour scheme from {@link FormCtx} (set by a parent
 * {@link Form}).
 *
 * @example
 * ```tsx
 * <CheckboxGroupField
 *   name="permissions"
 *   label="Permissions"
 *   options={[
 *     { label: "Read", value: "read" },
 *     { label: "Write", value: "write" },
 *     { label: "Delete", value: "delete" },
 *   ]}
 *   columns={2}
 *   rules={{
 *     validate: (v) => Array.isArray(v) && v.length > 0 || "Pick at least one",
 *   }}
 * />
 * ```
 */
export function CheckboxGroupField<T extends FieldValues>({
  name,
  label,
  options,
  rules,
}: CheckboxGroupFieldProps<T>) {
  const bgScheme = useContext(FormCtx);
  const { register } = useFormContext<T>();
  const s = schemes[bgScheme];

  return (
    <FieldChrome
      name={name}
      label={label}
      required={!!rules?.required}
      bgScheme={bgScheme}
    >
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`${name}-${opt.value}`}
            className={`flex items-center gap-2 text-sm ${s.text.primary}`}
          >
            <input
              id={`${name}-${opt.value}`}
              type="checkbox"
              value={opt.value}
              className="h-4 w-4 rounded border focus-visible:outline-2 focus-visible:outline-red-500"
              {...register(name, rules)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldChrome>
  );
}
