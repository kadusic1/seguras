"use client";

import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import type { HeroCarouselProps } from "../types";
import { HeroSlide } from "./HeroSlide";

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Fade(),
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      playOnInit: true,
    }),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = (api: EmblaCarouselType) => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <section>
      <div
        className="overflow-hidden h-[90vh] sm:aspect-[2/1] sm:h-auto"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <HeroSlide
              key={slide.image}
              slide={slide}
              isActive={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
