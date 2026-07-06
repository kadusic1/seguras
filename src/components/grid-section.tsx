import type { ReactNode } from "react";
import type { ColorScheme } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Lead } from "./lead";

interface GridSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  colorScheme?: ColorScheme;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const bgColourMap: Record<ColorScheme, string> = {
  red: "bg-white",
  black: "bg-black",
  white: "bg-white",
};

const textColourMap: Record<ColorScheme, "white" | "black"> = {
  red: "black",
  black: "white",
  white: "black",
};

const buttonVariantMap: Record<ColorScheme, "a" | "c" | "d"> = {
  red: "a",
  black: "a",
  white: "c",
};

export function GridSection({
  title,
  subtitle,
  children,
  colorScheme = "red",
  ctaLabel,
  ctaHref,
  className,
}: GridSectionProps) {
  return (
    <section
      className={`py-24 sm:py-32 ${bgColourMap[colorScheme]}${className ? ` ${className}` : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Heading color={textColourMap[colorScheme]}>{title}</Heading>
          {subtitle && (
            <Lead color={textColourMap[colorScheme]} className="mt-4">
              {subtitle}
            </Lead>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {children}
        </div>
        {ctaLabel && ctaHref && (
          <div className="mt-12 text-center">
            <Button href={ctaHref} variant={buttonVariantMap[colorScheme]}>
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
