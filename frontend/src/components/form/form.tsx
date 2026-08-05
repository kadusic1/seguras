"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { Button, Heading, Spinner, Text } from "@/components/ui";
import type { NeutralColorScheme } from "@/lib/colours";
import { schemes } from "@/lib/colours";
import { ColorSchemeCtx, FormBusyCtx } from "./context";

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
  bgScheme?: NeutralColorScheme;
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
 * Sets up a `FormProvider` and `ColorSchemeCtx` so that child field components
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
 *   <PasswordField name="password" label="Password" placeholder="Enter your password"
 *    rules={{required: "Password is required" }} />
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
  const [busyCount, setBusyCount] = useState(0);
  const isBusy = busyCount > 0;
  const runTask = async <T,>(task: () => T | Promise<T>) => {
    setBusyCount((c) => c + 1);
    try {
      return await task();
    } finally {
      setBusyCount((c) => c - 1);
    }
  };

  return (
    <FormBusyCtx.Provider value={{ isBusy, runTask }}>
      <ColorSchemeCtx.Provider value={bgScheme}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((data) => {
              if (isBusy) return;
              return onSubmit(data);
            })}
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
              {/* Unclickable while submitting or while a FileInputField
                  upload/remove is in flight (shown dimmed); the spinner
                  appears only while actually submitting. */}
              <Button
                type="submit"
                disabled={isSubmitting || isBusy}
                bgScheme={s.buttonScheme}
                {...(submitIcon
                  ? submitIconPosition === "left"
                    ? { iconLeft: submitIcon }
                    : { iconRight: submitIcon }
                  : {})}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner size={16} label="Submitting" />
                    Submitting...
                  </span>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </ColorSchemeCtx.Provider>
    </FormBusyCtx.Provider>
  );
}
