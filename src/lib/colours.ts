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
  red: "border-white/20 bg-white/10",
  black: "border-white/10 bg-white/5",
  white: "border-black/10 bg-black/5",
};

export const iconColourMap: Record<ColorScheme, string> = {
  red: "text-white",
  black: "text-red-500",
  white: "text-red-500",
};

export const titleColourMap: Record<ColorScheme, string> = {
  red: "text-white",
  black: "text-white",
  white: "text-black",
};

export const descColourMap: Record<ColorScheme, string> = {
  red: "text-white/80",
  black: "text-white/70",
  white: "text-black/60",
};

export const linkColourMap: Record<ColorScheme, string> = {
  red: "text-white/90 hover:text-white",
  black: "text-red-500 hover:text-red-400",
  white: "text-red-500 hover:text-red-400",
};

export const captionBgColourMap: Record<ColorScheme, string> = {
  red: "bg-white",
  black: "bg-white",
  white: "bg-black",
};

export const captionHeadingSchemeMap: Record<ColorScheme, ColorScheme> = {
  red: "black",
  black: "black",
  white: "white",
};

export const sectionBgColourMap: Record<ColorScheme, string> = {
  red: "bg-red-600",
  black: "bg-black",
  white: "bg-white",
};

export const sectionTextSchemeMap: Record<ColorScheme, ColorScheme> = {
  red: "white",
  black: "white",
  white: "black",
};

export const listingAccentColourMap: Record<ColorScheme, string> = {
  red: "border-l-white",
  black: "border-l-red-500",
  white: "border-l-red-500",
};

export const badgeColourMap: Record<ColorScheme, string> = {
  red: "bg-red-700 text-white",
  black: "bg-red-500/10 text-red-400",
  white: "bg-red-500/10 text-red-600",
};

export const listingMetaColourMap: Record<ColorScheme, string> = {
  red: "text-white/60",
  black: "text-white/50",
  white: "text-black/50",
};

export type ButtonVariant = "primary" | "outline" | "link";

export const buttonVariantStyles: Record<
  ButtonVariant,
  Record<ColorScheme, string>
> = {
  primary: {
    red: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    black: "bg-black text-white shadow-sm hover:bg-gray-900",
    white: "bg-white text-red-600 shadow-sm hover:bg-red-50",
  },
  outline: {
    red: "border border-red-600 text-red-500 hover:bg-red-600/10",
    black: "border border-black text-black hover:bg-black/10",
    white: "border border-white text-white hover:bg-white/10",
  },
  link: {
    red: "text-white/90 hover:text-white",
    black: "text-red-500 hover:text-red-400",
    white: "text-red-500 hover:text-red-400",
  },
};

export const schemeToButtonColorScheme: Record<ColorScheme, ColorScheme> = {
  red: "white",
  black: "red",
  white: "red",
};
