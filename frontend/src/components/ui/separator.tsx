import { type ColorScheme, schemes } from "@/lib/colours";

interface SeparatorProps {
  className?: string;
  bgScheme?: ColorScheme;
}

export function Separator({ className, bgScheme = "red" }: SeparatorProps) {
  return (
    <div
      className={`h-2 w-36 md:w-64 rounded-sm mx-auto ${schemes[bgScheme].bg}${className ? ` ${className}` : ""}`}
    />
  );
}
