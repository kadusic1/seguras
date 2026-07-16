import { ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "@/components/card";
import { Grid } from "@/components/grid";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { services } from "@/features/services/data";

export default function ServicesPage() {
  return (
    <>
      <Hero
        headline="Event Security"
        subtitle="Custom security on any scale. Continuous improvement, complete assurance."
        ctaLabel="Request Proposal"
        ctaHref="/contact"
        imageSrc="/services/hero-services.webp"
        iconRight={<ArrowRight size={16} />}
        imageAlt=""
      />
      <Section
        title="Safety Solutions for Any Event"
        subtitle="From stadiums to festivals - we design security operations around your venue, crowd, and risk profile."
        bgScheme="white"
        animation="fadeIn"
        image={{
          src: "/services/services1.webp",
          alt: "Seguras team at an event",
          caption: {
            heading: "Built for Scale",
            icon: ShieldCheck,
            text: "Whether it's 500 or 50,000 attendees, our approach scales to match. We assess, plan, staff, and monitor every detail so you can focus on running the event.",
            ctaLabel: "Discuss Your Event",
            ctaHref: "/contact",
          },
        }}
        imagePosition="right"
      >
        <Grid cols={1}>
          {services.map((s) => (
            <Card key={s.title} {...s} variant="icon" bgScheme="white" />
          ))}
        </Grid>
      </Section>
      <Section
        title="Every Event is Unique"
        subtitle="Not sure what you need? We'll assess your venue, crowd, and risks - then build a plan around what matters."
        bgScheme="black"
        ctaLabel="Contact Our Team"
        ctaHref="/contact"
        ctaIconRight={<ArrowRight size={16} />}
        animation="slideUp"
      />
      <Section
        title="Latest in Event Security"
        subtitle="Read about our newest services, case studies, and industry insights from the Seguras team."
        bgScheme="white"
        ctaLabel="View All News"
        ctaHref="/news"
        ctaIconRight={<ArrowRight size={16} />}
        animation="scaleIn"
      />
    </>
  );
}
