import Image from "next/image";
import type { ReactNode } from "react";
import { type ColorScheme, schemes } from "@/lib/colours";
import { Button } from "./button";
import { CaptionedImage, type CaptionedImageCaption } from "./captioned-image";
import { Heading } from "./heading";
import { Reveal, type RevealAnimation } from "./reveal";
import { Text } from "./text";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  bgScheme?: ColorScheme;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  image?: { src: string; alt: string; caption?: CaptionedImageCaption };
  imagePosition?: "left" | "right" | "background";
  animation?: RevealAnimation;
}

export function Section({
  title,
  subtitle,
  children,
  bgScheme = "red",
  ctaLabel,
  ctaHref,
  className,
  image,
  imagePosition = "right",
  animation,
}: SectionProps) {
  const s = schemes[bgScheme];

  const content = (
    <>
      {(title || subtitle) && (
        <div className="mx-auto max-w-3xl text-center">
          {title && <Heading bgScheme={bgScheme}>{title}</Heading>}
          {subtitle && (
            <Text variant="lg" bgScheme={bgScheme} className="mt-4">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      {children}
      {ctaLabel && ctaHref && (
        <div className="mt-12 text-center">
          <Button href={ctaHref} variant="primary" bgScheme={s.buttonScheme}>
            {ctaLabel}
          </Button>
        </div>
      )}
    </>
  );

  const animatedContent = animation ? (
    <Reveal animation={animation}>{content}</Reveal>
  ) : (
    content
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
          {animatedContent}
        </div>
      </section>
    );
  }

  if (image) {
    return (
      <section
        className={`py-24 sm:py-32 ${s.bg}${className ? ` ${className}` : ""}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16${imagePosition === "left" ? " md:flex-row-reverse" : ""}`}
          >
            <div className="flex-1">{animatedContent}</div>
            <div className="mt-8 md:mt-0 md:w-[45%] md:flex-shrink-0">
              <CaptionedImage
                src={image.src}
                alt={image.alt}
                caption={image.caption}
                bgScheme={bgScheme}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-24 sm:py-32 ${s.bg}${className ? ` ${className}` : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {animatedContent}
      </div>
    </section>
  );
}
