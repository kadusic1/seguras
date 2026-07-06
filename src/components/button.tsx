import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type ButtonVariant, buttonVariantStyles } from "@/lib/colours";

interface ButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const baseClass =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 sm:px-6 sm:py-3 sm:text-sm";

export function Button({
  variant = "a",
  className,
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`${baseClass} ${buttonVariantStyles[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </Link>
  );
}
