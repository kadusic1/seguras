"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import type { HeroSlideType } from "../types";

interface HeroSlideProps {
  slide: HeroSlideType;
  isActive: boolean;
}

const fadeIn = (active: boolean, delay?: string) =>
  !active
    ? "opacity-0 translate-y-3"
    : `opacity-100 translate-y-0 transition-all duration-500 ease-out${delay ? ` delay-[${delay}]` : ""}`;

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const zoom = isActive && mounted ? "scale-110" : "scale-100";
  const imgClasses =
    "object-cover transition-transform duration-[10s] ease-out";

  return (
    <div className="relative overflow-hidden min-w-0 flex-[0_0_100%]">
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt=""
          fill
          sizes="(min-width: 640px) 100vw, 0px"
          quality={85}
          priority={isActive}
          className={`${imgClasses} hidden sm:block ${zoom}`}
        />
        {slide.mobileImage && (
          <Image
            src={slide.mobileImage}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, 0px"
            quality={85}
            priority={isActive}
            className={`${imgClasses} sm:hidden ${zoom}`}
          />
        )}
      </div>
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,38,38,0.045) 0%, transparent 50%), linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full items-center sm:items-end p-4 sm:p-10 lg:p-36">
        <div className="max-w-2xl">
          <h2
            className={`text-3xl font-black italic leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${fadeIn(isActive)}`}
          >
            {slide.headline}
          </h2>
          <p
            className={`mt-2 max-w-lg text-base tracking-wide text-white/80 md:text-lg lg:text-xl ${fadeIn(isActive, "0.15s")}`}
          >
            {slide.subtitle}
          </p>
          <div
            className={`mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-4 ${fadeIn(isActive, "0.3s")}`}
          >
            <Button href={slide.ctaHref} variant="a">
              {slide.cta}
            </Button>
            <Button href={slide.ctaHref} variant="b">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
