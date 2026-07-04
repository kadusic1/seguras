export interface HeroSlideType {
  image: string;
  mobileImage?: string;
  headline: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

export interface HeroCarouselProps {
  slides: HeroSlideType[];
}
