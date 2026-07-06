import type { ColorScheme } from "@/lib/colours";

interface SeparatorProps {
  className?: string;
  color?: ColorScheme;
}

const colourMap: Record<ColorScheme, string> = {
  red: "bg-red-600",
  black: "bg-black",
  white: "bg-white",
};

export function Separator({ className, color = "red" }: SeparatorProps) {
  return (
    <div
      className={`h-2 w-36 md:w-64 rounded-sm mx-auto ${colourMap[color]}${className ? ` ${className}` : ""}`}
    />
  );
}
