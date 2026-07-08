import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  type ButtonVariant,
  buttonVariantStyles,
  type ColorScheme,
} from "@/lib/colours";

interface ButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
  colorScheme?: ColorScheme;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const pillBase =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 sm:px-6 sm:py-3 sm:text-sm";

const variantBaseClass: Record<ButtonVariant, string> = {
  primary: pillBase,
  outline: pillBase,
  link: "inline-flex items-center gap-1 text-sm font-semibold transition-colors",
};

export function Button({
  variant = "primary",
  colorScheme = "red",
  className,
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`${variantBaseClass[variant]} ${buttonVariantStyles[variant][colorScheme]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </Link>
  );
}
