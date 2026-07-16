import Image from "next/image";
import type { ReactNode } from "react";
import { schemes } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

interface HeroProps {
  headline: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Hero({
  headline,
  subtitle,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  iconLeft,
  iconRight,
}: HeroProps) {
  const s = schemes["red"];

  return (
    <section className={`relative overflow-hidden ${s.bg}`}>
      <div className="lg:hidden absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          quality={85}
          sizes="(max-width: 1023px) 100vw, 0px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/80" />
      </div>
      <div
        className="relative hidden lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:block lg:w-[47%]"
        style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          quality={85}
          sizes="(min-width: 1024px) 47vw, 0px"
          priority
        />
      </div>
      <div className="relative z-10 flex min-h-[90vh] items-center px-4 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-32">
        <div className="max-w-xl">
          <Heading as="h1" size="xl" bgScheme="red" className="uppercase mr-12">
            {headline}
          </Heading>
          {subtitle && (
            <Text variant="lg" bgScheme="red" className="mt-4 italic mr-12">
              {subtitle}
            </Text>
          )}
          {ctaLabel && ctaHref && (
            <Button
              href={ctaHref}
              variant="outline"
              bgScheme={s.buttonScheme}
              className="mt-8"
              iconLeft={iconLeft}
              iconRight={iconRight}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
