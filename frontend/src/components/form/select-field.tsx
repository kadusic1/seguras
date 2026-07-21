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
 * Props for the {@link SelectField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface SelectFieldProps<T extends FieldValues> {
  /** Field path registered with react-hook-form. */
  name: FieldPath<T>;
  /** Visible label text. */
  label: string;
  /** Dropdown option list. The first option is always a disabled placeholder. */
  options: { label: string; value: string }[];
  /** Placeholder text shown as the first disabled option. Defaults to `"Select an option"`. */
  placeholder?: string;
  /** Validation rules passed to `register`. */
  rules?: RegisterOptions<T>;
}

/**
 * Dropdown / select field that registers with react-hook-form.
 *
 * Renders a disabled placeholder option as the first item. Reads the colour
 * scheme from {@link FormCtx} (set by a parent {@link Form}).
 *
 * @example
 * ```tsx
 * <SelectField
 *   name="role"
 *   label="Role"
 *   options={[
 *     { label: "Admin", value: "admin" },
 *     { label: "Editor", value: "editor" },
 *   ]}
 *   rules={{ required: "Pick a role" }}
 * />
 * ```
 */
export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  rules,
}: SelectFieldProps<T>) {
  const bgScheme = useContext(FormCtx);
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name);
  const s = schemes[bgScheme];

  return (
    <FieldChrome
      name={name}
      label={label}
      required={!!rules?.required}
      error={error}
      bgScheme={bgScheme}
    >
      <select
        id={name}
        defaultValue=""
        className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500 aria-invalid:border-red-500 ${s.input}`}
        {...register(name, rules)}
      >
        <option value="" disabled>
          {placeholder ?? "Select an option"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldChrome>
  );
}
