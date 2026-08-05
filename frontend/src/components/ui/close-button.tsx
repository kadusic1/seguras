"use client";

import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function CloseButton({
  onClick,
  disabled = false,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-black/40 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-black hover:cursor-pointer"} ${className}`}
      aria-label="Close"
    >
      <X size={24} />
    </button>
  );
}
