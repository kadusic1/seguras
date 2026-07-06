import { GridSection } from "@/components/grid-section";
import { IconCard } from "@/components/icon-card";
import { HeroCarousel } from "@/features/hero/_components/HeroCarousel";
import { heroSlides } from "@/features/hero/data";
import { services } from "@/features/services/data";

export default function Home() {
  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <GridSection
        title="Safety Solutions for the World's Biggest Events"
        subtitle="From sold-out football stadiums to major festivals - professional crowd management and safety for every event."
        colorScheme="white"
        ctaLabel="View All Services"
        ctaHref="/services"
      >
        {services.map((s) => (
          <IconCard key={s.title} {...s} colorScheme="white" />
        ))}
      </GridSection>
    </>
  );
}
