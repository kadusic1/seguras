export type ColorScheme = "red" | "black" | "white";

export const textColourMap: Record<ColorScheme, string> = {
  red: "text-red-500",
  black: "text-black",
  white: "text-white",
};

export const textMutedColourMap: Record<ColorScheme, string> = {
  red: "text-red-400/90",
  black: "text-black/80",
  white: "text-white/90",
};

export const bgAccentColourMap: Record<ColorScheme, string> = {
  red: "bg-red-600",
  black: "bg-black",
  white: "bg-white",
};

export const cardBorderBgColourMap: Record<ColorScheme, string> = {
  red: "border-black/10 bg-black/5",
  black: "border-white/10 bg-white/5",
  white: "border-black/10 bg-black/5",
};

export const iconColourMap: Record<ColorScheme, string> = {
  red: "text-red-500",
  black: "text-red-500",
  white: "text-black",
};

export const titleColourMap: Record<ColorScheme, string> = {
  red: "text-black",
  black: "text-white",
  white: "text-black",
};

export const descColourMap: Record<ColorScheme, string> = {
  red: "text-black/60",
  black: "text-white/70",
  white: "text-black/60",
};

export const linkColourMap: Record<ColorScheme, string> = {
  red: "text-red-500 hover:text-red-400",
  black: "text-red-500 hover:text-red-400",
  white: "text-black/70 hover:text-black",
};

export const sectionBgColourMap: Record<ColorScheme, string> = {
  red: "bg-white",
  black: "bg-black",
  white: "bg-white",
};

export const sectionTextSchemeMap: Record<ColorScheme, ColorScheme> = {
  red: "black",
  black: "white",
  white: "black",
};

export type ButtonVariant = "a" | "b" | "c" | "d";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  a: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  b: "border border-red-600 text-red-500 hover:bg-red-600/10",
  c: "bg-black text-white shadow-sm hover:bg-gray-900",
  d: "border border-white text-white hover:bg-white/10",
};

export const schemeToButtonVariant: Record<ColorScheme, ButtonVariant> = {
  red: "a",
  black: "a",
  white: "c",
};
