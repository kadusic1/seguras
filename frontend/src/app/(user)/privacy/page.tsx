import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Section } from "@/components/blocks";
import { Heading, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | Seguras Security",
  description:
    "How Seguras Security collects, uses, and protects your personal data.",
};

const sectionKeys = [
  "who",
  "collected",
  "why",
  "retention",
  "sharing",
  "cookies",
  "rights",
  "changes",
] as const;

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <Section bgScheme="white" className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Heading as="h1" size="lg" bgScheme="white" className="mb-2">
          {t("title")}
        </Heading>
        <Text variant="sm" bgScheme="white" className="mb-10">
          {t("lastUpdated")}
        </Text>

        <div className="space-y-8">
          {sectionKeys.map((key) => (
            <div key={key}>
              <Heading as="h2" size="sm" bgScheme="white" className="mb-2">
                {t(`sections.${key}.title`)}
              </Heading>
              <Text variant="base" bgScheme="white">
                {t(`sections.${key}.body`)}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
