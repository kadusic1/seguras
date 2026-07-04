import { HeroCarousel } from "@/features/hero/_components/HeroCarousel";
import { heroSlides } from "@/features/hero/data";

export default function Home() {
  return <HeroCarousel slides={heroSlides} />;
}
