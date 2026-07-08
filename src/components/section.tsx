import Image from "next/image";
import type { ReactNode } from "react";
import {
  type ColorScheme,
  schemeToButtonColorScheme,
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
  image?: { src: string; alt: string };
  imagePosition?: "left" | "right" | "background";
}

export function Section({
  title,
  subtitle,
  children,
  colorScheme = "red",
  ctaLabel,
  ctaHref,
  className,
  image,
  imagePosition = "right",
}: SectionProps) {
  const textScheme = sectionTextSchemeMap[colorScheme];

  const renderContent = (textColor: ColorScheme) => (
    <>
      {(title || subtitle) && (
        <div className="mx-auto max-w-3xl text-center">
          {title && <Heading color={textColor}>{title}</Heading>}
          {subtitle && (
            <Lead color={textColor} className="mt-4">
              {subtitle}
            </Lead>
          )}
        </div>
      )}
      {children}
      {ctaLabel && ctaHref && (
        <div className="mt-12 text-center">
          <Button
            href={ctaHref}
            variant="primary"
            colorScheme={schemeToButtonColorScheme[colorScheme]}
          >
            {ctaLabel}
          </Button>
        </div>
      )}
    </>
  );

  if (image && imagePosition === "background") {
    return (
      <section
        className={`relative overflow-hidden py-24 sm:py-32${className ? ` ${className}` : ""}`}
      >
        <div className="absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {renderContent("white")}
        </div>
      </section>
    );
  }

  if (image) {
    return (
      <section
        className={`py-24 sm:py-32 ${sectionBgColourMap[colorScheme]}${className ? ` ${className}` : ""}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16${imagePosition === "left" ? " md:flex-row-reverse" : ""}`}
          >
            <div className="flex-1">{renderContent(textScheme)}</div>
            <div className="mt-8 md:mt-0 md:w-[45%] md:flex-shrink-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-24 sm:py-32 ${sectionBgColourMap[colorScheme]}${className ? ` ${className}` : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {renderContent(textScheme)}
      </div>
    </section>
  );
}
