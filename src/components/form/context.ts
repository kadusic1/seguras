import { createContext } from "react";
import type { ColorScheme } from "@/lib/colours";

/**
 * React context that propagates the color scheme down to all field components
 * rendered inside a {@link Form}. Set automatically by the Form component.
 *
 * @internal
 */
export const FormCtx = createContext<ColorScheme>("white");
