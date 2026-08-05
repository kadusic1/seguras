"use client";

import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Card, Hero, Section } from "@/components/blocks";
import { Form, FormField } from "@/components/form";
import { ModalForm, SuccessMessage } from "@/components/overlay";
import { Grid, Text } from "@/components/ui";
import { PLACEHOLDER } from "@/lib/placeholders";
import { maxLength, validPhone } from "@/lib/validators";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

const contactDetails = [
  {
    icon: Phone,
    title: "Phone",
    label: "+31 6 409 891 52",
  },
  {
    icon: Mail,
    title: "Email",
    label: "segurasservicediensten@gmail.com",
  },
  {
    icon: MapPin,
    title: "Address",
    label: "Westhoven 7, Roermond",
  },
];

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        setSubmitError(err.error ?? "Failed to send message");
        return;
      }

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    }
  };

  const openModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Hero
        headline="Let's Talk"
        subtitle="Have a question or want to work together? We'd love to hear from you."
        ctaLabel="Send Us a Message"
        onCtaClick={() =>
          document
            .getElementById("contact-info")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        imageSrc="/contact/contact-hero.webp"
        imageAlt="Seguras team"
        iconRight={<ArrowRight size={16} />}
      />

      <Section
        id="contact-info"
        title="Get in Touch"
        subtitle="Reach out anytime. Click any card to open our contact form."
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
              buttonLabel="Contact Us"
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
        heading="Contact Seguras"
        text="Fill in your details and we will be in touch."
      >
        <Form<ContactFormData>
          key={String(isModalOpen)}
          header="Send Us a Message"
          subtitle="We'll get back to you as soon as possible."
          bgScheme="white"
          submitLabel="Send Message"
          onSubmit={handleSubmit}
        >
          <FormField
            name="firstName"
            label="First Name"
            type="text"
            placeholder={PLACEHOLDER.firstName}
            rules={{ required: true, validate: maxLength(100, "First name") }}
          />
          <FormField
            name="lastName"
            label="Last Name"
            type="text"
            placeholder={PLACEHOLDER.lastName}
            rules={{ required: true, validate: maxLength(100, "Last name") }}
          />
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder={PLACEHOLDER.email}
            rules={{ required: true }}
          />
          <FormField
            name="phone"
            label="Phone"
            type="tel"
            placeholder={PLACEHOLDER.phone}
            rules={{ required: true, validate: validPhone() }}
          />
          <FormField
            name="company"
            label="Company"
            type="text"
            placeholder={PLACEHOLDER.company}
          />
          <FormField
            name="message"
            label="Message"
            type="textarea"
            rows={8}
            placeholder={PLACEHOLDER.message}
            rules={{ required: true, validate: maxLength(2000, "Message") }}
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
        title="Message Sent"
        description="We have received your message and will get back to you soon."
      />
    </>
  );
}
