import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/card";
import { Carousel } from "@/components/carousel";
import { Grid } from "@/components/grid";
import { Section } from "@/components/section";
import { WaveDivider } from "@/components/wave-divider";
import { HeroCarousel } from "@/features/hero/_components/HeroCarousel";
import { heroSlides } from "@/features/hero/data";
import { jobs } from "@/features/jobs/data";
import { services } from "@/features/services/data";
import { trustedCompanies } from "@/features/trusted-companies/data";

export default function Home() {
  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <WaveDivider fillScheme="red" />
      <Section
        title="Trusted By"
        subtitle="Events and organizations that trust Seguras"
        bgScheme="red"
        animation="slideUp"
      >
        <Carousel
          slideClassName="min-w-0 flex-[0_0_25%]"
          className="mt-12"
          autoplayDelay={2000}
          slides={trustedCompanies.map((c) => ({
            id: c.alt,
            content: (
              <div className="flex flex-col items-center gap-4 px-2">
                <Image
                  src={c.logo}
                  alt={c.alt}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                  className="h-16 w-auto object-contain grayscale sepia-[30%] saturate-[50%]"
                />
              </div>
            ),
          }))}
        />
      </Section>
      <Section
        title="Safety Solutions for the World's Biggest Events"
        subtitle="From sold-out football stadiums to major festivals - professional crowd management and safety for every event."
        bgScheme="white"
        ctaLabel="View All Services"
        ctaHref="/services"
        animation="scaleIn"
      >
        <Grid cols={3}>
          {services.map((s) => (
            <Card key={s.title} {...s} variant="icon" bgScheme="white" />
          ))}
        </Grid>
      </Section>
      <Section
        title="Join Our Team"
        subtitle="Be part of a growing team that keeps events safe and welcoming across the country."
        bgScheme="black"
        ctaLabel="View All Openings"
        ctaHref="/jobs"
        animation="fadeIn"
        image={{
          src: "/hero/hero-1.jpg",
          alt: "Seguras security team member",
          caption: {
            heading: "Grow With Us",
            icon: TrendingUp,
            text: "We're looking for dedicated professionals who take pride in keeping events safe. From stadium security to crowd management, every role makes a real impact. Join a team that values your growth and invests in your future.",
            ctaLabel: "See Open Roles",
            ctaHref: "/jobs",
          },
        }}
        imagePosition="right"
      >
        <Grid cols={1}>
          {jobs.map((j) => (
            <Card key={j.title} {...j} variant="listing" bgScheme="black" />
          ))}
        </Grid>
      </Section>
    </>
  );
}
