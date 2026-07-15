import "server-only";

import type { HeroSlideType } from "./types";

export const heroSlides: HeroSlideType[] = [
  {
    image: "/hero/hero-1.webp",
    mobileImage: "/hero/hero-1-mobile.webp",
    headline: "Security You Can Trust",
    subtitle: "Professional protection for your business, events, and assets.",
    cta: "Get Protected",
    ctaHref: "/contact",
  },
  {
    image: "/hero/hero-2.webp",
    mobileImage: "/hero/hero-2-mobile.webp",
    headline: "24/7 Monitoring & Response",
    subtitle:
      "Real-time surveillance, instant action. Your safety never sleeps.",
    cta: "Get Protected",
    ctaHref: "/contact",
  },
  {
    image: "/hero/hero-3.webp",
    mobileImage: "/hero/hero-3-mobile.webp",
    headline: "Elite Event Security",
    subtitle: "From corporate gatherings to large-scale public events.",
    cta: "Our Services",
    ctaHref: "/services",
  },
  {
    image: "/hero/hero-4.webp",
    mobileImage: "/hero/hero-4-mobile.webp",
    headline: "Tailored Security Solutions",
    subtitle: "Every client is unique. So is our approach.",
    cta: "Our Services",
    ctaHref: "/services",
  },
];
