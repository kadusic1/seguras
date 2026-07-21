import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorTextProps {
  children: ReactNode;
  className?: string;
}

export function ErrorText({ children, className }: ErrorTextProps) {
  return (
    <p
      className={`flex items-center gap-1.5 text-base text-red-600${className ? ` ${className}` : ""}`}
    >
      <CircleAlert className="h-5 w-5" strokeWidth={3} />
      {children}
    </p>
  );
}
