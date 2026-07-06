import type { ReactNode } from "react";

interface LeadProps {
  children: ReactNode;
  className?: string;
}

const base =
  "text-base font-bold tracking-wide text-white/90 md:text-lg lg:text-xl";

export function Lead({ className, children }: LeadProps) {
  return (
    <p className={`${base}${className ? ` ${className}` : ""}`}>{children}</p>
  );
}
