import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, Hero, Section } from "@/components/blocks";
import { Grid, WaveDivider } from "@/components/ui";
import { services } from "@/features/services/data";

export default function ServicesPage() {
  const tHome = useTranslations("Home");
  const tServices = useTranslations("Services");

  return (
    <>
      <Hero
        headline={tServices("hero.headline")}
        subtitle={tServices("hero.subtitle")}
        ctaLabel={tServices("hero.ctaLabel")}
        ctaHref="/contact"
        imageSrc="/services/hero-services.webp"
        iconRight={<ArrowRight size={16} />}
        imageAlt=""
      />
      <Section
        title={tServices("intro.title")}
        subtitle={tServices("intro.subtitle")}
        bgScheme="white"
        animation="slideUp"
        image={{
          src: "/services/services1.webp",
          alt: "Seguras team at an event",
          caption: {
            heading: tServices("intro.caption.heading"),
            icon: ShieldCheck,
            text: tServices("intro.caption.text"),
            ctaLabel: tServices("intro.caption.ctaLabel"),
            ctaHref: "/contact",
          },
        }}
        imagePosition="right"
      >
        <Grid cols={1}>
          {services.map((s) => (
            <Card
              key={s.titleKey}
              title={tHome(s.titleKey)}
              description={tHome(s.descriptionKey)}
              {...s}
              variant="icon"
              bgScheme="white"
            />
          ))}
        </Grid>
      </Section>
      <Section
        title={tServices("unique.title")}
        subtitle={tServices("unique.subtitle")}
        bgScheme="black"
        ctaLabel={tServices("unique.ctaLabel")}
        ctaHref="/contact"
        ctaIconRight={<ArrowRight size={16} />}
        animation="zoomOut"
      />
      <WaveDivider fillScheme="white" />
      <Section
        title={tServices("news.title")}
        subtitle={tServices("news.subtitle")}
        bgScheme="white"
        ctaLabel={tServices("news.ctaLabel")}
        ctaHref="/news"
        ctaIconRight={<ArrowRight size={16} />}
        animation="zoomIn"
      />
    </>
  );
}
