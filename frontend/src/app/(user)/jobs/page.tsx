"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, Hero, Section } from "@/components/blocks";
import {
  FileInputField,
  Form,
  FormField,
  RadioGroupField,
  SelectField,
} from "@/components/form";
import { EMAIL_PATTERN } from "@/components/form/rules";
import { ModalForm, SuccessMessage } from "@/components/overlay";
import { Grid, Heading, Text } from "@/components/ui";
import { jobs } from "@/features/jobs/data";
import { PLACEHOLDER } from "@/lib/placeholders";
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
  hoursAvailable: number;
  clothingSize: string;
  employmentType: string;
}

export default function JobsPage() {
  const tHome = useTranslations("Home");
  const tJobs = useTranslations("Jobs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"security" | "service">(
    "security",
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cvKey, setCvKey] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const openModal = (type: "security" | "service") => {
    setSelectedType(type);
    setSubmitError(null);
    setCvKey(null);
    setCvError(null);
    setIsModalOpen(true);
  };

  const handleCvAdded = async ([file]: File[]): Promise<boolean> => {
    if (!file) return false;
    setCvError(null);

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: file.size,
          content_type: file.type || "application/octet-stream",
          filename: file.name,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        const msg = err.error ?? tJobs("errors.cvPrepareFailed");
        setCvError(msg.charAt(0).toUpperCase() + msg.slice(1));
        return false;
      }

      const { upload_url, key } = await res.json();

      const putRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!putRes.ok) {
        setCvError(tJobs("errors.cvUploadFailed"));
        return false;
      }

      setCvKey(key);
      return true;
    } catch {
      setCvError(tJobs("errors.connectionError"));
      return false;
    }
  };

  const handleCvRemoved = async () => {
    const key = cvKey;
    setCvKey(null);
    setCvError(null);
    if (!key) return;

    await fetch(`/api/files/${key}`, {
      method: "DELETE",
    });
  };

  const handleSubmit = async (data: JobApplicationForm) => {
    setSubmitError(null);

    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      address: data.address,
      email: data.email,
      phone: data.phone,
      hours_available: Number(data.hoursAvailable),
      clothing_size: data.clothingSize,
      employment_type: data.employmentType,
      cv_key: cvKey ?? "",
    };

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error ?? tJobs("errors.submitFailed"));
        return;
      }

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch {
      setSubmitError(tJobs("errors.connectionError"));
    }
  };

  return (
    <>
      <Hero
        headline={tJobs("hero.headline")}
        subtitle={tJobs("hero.subtitle")}
        ctaLabel={tJobs("hero.ctaLabel")}
        onCtaClick={() =>
          document
            .getElementById("open-positions")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        imageSrc="/jobs/jobs-hero.webp"
        imageAlt="Seguras team"
        iconRight={<ArrowRight size={16} />}
      />

      <Section
        id="open-positions"
        title={tJobs("positions.title")}
        bgScheme="black"
        animation="zoomIn"
      >
        <Grid cols={2}>
          {jobs.map((j) => (
            <Card
              key={j.titleKey}
              icon={j.icon}
              title={tHome(j.titleKey)}
              description={tHome(j.descriptionKey)}
              badge={j.badgeKey ? tJobs(j.badgeKey) : undefined}
              variant="listing"
              bgScheme="black"
              buttonLabel={tJobs("positions.applyButton")}
              onClick={() =>
                openModal(j.badge?.toLowerCase() as "security" | "service")
              }
              ctaVariant="primary"
            />
          ))}
        </Grid>
      </Section>

      <ModalForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        heading={tJobs("modal.heading")}
        text={tJobs("modal.text")}
      >
        <Form<JobApplicationForm>
          key={selectedType}
          header={tJobs("form.header")}
          bgScheme="white"
          submitLabel={tJobs("form.submitLabel")}
          defaultValues={{ employmentType: selectedType }}
          onSubmit={handleSubmit}
        >
          <Heading as="h3" size="sm" bgScheme="white">
            {tJobs("form.jobTypeHeading")}
          </Heading>
          <Text variant="sm" bgScheme="white" className="mb-2">
            {tJobs("form.jobTypeNote")}
          </Text>
          <RadioGroupField
            name="employmentType"
            label={tJobs("form.positionLabel")}
            options={[
              { label: tJobs("form.positionSecurity"), value: "security" },
              { label: tJobs("form.positionService"), value: "service" },
            ]}
            rules={{ required: tJobs("validation.requiredPosition") }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            {tJobs("form.personalHeading")}
          </Heading>
          <FormField
            name="firstName"
            label={tJobs("form.firstNameLabel")}
            type="text"
            placeholder={PLACEHOLDER.firstName}
            rules={{
              required: true,
              validate: maxLength(100, tJobs("validation.maxLengthFirstName")),
            }}
          />
          <FormField
            name="lastName"
            label={tJobs("form.lastNameLabel")}
            type="text"
            placeholder={PLACEHOLDER.lastName}
            rules={{
              required: true,
              validate: maxLength(100, tJobs("validation.maxLengthLastName")),
            }}
          />
          <FormField
            name="dateOfBirth"
            label={tJobs("form.dateOfBirthLabel")}
            type="date"
            rules={{
              required: true,
              validate: dateInPast(
                tJobs("validation.invalidDate"),
                tJobs("validation.dateInPast"),
              ),
            }}
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
            label={tJobs("form.addressLabel")}
            type="text"
            placeholder={PLACEHOLDER.address}
            rules={{
              required: true,
              validate: maxLength(255, tJobs("validation.maxLengthAddress")),
            }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            {tJobs("form.contactHeading")}
          </Heading>
          <FormField
            name="email"
            label={tJobs("form.emailLabel")}
            type="email"
            placeholder={PLACEHOLDER.email}
            rules={{
              required: true,
              pattern: {
                value: EMAIL_PATTERN,
                message: tJobs("validation.invalidEmail"),
              },
            }}
          />
          <FormField
            name="phone"
            label={tJobs("form.phoneLabel")}
            type="tel"
            placeholder={PLACEHOLDER.phone}
            rules={{
              required: true,
              validate: validPhone(tJobs("validation.invalidPhone")),
            }}
          />

          <Heading as="h3" size="sm" bgScheme="white" className="mt-6">
            {tJobs("form.availabilityHeading")}
          </Heading>
          <FormField
            name="hoursAvailable"
            label={tJobs("form.hoursAvailableLabel")}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={PLACEHOLDER.hoursAvailable}
            rules={{
              required: tJobs("validation.requiredHours"),
              validate: {
                isNumeric: isNumeric(tJobs("validation.notNumericHours")),
                inRange: inRange(1, 168, tJobs("validation.rangeHours")),
              },
            }}
          />
          <SelectField
            name="clothingSize"
            label={tJobs("form.clothingSizeLabel")}
            options={[
              { label: "XS", value: "XS" },
              { label: "S", value: "S" },
              { label: "M", value: "M" },
              { label: "L", value: "L" },
              { label: "XL", value: "XL" },
              { label: "2XL", value: "2XL" },
              { label: "3XL", value: "3XL" },
            ]}
            rules={{ required: tJobs("validation.requiredSize") }}
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
            {tJobs("form.additionalHeading")}
          </Heading>
          <Text variant="sm" bgScheme="white" className="mb-4">
            {tJobs("form.cvNote")}
          </Text>
          <FileInputField
            name="cv"
            label={tJobs("form.cvLabel")}
            accept=".pdf,.doc,.docx"
            onFilesAdded={handleCvAdded}
            onFileRemoved={handleCvRemoved}
          />
          {cvError && (
            <Text
              variant="sm"
              bgScheme="white"
              className="text-red-500 first-letter:uppercase"
            >
              {cvError}
            </Text>
          )}

          {submitError && (
            <Text
              variant="sm"
              bgScheme="white"
              className="text-red-500 first-letter:uppercase"
            >
              {submitError}
            </Text>
          )}

          <Text variant="sm" bgScheme="white" className="text-center">
            {tJobs.rich("form.helpText", {
              contact: (chunks) => (
                <a href="/contact" className="underline hover:text-red-600">
                  {chunks}
                </a>
              ),
              phoneLink: (chunks) => (
                <a
                  href="tel:+31640989152"
                  className="underline hover:text-red-600"
                >
                  {chunks}
                </a>
              ),
              emailLink: (chunks) => (
                <a
                  href="mailto:segurasservicediensten@gmail.com"
                  className="underline hover:text-red-600"
                >
                  {chunks}
                </a>
              ),
              phone: "+31 6 409 891 52",
              email: "segurasservicediensten@gmail.com",
            })}
          </Text>
        </Form>
      </ModalForm>

      <SuccessMessage
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title={tJobs("success.title")}
        description={tJobs("success.description")}
      />

      <Section bgScheme="white" animation="slideUp">
        <div className="mx-auto max-w-3xl text-center">
          <Heading bgScheme="white">{tJobs("footer.title")}</Heading>
          <Text variant="lg" bgScheme="white" className="mt-4">
            {tJobs("footer.northToSouth")}
          </Text>
          <Text variant="lg" bgScheme="white">
            {tJobs("footer.eastToWest")}
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
