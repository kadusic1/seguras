import "server-only";

import type { HeroSlideType } from "./types";

export const heroSlides: HeroSlideType[] = [
  {
    image: "/hero/hero-1.webp",
    mobileImage: "/hero/hero-1-mobile.webp",
    translationKey: "carousel_1",
    ctaHref: "/contact",
  },
  {
    image: "/hero/hero-2.webp",
    mobileImage: "/hero/hero-2-mobile.webp",
    translationKey: "carousel_2",
    ctaHref: "/contact",
  },
  {
    image: "/hero/hero-3.webp",
    mobileImage: "/hero/hero-3-mobile.webp",
    translationKey: "carousel_3",
    ctaHref: "/services",
  },
  {
    image: "/hero/hero-4.webp",
    mobileImage: "/hero/hero-4-mobile.webp",
    translationKey: "carousel_4",
    ctaHref: "/services",
  },
];
