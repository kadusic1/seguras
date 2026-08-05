"use client";

import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useId, useState } from "react";

export interface CarouselSlide {
  id: string;
  content: React.ReactNode;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  className?: string;
  slideClassName?: string;
}

export function Carousel({
  slides,
  autoplay = true,
  autoplayDelay = 3000,
  showDots = true,
  className,
  slideClassName,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseId = useId();

  const plugins = [];
  if (autoplay) {
    plugins.push(
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: false,
        playOnInit: true,
      }),
    );
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1 },
    plugins,
  );

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCurrentIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <div className={className}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className={slideClassName}>
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      {showDots && slides.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${baseId}-dot-${slide.id}`}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
