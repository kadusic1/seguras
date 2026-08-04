"use client";

import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { schemes } from "@/lib/colours";
import { ColorSchemeCtx } from "./context";
import { FieldChrome } from "./field-chrome";

/**
 * Props for the {@link PasswordField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface PasswordFieldProps<T extends FieldValues> {
  /** Field path registered with react-hook-form. */
  name: FieldPath<T>;
  /** Visible label text. */
  label: string;
  /** Placeholder text for the `<input>`. */
  placeholder?: string;
  /** Additional validation rules. */
  rules?: RegisterOptions<T>;
}

/**
 * Password input field with a show/hide toggle.
 *
 * Reads the colour scheme from {@link ColorSchemeCtx} and registers itself with
 * react-hook-form via `useFormContext`, mirroring {@link FormField} but
 * adding a local `visible` state that switches the native input between
 * `type="password"` and `type="text"`.
 *
 * @example
 * ```tsx
 * <PasswordField name="password" label="Password" rules={{ required: "Password is required" }} />
 * ```
 */
export function PasswordField<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
}: PasswordFieldProps<T>) {
  const bgScheme = useContext(ColorSchemeCtx);
  const { register } = useFormContext<T>();
  const s = schemes[bgScheme];
  const [visible, setVisible] = useState(false);

  return (
    <FieldChrome
      name={name}
      label={label}
      required={!!rules?.required}
      bgScheme={bgScheme}
    >
      <div className="relative">
        <input
          id={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full rounded-md border px-3 py-2 pr-10 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500 aria-invalid:border-red-500 ${s.input}`}
          {...register(name, rules)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className={`absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer ${s.text.muted}`}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FieldChrome>
  );
}
