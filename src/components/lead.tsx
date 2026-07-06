import type { ReactNode } from "react";
import type { ColorScheme } from "@/lib/colours";

interface LeadProps {
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

const base = "text-base font-bold tracking-wide md:text-lg lg:text-xl";

const colourMap: Record<ColorScheme, string> = {
  red: "text-red-400/90",
  black: "text-black/80",
  white: "text-white/90",
};

export function Lead({ className, children, color = "white" }: LeadProps) {
  return (
    <p
      className={`${base} ${colourMap[color]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}
