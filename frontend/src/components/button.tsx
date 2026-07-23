import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  type ButtonVariant,
  buttonVariantStyles,
  type ColorScheme,
} from "@/lib/colours";

type ButtonShared = {
  variant?: ButtonVariant;
  bgScheme?: ColorScheme;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type ButtonAsLink = ButtonShared & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href"
  >;

type ButtonAsButton = ButtonShared &
  Omit<ComponentPropsWithoutRef<"button">, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

const pillBase =
  "inline-flex cursor-pointer items-center justify-center rounded-md px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 sm:px-6 sm:py-3 sm:text-sm";

const variantBaseClass: Record<ButtonVariant, string> = {
  primary: pillBase,
  outline: pillBase,
  link: "inline-flex cursor-pointer items-center gap-1 text-sm font-semibold transition-colors",
};

export function Button({
  variant = "primary",
  bgScheme = "red",
  className,
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const classes = `${variantBaseClass[variant]} ${buttonVariantStyles[variant][bgScheme]}${className ? ` ${className}` : ""}`;
  const content = (
    <>
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  );

  if ("href" in props) {
    return (
      <Link
        className={classes}
        {...(props as ComponentPropsWithoutRef<typeof Link>)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      className={classes}
      {...(props as ComponentPropsWithoutRef<"button">)}
    >
      {content}
    </button>
  );
}
