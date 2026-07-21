import type { ReactNode } from "react";
import { type ColorScheme, schemes } from "@/lib/colours";

type TextVariant = "lg" | "base" | "sm";

interface TextProps {
  as?: "p" | "span" | "div";
  variant: TextVariant;
  children: ReactNode;
  className?: string;
  bgScheme?: ColorScheme;
  emphasis?: "primary" | "muted";
}

const variantStyles: Record<TextVariant, string> = {
  lg: "text-base font-bold tracking-wide md:text-lg lg:text-xl",
  base: "text-base sm:text-lg leading-relaxed",
  sm: "text-sm",
};

const defaultEmphasis: Record<TextVariant, "primary" | "muted"> = {
  lg: "primary",
  base: "muted",
  sm: "muted",
};

export function Text({
  as: Tag = "p",
  variant,
  className,
  children,
  bgScheme = "white",
  emphasis,
}: TextProps) {
  const resolvedEmphasis = emphasis ?? defaultEmphasis[variant];
  const s = schemes[bgScheme];
  const textColor =
    resolvedEmphasis === "primary" ? s.text.primary : s.text.muted;

  return (
    <Tag
      className={`${variantStyles[variant]} ${textColor}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
