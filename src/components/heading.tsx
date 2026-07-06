import type { ReactNode } from "react";
import { type ColorScheme, textColourMap } from "@/lib/colours";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

const base =
  "font-black italic leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";

export function Heading({
  className,
  children,
  color = "white",
}: HeadingProps) {
  return (
    <h2
      className={`${base} ${textColourMap[color]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </h2>
  );
}
