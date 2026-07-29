"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/card";
import {
  FileInputField,
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
import {
  dateInPast,
  inRange,
  isNumeric,
  maxLength,
  // validBSN,
  // validIBAN,
  validPhone,
} from "@/lib/validators";

interface JobApplicationForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  // bsn: string;
  address: string;
  email: string;
  phone: string;
  // bankAccount: string;
  cv?: File;
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

    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("date_of_birth", data.dateOfBirth);
    // formData.append("bsn", data.bsn);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    // formData.append("bank_account", data.bankAccount);
    formData.append("hours_available", String(data.hoursAvailable));
    formData.append("clothing_size", data.clothingSize);
    formData.append("employment_type", data.employmentType);

    if (data.cv) {
      formData.append("cv", data.cv);
    }

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formData,
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
        subtitle="Want to join the team? See open positions below!"
        ctaLabel="See Open Positions"
        ctaHref="#open-positions"
        imageSrc="/jobs/jobs-hero.webp"
        imageAlt="Seguras team"
        iconRight={<ArrowRight size={16} />}
      />

      <Section
        id="open-positions"
        title="Open Positions"
        bgScheme="black"
        animation="zoomIn"
      >
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
            rules={{ required: "Select a position" }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Personal Details
          </Heading>
          <FormField
            name="firstName"
            label="First Name"
            type="text"
            rules={{
              required: true,
              validate: maxLength(100, "Name"),
            }}
          />
          <FormField
            name="lastName"
            label="Last Name"
            type="text"
            rules={{
              required: true,
              validate: maxLength(100, "Last name"),
            }}
          />
          <FormField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            rules={{ required: true, validate: dateInPast() }}
          />
          {/* <FormField
            name="bsn"
            label="BSN"
            type="text"
            placeholder="####.###.##"
            rules={{ required: true, validate: validBSN() }}
          /> */}
          <FormField
            name="address"
            label="Address"
            type="text"
            placeholder="Street, city, postcode"
            rules={{
              required: true,
              validate: maxLength(255, "Address"),
            }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Contact
          </Heading>
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            rules={{ required: true }}
          />
          <FormField
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+31 6 12 34 56 78"
            rules={{ required: true, validate: validPhone() }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Availability
          </Heading>
          <FormField
            name="hoursAvailable"
            label="Hours Available per Week"
            type="number"
            placeholder="e.g. 40"
            rules={{
              required: true,
              validate: {
                isNumeric: isNumeric("Hours available"),
                inRange: inRange(1, 168, "Hours available"),
              },
            }}
          />
          <SelectField
            name="clothingSize"
            label="Clothing Size"
            options={[
              { label: "XS", value: "XS" },
              { label: "S", value: "S" },
              { label: "M", value: "M" },
              { label: "L", value: "L" },
              { label: "XL", value: "XL" },
              { label: "2XL", value: "2XL" },
              { label: "3XL", value: "3XL" },
            ]}
            rules={{ required: "Select your size" }}
          />

          {/* <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Bank Details
          </Heading>
          <FormField
            name="bankAccount"
            label="Bank Account (IBAN)"
            type="text"
            placeholder="NL91 ABNA 0417 1643 00"
            rules={{ required: true, validate: validIBAN() }}
          /> */}

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            Additional
          </Heading>
          <Text variant="sm" bgScheme="white" className="mb-4">
            CV upload is not mandatory, but it helps us get to know you better
            and increases your chances of being selected for an interview.
          </Text>
          <FileInputField
            name="cv"
            label="Upload CV"
            accept=".pdf,.doc,.docx"
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

      <Section bgScheme="white" animation="slideUp">
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
