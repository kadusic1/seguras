import type { ReactNode } from "react";
import { type ColorScheme, textMutedColourMap } from "@/lib/colours";

interface LeadProps {
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

const base = "text-base font-bold tracking-wide md:text-lg lg:text-xl";

export function Lead({ className, children, color = "white" }: LeadProps) {
  return (
    <p
      className={`${base} ${textMutedColourMap[color]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}
