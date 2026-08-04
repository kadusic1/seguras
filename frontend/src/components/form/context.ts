"use client";

import { createContext, useContext } from "react";
import type { NeutralColorScheme } from "@/lib/colours";

/**
 * React context that propagates the color scheme down to all field components
 * rendered inside a {@link Form}. Set automatically by the Form component.
 *
 * @internal
 */
export const FormCtx = createContext<NeutralColorScheme>("white");

export interface FormBusyValue {
  /** True while at least one async field task is running. */
  isBusy: boolean;
  /** Runs a task while marking the form as busy; always clears on completion. */
  runTask: (task: () => void | Promise<void>) => Promise<void>;
}

/**
 * React context that tracks in-flight async work (e.g. file uploads) so the
 * Form can block submission until it completes. Set by the Form component.
 *
 * @internal
 */
export const FormBusyCtx = createContext<FormBusyValue | null>(null);

/**
 * Returns the busy tracker of the enclosing {@link Form}.
 *
 * @internal
 */
export function useFormBusy() {
  const ctx = useContext(FormBusyCtx);
  if (!ctx) throw new Error("useFormBusy must be used inside a Form");
  return ctx;
}
