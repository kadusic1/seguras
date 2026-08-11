import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, Carousel, Section } from "@/components/blocks";
import { Grid } from "@/components/ui";
import { HeroCarousel } from "@/features/hero/_components/HeroCarousel";
import { heroSlides } from "@/features/hero/data";
import { jobs } from "@/features/jobs/data";
import { services } from "@/features/services/data";
import { trustedCompanies } from "@/features/trusted-companies/data";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      {/* <WaveDivider fillScheme="red" /> */}
      <Section
        title={t("trusted.title")}
        subtitle={t("trusted.subtitle")}
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
        title={t("services.title")}
        subtitle={t("services.subtitle")}
        bgScheme="white"
        ctaLabel={t("services.cta")}
        ctaHref="/services"
        animation="zoomIn"
      >
        <Grid cols={3}>
          {services.map((s) => (
            <Card
              key={s.titleKey}
              title={t(s.titleKey)}
              description={t(s.descriptionKey)}
              {...s}
              variant="icon"
              bgScheme="white"
            />
          ))}
        </Grid>
      </Section>
      <Section
        title={t("jobs.title")}
        subtitle={t("jobs.subtitle")}
        bgScheme="black"
        ctaLabel={t("jobs.cta")}
        ctaHref="/jobs"
        animation="slideUp"
        image={{
          src: "/hero/hero-1.webp",
          alt: "Seguras security team member",
          caption: {
            heading: t("jobs.banner.title"),
            icon: TrendingUp,
            text: t("jobs.banner.text"),
            ctaLabel: t("jobs.banner.cta"),
            ctaHref: "/jobs",
          },
        }}
        imagePosition="right"
      >
        <Grid cols={1}>
          {jobs.map((j) => (
            <Card
              key={j.titleKey}
              title={t(j.titleKey)}
              description={t(j.descriptionKey)}
              {...j}
              variant="listing"
              bgScheme="black"
            />
          ))}
        </Grid>
      </Section>
    </>
  );
}
