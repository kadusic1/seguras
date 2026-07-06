import type { ReactNode } from "react";
import {
  type ColorScheme,
  schemeToButtonVariant,
  sectionBgColourMap,
  sectionTextSchemeMap,
} from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Lead } from "./lead";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  colorScheme?: ColorScheme;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function Section({
  title,
  subtitle,
  children,
  colorScheme = "red",
  ctaLabel,
  ctaHref,
  className,
}: SectionProps) {
  const textScheme = sectionTextSchemeMap[colorScheme];
  return (
    <section
      className={`py-24 sm:py-32 ${sectionBgColourMap[colorScheme]}${className ? ` ${className}` : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mx-auto max-w-3xl text-center">
            {title && <Heading color={textScheme}>{title}</Heading>}
            {subtitle && (
              <Lead color={textScheme} className="mt-4">
                {subtitle}
              </Lead>
            )}
          </div>
        )}
        {children}
        {ctaLabel && ctaHref && (
          <div className="mt-12 text-center">
            <Button href={ctaHref} variant={schemeToButtonVariant[colorScheme]}>
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
