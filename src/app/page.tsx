import { Grid } from "@/components/grid";
import { IconCard } from "@/components/icon-card";
import { Section } from "@/components/section";
import { HeroCarousel } from "@/features/hero/_components/HeroCarousel";
import { heroSlides } from "@/features/hero/data";
import { services } from "@/features/services/data";

export default function Home() {
  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <Section
        title="Safety Solutions for the World's Biggest Events"
        subtitle="From sold-out football stadiums to major festivals - professional crowd management and safety for every event."
        colorScheme="white"
        ctaLabel="View All Services"
        ctaHref="/services"
      >
        <Grid cols={3}>
          {services.map((s) => (
            <IconCard key={s.title} {...s} colorScheme="white" />
          ))}
        </Grid>
      </Section>
    </>
  );
}
