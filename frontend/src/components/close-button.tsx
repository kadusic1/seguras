"use client";

import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-black/40 transition-colors hover:text-black hover:cursor-pointer ${className}`}
      aria-label="Close"
    >
      <X size={24} />
    </button>
  );
}
