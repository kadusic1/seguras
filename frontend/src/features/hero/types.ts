export interface HeroSlideType {
  image: string;
  mobileImage?: string;
  translationKey: string;
  ctaHref: string;
}

export interface HeroCarouselProps {
  slides: HeroSlideType[];
}
