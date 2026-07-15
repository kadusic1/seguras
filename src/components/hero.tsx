import Image from "next/image";
import { type ColorScheme, schemes } from "@/lib/colours";
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
  bgScheme?: ColorScheme;
}

export function Hero({
  headline,
  subtitle,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  bgScheme = "red",
}: HeroProps) {
  const s = schemes[bgScheme];

  return (
    <section className={`relative overflow-hidden ${s.bg}`}>
      <div
        className="relative hidden md:absolute md:inset-0 md:block"
        style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          quality={85}
          sizes="(min-width: 768px) 55vw, 0px"
          priority
        />
      </div>
      <div className="relative z-10 flex min-h-[50vh] items-center px-4 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-32">
        <div className="max-w-xl">
          <Heading as="h1" size="xl" bgScheme={bgScheme} className="uppercase">
            {headline}
          </Heading>
          {subtitle && (
            <Text variant="lg" bgScheme={bgScheme} className="mt-4 italic">
              {subtitle}
            </Text>
          )}
          {ctaLabel && ctaHref && (
            <Button
              href={ctaHref}
              variant="outline"
              bgScheme={s.buttonScheme}
              className="mt-8"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
