import type { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

const base =
  "font-black italic leading-tight text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";

export function Heading({ className, children }: HeadingProps) {
  return (
    <h2 className={`${base}${className ? ` ${className}` : ""}`}>{children}</h2>
  );
}
