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

  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-1 block text-sm font-semibold ${s.text.primary}`}
      >
        {label}
        {rules?.required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500 aria-invalid:border-red-500 ${s.input}`}
        {...register(name, rules)}
      />
      {error?.message && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-sm text-red-500"
        >
          {error.message as string}
        </p>
      )}
    </div>
  );
}
