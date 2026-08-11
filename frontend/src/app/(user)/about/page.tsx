import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, Hero, Section } from "@/components/blocks";
import { Grid, Heading, Text, WaveDivider } from "@/components/ui";
import { missionValues } from "@/features/mission-values/data";
import { trustedCompanies } from "@/features/trusted-companies/data";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <>
      <Hero
        headline={t("hero.headline")}
        subtitle={t("hero.subtitle")}
        ctaLabel={t("hero.ctaLabel")}
        ctaHref="/contact"
        imageSrc="/about/about1.webp"
        iconRight={<ArrowRight size={16} />}
        imageAlt=""
      />
      <Section
        title={t("mission.title")}
        subtitle={t("mission.subtitle")}
        bgScheme="white"
        animation="slideUp"
      >
        <Grid cols={3}>
          {missionValues.map((mv) => (
            <Card
              key={mv.titleKey}
              title={t(mv.titleKey)}
              description={t(mv.descriptionKey)}
              {...mv}
              variant="icon"
              bgScheme="white"
            />
          ))}
        </Grid>
      </Section>
      <Section
        title={t("meet.title")}
        bgScheme="black"
        animation="zoomIn"
        image={{
          src: "/about/about2.webp",
          alt: "Adis Isakovic, CEO of Seguras",
          caption: {
            heading: t("meet.caption.heading"),
            icon: User,
            text: t("meet.caption.text"),
            ctaLabel: t("meet.caption.ctaLabel"),
            ctaHref: "/jobs",
          },
        }}
        imagePosition="right"
      >
        <Heading
          as="h2"
          size="lg"
          bgScheme="black"
          className="mt-4 mb-6 text-center"
        >
          {t("meet.heading")}
        </Heading>
        <Text
          variant="lg"
          bgScheme="black"
          className="text-justify leading-relaxed"
        >
          {t("ceoMessage")}
        </Text>
      </Section>
      <WaveDivider fillScheme="red" />
      <Section
        title={t("trusted.title")}
        subtitle={t("trusted.subtitle")}
        bgScheme="red"
        ctaLabel={t("trusted.ctaLabel")}
        ctaHref="/contact"
        ctaIconRight={<ArrowRight size={16} />}
        animation="slideUp"
      >
        <Grid cols={3}>
          {trustedCompanies.map((c, i) => (
            <div
              key={c.alt}
              className={`flex items-center justify-center p-12${i === trustedCompanies.length - 1 ? " md:col-start-2" : ""}`}
            >
              <Image
                src={c.logo}
                alt={c.alt}
                width={0}
                height={0}
                sizes="(max-width: 768px) 50vw, 20vw"
                unoptimized
                className="h-16 w-auto object-contain grayscale sepia-[30%] saturate-[50%]"
              />
            </div>
          ))}
        </Grid>
      </Section>
    </>
  );
}
