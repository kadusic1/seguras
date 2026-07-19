"use client";

import { createContext, type ReactNode, useContext } from "react";
import {
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  FormProvider,
  get,
  type RegisterOptions,
  useForm,
  useFormContext,
} from "react-hook-form";
import { type ColorScheme, schemes } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

const FormCtx = createContext<ColorScheme>("white");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_RULES: Partial<
  Record<"text" | "email" | "password" | "number", RegisterOptions>
> = {
  email: {
    pattern: {
      value: EMAIL_PATTERN,
      message: "Enter a valid email address",
    },
  },
};

function FieldChrome({
  name,
  label,
  required,
  error,
  bgScheme,
  as = "label",
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: { message?: unknown };
  bgScheme: ColorScheme;
  as?: "label" | "fieldset";
  children: ReactNode;
}) {
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

export function Form<T extends FieldValues>({
  header,
  subtitle,
  onSubmit,
  defaultValues,
  submitLabel = "Submit",
  bgScheme = "white",
  className,
  children,
}: {
  header: ReactNode;
  subtitle?: ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: DefaultValues<T>;
  submitLabel?: string;
  bgScheme?: ColorScheme;
  className?: string;
  children: ReactNode;
}) {
  const methods = useForm<T>({ defaultValues, mode: "onBlur" });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const s = schemes[bgScheme];

  return (
    <FormCtx.Provider value={bgScheme}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={`rounded-lg p-6 sm:p-8 ${s.bg}${className ? ` ${className}` : ""}`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Heading as="h2" size="md" bgScheme={bgScheme}>
                {header}
              </Heading>
              {subtitle && (
                <Text variant="base" bgScheme={bgScheme}>
                  {subtitle}
                </Text>
              )}
            </div>
            {children}
            <Button
              type="submit"
              disabled={isSubmitting}
              bgScheme={s.buttonScheme}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormCtx.Provider>
  );
}

export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  type = "text",
}: {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  type?: "text" | "email" | "password" | "number";
}) {
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

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  rules,
}: {
  name: FieldPath<T>;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  rules?: RegisterOptions<T>;
}) {
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

export function CheckboxGroupField<T extends FieldValues>({
  name,
  label,
  options,
  rules,
  columns = 1,
}: {
  name: FieldPath<T>;
  label: string;
  options: { label: string; value: string }[];
  rules?: RegisterOptions<T>;
  columns?: 1 | 2;
}) {
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
