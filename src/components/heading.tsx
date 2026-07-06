import type { ReactNode } from "react";
import type { ColorScheme } from "@/lib/colours";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

const base =
  "font-black italic leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";

const colourMap: Record<ColorScheme, string> = {
  red: "text-red-500",
  black: "text-black",
  white: "text-white",
};

export function Heading({
  className,
  children,
  color = "white",
}: HeadingProps) {
  return (
    <h2
      className={`${base} ${colourMap[color]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </h2>
  );
}
