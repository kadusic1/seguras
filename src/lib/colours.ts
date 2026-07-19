export type ColorScheme = "red" | "black" | "white";

export interface SchemeTokens {
  text: {
    primary: string;
    muted: string;
  };
  bg: string;
  accent: string;
  card: string;
  fill: string;
  captionScheme: ColorScheme;
  buttonScheme: ColorScheme;
  input: string;
}

export const schemes: Record<ColorScheme, SchemeTokens> = {
  red: {
    text: { primary: "text-white", muted: "text-white/80" },
    bg: "bg-red-600",
    accent: "text-white",
    card: "border-white/20 bg-white/10",
    fill: "#dc2626",
    captionScheme: "white",
    buttonScheme: "white",
    input: "border-white/30 bg-white/15 text-white placeholder:text-white/50",
  },
  black: {
    text: { primary: "text-white", muted: "text-white/70" },
    bg: "bg-black",
    accent: "text-red-500",
    card: "border-white/10 bg-white/5",
    fill: "#000000",
    captionScheme: "white",
    buttonScheme: "red",
    input: "border-white/20 bg-white/10 text-white placeholder:text-white/50",
  },
  white: {
    text: { primary: "text-black", muted: "text-black/60" },
    bg: "bg-white",
    accent: "text-red-500",
    card: "border-black/10 bg-black/5",
    fill: "#ffffff",
    captionScheme: "black",
    buttonScheme: "red",
    input: "border-black/20 bg-white text-black placeholder:text-black/40",
  },
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
