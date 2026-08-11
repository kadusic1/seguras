"use client";

import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, Hero, Section } from "@/components/blocks";
import { Form, FormField } from "@/components/form";
import { ModalForm, SuccessMessage } from "@/components/overlay";
import { Grid, Text } from "@/components/ui";
import { CONTACT } from "@/lib/contact";
import { maxLength, validPhone } from "@/lib/validators";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tPlaceholders = useTranslations("Placeholders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contactDetails = [
    { icon: Phone, title: t("details.card_1.title"), label: CONTACT.phone },
    { icon: Mail, title: t("details.card_2.title"), label: CONTACT.email },
    { icon: MapPin, title: t("details.card_3.title"), label: CONTACT.address },
  ];

  const handleSubmit = async (data: ContactFormData) => {
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          message: data.message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error ?? t("errors.submitFailed"));
        return;
      }

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch {
      setSubmitError(t("errors.connectionError"));
    }
  };

  const openModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Hero
        headline={t("hero.headline")}
        subtitle={t("hero.subtitle")}
        ctaLabel={t("hero.ctaLabel")}
        onCtaClick={openModal}
        imageSrc="/contact/contact-hero.webp"
        imageAlt="Seguras team"
        iconRight={<ArrowRight size={16} />}
      />

      <Section
        title={t("section.title")}
        subtitle={t("section.subtitle")}
        bgScheme="white"
        animation="zoomIn"
      >
        <Grid cols={3}>
          {contactDetails.map((item) => (
            <Card
              key={item.title}
              variant="icon"
              heroIcon={item.icon}
              title={item.title}
              description={item.label}
              buttonLabel={t("cardButtonLabel")}
              onClick={openModal}
              bgScheme="white"
              ctaVariant="primary"
              ctaCentered
            />
          ))}
        </Grid>
      </Section>

      <ModalForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        heading={t("modal.heading")}
        text={t("modal.text")}
      >
        <Form<ContactFormData>
          key={String(isModalOpen)}
          header={t("form.header")}
          subtitle={t("form.subtitle")}
          bgScheme="white"
          submitLabel={t("form.submitLabel")}
          onSubmit={handleSubmit}
        >
          <FormField
            name="firstName"
            label={t("form.firstNameLabel")}
            type="text"
            placeholder={tPlaceholders("firstName")}
            rules={{
              required: true,
              validate: maxLength(100, t("validation.firstName")),
            }}
          />
          <FormField
            name="lastName"
            label={t("form.lastNameLabel")}
            type="text"
            placeholder={tPlaceholders("lastName")}
            rules={{
              required: true,
              validate: maxLength(100, t("validation.lastName")),
            }}
          />
          <FormField
            name="email"
            label={t("form.emailLabel")}
            type="email"
            placeholder={tPlaceholders("email")}
            rules={{ required: true }}
          />
          <FormField
            name="phone"
            label={t("form.phoneLabel")}
            type="tel"
            placeholder={tPlaceholders("phone")}
            rules={{
              required: true,
              validate: validPhone(t("validation.phone")),
            }}
          />
          <FormField
            name="company"
            label={t("form.companyLabel")}
            type="text"
            placeholder={tPlaceholders("company")}
          />
          <FormField
            name="message"
            label={t("form.messageLabel")}
            type="textarea"
            rows={8}
            placeholder={tPlaceholders("message")}
            rules={{
              required: true,
              validate: maxLength(2000, t("validation.message")),
            }}
          />

          {submitError && (
            <Text
              variant="sm"
              bgScheme="white"
              className="text-red-500 lowercase first-letter:uppercase"
            >
              {submitError}
            </Text>
          )}
        </Form>
      </ModalForm>

      <SuccessMessage
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title={t("success.title")}
        description={t("success.description")}
      />
    </>
  );
}
