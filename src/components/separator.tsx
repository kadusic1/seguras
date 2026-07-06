interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return (
    <div
      className={`h-2 w-36 md:w-64 rounded-sm bg-red-600 mx-auto${className ? ` ${className}` : ""}`}
    />
  );
}
