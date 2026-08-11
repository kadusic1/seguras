"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Common");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-black/40 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-black hover:cursor-pointer"} ${className}`}
      aria-label={t("actions.close")}
    >
      <X size={24} />
    </button>
  );
}
