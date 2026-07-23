"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/card";
import {
  Form,
  FormField,
  RadioGroupField,
  SelectField,
} from "@/components/form";
import { Grid } from "@/components/grid";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { ModalForm } from "@/components/modal-form";
import { Section } from "@/components/section";
import { SuccessMessage } from "@/components/success-message";
import { Text } from "@/components/text";
import { jobs } from "@/features/jobs/data";

interface JobApplicationForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bsn: string;
  address: string;
  email: string;
  phone: string;
  bankAccount: string;
  hoursAvailable: number;
  clothingSize: string;
  employmentType: string;
}

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"security" | "service">(
    "security",
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const openModal = (type: "security" | "service") => {
    setSelectedType(type);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: JobApplicationForm) => {
    setSubmitError(null);

    const body = {
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      bsn: data.bsn,
      address: data.address,
      email: data.email,
      phone: data.phone,
      bank_account: data.bankAccount,
      hours_available: data.hoursAvailable,
      clothing_size: data.clothingSize,
      employment_type: data.employmentType,
    };

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error ?? "Failed to submit application");
        return;
      }

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    }
  };

  return (
    <>
      <Hero
        headline="Work at Seguras"
        subtitle="Want to join the team? Get in touch or browse our open positions below."
        ctaLabel="Contact Us"
        ctaHref="/contact"
        imageSrc="/jobs/jobs-hero.webp"
        imageAlt="Seguras team"
        iconRight={<ArrowRight size={16} />}
      />

      <Section title="Open Positions" bgScheme="black" animation="fadeIn">
        <Grid cols={2}>
          {jobs.map((j) => (
            <Card
              key={j.title}
              icon={j.icon}
              title={j.title}
              description={j.description}
              badge={j.badge}
              variant="listing"
              bgScheme="black"
              buttonLabel="Apply Now"
              onClick={() =>
                openModal(j.badge?.toLowerCase() as "security" | "service")
              }
            />
          ))}
        </Grid>
      </Section>

      <ModalForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        heading="Apply to Seguras"
        text="Fill in your details and we will be in touch."
      >
        <Form<JobApplicationForm>
          key={selectedType}
          header="Your Application"
          bgScheme="white"
          submitLabel="Submit Application"
          defaultValues={{ employmentType: selectedType }}
          onSubmit={handleSubmit}
        >
          <Heading as="h3" size="sm" bgScheme="white">
            Job Type
          </Heading>
          <Text variant="sm" bgScheme="white" className="mb-2">
            Note: Service positions require no prior exam. Security positions
            require a passed ESO (Event Security Officer) exam.
          </Text>
          <RadioGroupField
            name="employmentType"
            label="Position"
            options={[
              { label: "Security Officer", value: "security" },
              { label: "Service Host", value: "service" },
            ]}
            columns={2}
            rules={{ required: "Select a position" }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Personal Details
          </Heading>
          <FormField
            name="firstName"
            label="First Name"
            type="text"
            rules={{ required: true }}
          />
          <FormField
            name="lastName"
            label="Last Name"
            type="text"
            rules={{ required: true }}
          />
          <FormField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            rules={{ required: true }}
          />
          <FormField
            name="bsn"
            label="BSN"
            type="text"
            placeholder="Dutch national ID"
            rules={{ required: true }}
          />
          <FormField
            name="address"
            label="Address"
            type="text"
            rules={{ required: true }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Contact
          </Heading>
          <FormField
            name="email"
            label="Email"
            type="email"
            rules={{ required: true }}
          />
          <FormField
            name="phone"
            label="Phone"
            type="tel"
            rules={{ required: true }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Availability
          </Heading>
          <FormField
            name="hoursAvailable"
            label="Hours Available per Week"
            type="number"
            rules={{ required: true, valueAsNumber: true }}
          />
          <SelectField
            name="clothingSize"
            label="Clothing Size"
            options={[
              { label: "S", value: "S" },
              { label: "M", value: "M" },
              { label: "L", value: "L" },
              { label: "XL", value: "XL" },
              { label: "2XL", value: "2XL" },
            ]}
            rules={{ required: "Select your size" }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Bank Details
          </Heading>
          <FormField
            name="bankAccount"
            label="Bank Account (IBAN)"
            type="text"
            rules={{ required: true }}
          />

          {submitError && (
            <Text variant="sm" bgScheme="white" className="text-red-500">
              {submitError}
            </Text>
          )}

          <Text variant="sm" bgScheme="white" className="text-center">
            Need more information?{" "}
            <a href="/contact" className="underline hover:text-red-600">
              Contact us
            </a>
            , call{" "}
            <a href="tel:+31640989152" className="underline hover:text-red-600">
              +31 6 409 891 52
            </a>{" "}
            or email{" "}
            <a
              href="mailto:segurasservicediensten@gmail.com"
              className="underline hover:text-red-600"
            >
              segurasservicediensten@gmail.com
            </a>
          </Text>
        </Form>
      </ModalForm>

      <SuccessMessage open={showSuccess} onOpenChange={setShowSuccess} />

      <Section bgScheme="white" animation="fadeIn">
        <div className="mx-auto max-w-3xl text-center">
          <Heading bgScheme="white">Work All Across the Netherlands</Heading>
          <Text variant="lg" bgScheme="white" className="mt-4">
            From north to south
          </Text>
          <Text variant="lg" bgScheme="white">
            From east to west
          </Text>
          <Image
            src="/jobs/netherlands.svg"
            alt="Map of the Netherlands"
            width={400}
            height={472}
            unoptimized
            className="mx-auto mt-10"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </Section>
    </>
  );
}
