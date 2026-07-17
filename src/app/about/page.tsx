import {
  ArrowRight,
  Award,
  HeartHandshake,
  Lightbulb,
  Shield,
  Target,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/card";
import { Grid } from "@/components/grid";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Text } from "@/components/text";
import { WaveDivider } from "@/components/wave-divider";
import { trustedCompanies } from "@/features/trusted-companies/data";

const missionValues = [
  {
    heroIcon: Shield,
    title: "Safety First",
    description:
      "Professional security is the foundation of every event we work on. Proactive, visible, and reliable.",
    href: "/contact",
  },
  {
    heroIcon: Users,
    title: "Expertise & Training",
    description:
      "Licensed stewards and certified security officers who know how to read a crowd and respond with precision.",
    href: "/contact",
  },
  {
    heroIcon: Target,
    title: "Tailored Solutions",
    description:
      "Every venue, crowd, and event is different. We design security around what you actually need.",
    href: "/contact",
  },
  {
    heroIcon: Lightbulb,
    title: "Innovation",
    description:
      "Smart planning, modern technology, and data-driven risk assessments that stay ahead of the curve.",
    href: "/contact",
  },
  {
    heroIcon: HeartHandshake,
    title: "Integrity & Trust",
    description:
      "Honest, transparent partnerships with the organisers who put their faith in us.",
    href: "/contact",
  },
  {
    heroIcon: Award,
    title: "Community Focus",
    description:
      "We protect the events that bring people together. From local festivals to national landmarks.",
    href: "/contact",
  },
];

const ceoMessage =
  "I founded Seguras on a simple belief. Safety should be woven into the event experience itself. Every event we protect is a partnership built on trust, precision, and an unwavering commitment to keeping people safe. We take the time to understand each venue, each crowd, and each unique challenge so that safety never feels like an afterthought.";

export default function AboutPage() {
  return (
    <>
      <Hero
        headline="About Seguras"
        subtitle="Professional event security built on trust, expertise, and a passion for keeping people safe."
        ctaLabel="Contact Us"
        ctaHref="/contact"
        imageSrc="/about/about1.webp"
        iconRight={<ArrowRight size={16} />}
        imageAlt=""
      />
      <Section
        title="Our Mission & Values"
        subtitle="Six principles that guide every decision we make and every event we protect."
        bgScheme="white"
        animation="fadeIn"
      >
        <Grid cols={3}>
          {missionValues.map((mv) => (
            <Card key={mv.title} {...mv} variant="icon" bgScheme="white" />
          ))}
        </Grid>
      </Section>
      <Section
        title="Meet Adis"
        bgScheme="black"
        animation="slideUp"
        image={{
          src: "/about/about2.webp",
          alt: "Adis Isakovic, CEO of Seguras",
          caption: {
            heading: "Built on Trust",
            icon: User,
            text: "Make an impact at every event. We invest in your growth with real training and real responsibility.",
            ctaLabel: "See Open Roles",
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
          Founder & CEO
        </Heading>
        <Text
          variant="lg"
          bgScheme="black"
          className="text-justify leading-relaxed"
        >
          {ceoMessage}
        </Text>
      </Section>
      <WaveDivider fillScheme="red" />
      <Section
        title="Trusted By"
        subtitle="Events and organizations that trust Seguras. With certified professionals and years of experience, we earn trust through proven results."
        bgScheme="red"
        ctaLabel="Contact Us"
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
