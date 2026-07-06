import { bgAccentColourMap, type ColorScheme } from "@/lib/colours";

interface SeparatorProps {
  className?: string;
  color?: ColorScheme;
}

export function Separator({ className, color = "red" }: SeparatorProps) {
  return (
    <div
      className={`h-2 w-36 md:w-64 rounded-sm mx-auto ${bgAccentColourMap[color]}${className ? ` ${className}` : ""}`}
    />
  );
}
