import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "a" | "b";

interface ButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  a: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  b: "border border-red-600 text-red-500 hover:bg-red-600/10",
};

const baseClass =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 sm:px-6 sm:py-3 sm:text-sm";

export function Button({
  variant = "a",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`${baseClass} ${variantStyles[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Link>
  );
}
