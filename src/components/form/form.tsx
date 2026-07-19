"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { type ColorScheme, schemes } from "@/lib/colours";
import { Button } from "../button";
import { Heading } from "../heading";
import { Text } from "../text";
import { FormCtx } from "./context";

/**
 * Props for the {@link Form} component.
 *
 * @typeParam T - Shape of the form data (must extend `FieldValues`).
 */
export interface FormProps<T extends FieldValues> {
  /** Heading rendered at the top of the form card. */
  header: ReactNode;
  /** Optional subtitle rendered below the heading. */
  subtitle?: ReactNode;
  /**
   * Submit handler called with validated form data.
   * Receives the parsed `T` object after successful validation.
   */
  onSubmit: (data: T) => void | Promise<void>;
  /** Default values passed to `useForm`. */
  defaultValues?: DefaultValues<T>;
  /** Label for the submit button. Defaults to `"Submit"`. */
  submitLabel?: string;
  /** Background colour scheme. Defaults to `"white"`. */
  bgScheme?: ColorScheme;
  /** Additional classes forwarded to the `<form>` element. */
  className?: string;
  /** Icon rendered alongside the heading. */
  headerIcon?: LucideIcon;
  /** Side of the heading the icon appears on. Defaults to `"left"`. */
  headerIconPosition?: "left" | "right";
  /** Icon rendered inside the submit button. */
  submitIcon?: ReactNode;
  /** Side of the submit button the icon appears on. Defaults to `"left"`. */
  submitIconPosition?: "left" | "right";
  /** Form fields rendered inside the provider context. */
  children: ReactNode;
}

/**
 * Accessible, themeable form wrapper built on react-hook-form.
 *
 * Sets up a `FormProvider` and `FormCtx` so that child field components
 * ({@link FormField}, {@link SelectField}, {@link CheckboxGroupField}) can
 * register themselves and inherit the colour scheme.
 *
 * @example
 * ```tsx
 * <Form<LoginForm>
 *   header="Sign In"
 *   onSubmit={(data) => console.log(data)}
 *   defaultValues={{ email: "", password: "" }}
 * >
 *   <FormField name="email" label="Email" type="email" rules={{ required: true }} />
 *   <FormField name="password" label="Password" type="password" />
 * </Form>
 * ```
 */
export function Form<T extends FieldValues>({
  header,
  subtitle,
  onSubmit,
  defaultValues,
  submitLabel = "Submit",
  bgScheme = "white",
  className,
  headerIcon,
  headerIconPosition = "left",
  submitIcon,
  submitIconPosition = "left",
  children,
}: FormProps<T>) {
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
              <Heading
                as="h2"
                size="md"
                bgScheme={bgScheme}
                icon={headerIcon}
                iconPosition={headerIconPosition}
              >
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
              {...(submitIcon
                ? submitIconPosition === "left"
                  ? { iconLeft: submitIcon }
                  : { iconRight: submitIcon }
                : {})}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormCtx.Provider>
  );
}
