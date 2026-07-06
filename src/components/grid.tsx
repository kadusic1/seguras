import type { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

const gridColsMap = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
} as const;

export function Grid({ children, cols = 3, className }: GridProps) {
  return (
    <div
      className={`mt-16 grid grid-cols-1 gap-6 ${gridColsMap[cols]} lg:gap-8${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
