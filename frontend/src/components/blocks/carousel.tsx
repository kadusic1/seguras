"use client";

import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

export interface CarouselSlide {
  id: string;
  content: React.ReactNode;
}

const carouselArrowBase =
  "absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-40 hover:cursor-pointer";

type CarouselArrowProps = ComponentPropsWithoutRef<"button">;

export function CarouselPrevArrow(props: CarouselArrowProps) {
  return (
    <button
      type="button"
      aria-label="Previous slide"
      className={`left-3 ${carouselArrowBase}`}
      {...props}
    >
      <ChevronLeft className="size-5" />
    </button>
  );
}

export function CarouselNextArrow(props: CarouselArrowProps) {
  return (
    <button
      type="button"
      aria-label="Next slide"
      className={`right-3 ${carouselArrowBase}`}
      {...props}
    >
      <ChevronRight className="size-5" />
    </button>
  );
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  dotScheme?: "light" | "dark";
  className?: string;
  slideClassName?: string;
}

export function Carousel({
  slides,
  autoplay = true,
  autoplayDelay = 3000,
  showDots = true,
  showArrows = false,
  dotScheme = "light",
  className,
  slideClassName,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const baseId = useId();

  const dotColors =
    dotScheme === "light"
      ? { active: "bg-white", inactive: "bg-white/30" }
      : { active: "bg-black", inactive: "bg-black/30" };

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
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
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
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className={slideClassName}>
              {slide.content}
            </div>
          ))}
        </div>
        {showArrows && slides.length > 1 && (
          <>
            <CarouselPrevArrow
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
            />
            <CarouselNextArrow
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
            />
          </>
        )}
      </div>
      {showDots && slides.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${baseId}-dot-${slide.id}`}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? `w-6 ${dotColors.active}`
                  : `w-2 ${dotColors.inactive}`
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
