import type { ReactNode } from "react";
import {
  type ColorScheme,
  descColourMap,
  textMutedColourMap,
} from "@/lib/colours";

type TextVariant = "lead" | "body" | "small";

interface TextProps {
  as?: "p" | "span" | "div";
  variant: TextVariant;
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

const variantStyles: Record<TextVariant, string> = {
  lead: "text-base font-bold tracking-wide md:text-lg lg:text-xl",
  body: "text-base sm:text-lg leading-relaxed",
  small: "text-sm",
};

const colourMapForVariant: Record<TextVariant, Record<ColorScheme, string>> = {
  lead: textMutedColourMap,
  body: descColourMap,
  small: textMutedColourMap,
};

export function Text({
  as: Tag = "p",
  variant,
  className,
  children,
  color = "white",
}: TextProps) {
  return (
    <Tag
      className={`${variantStyles[variant]} ${colourMapForVariant[variant][color]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
