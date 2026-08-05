"use client";

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Spinner({
  size = 20,
  className = "",
  label = "Loading",
}: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`}
      aria-label={label}
    />
  );
}
