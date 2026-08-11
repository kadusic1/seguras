"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Hero, Section } from "@/components/blocks";
import { FileInputField, Form, FormField } from "@/components/form";
import { Modal, ModalForm } from "@/components/overlay";
import type { PaginatedResponse } from "@/components/paginated-items";
import { NewsItem, PaginationParent } from "@/components/paginated-items";
import { Text } from "@/components/ui";
import {
  createNews,
  deleteNews,
  toCreateNewsImages,
  uploadNewsImages,
} from "@/features/news";
import type { NewsItemData } from "@/features/news/types";
import { maxLength } from "@/lib/validators";

interface NewsFormData {
  heading: string;
  text: string;
}

interface NewsClientProps {
  initialData: PaginatedResponse<NewsItemData>;
  isAdmin: boolean;
}

export function NewsClient({ initialData, isAdmin }: NewsClientProps) {
  const tNews = useTranslations("News");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFormKey, setAddFormKey] = useState(0);
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItemData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const openAddModal = () => {
    setImageKeys([]);
    setUploadError(null);
    setSubmitError(null);
    setIsAddOpen(true);
    setAddFormKey((k) => k + 1);
  };

  const handleImagesAdded = async (files: File[]): Promise<boolean> => {
    const { keys, failed } = await uploadNewsImages(files);
    if (failed) {
      setUploadError(tNews("errors.uploadFailed"));
      return false;
    }
    setImageKeys((prev) => [...prev, ...keys]);
    setUploadError(null);
    return true;
  };

  const handleImageRemoved = async (index: number) => {
    const key = imageKeys[index];
    if (!key) return;
    setImageKeys((prev) => prev.filter((_, i) => i !== index));
    await fetch(`/api/files/${key}`, { method: "DELETE" });
  };

  const handleSubmit = async (data: NewsFormData) => {
    setSubmitError(null);
    const result = await createNews({
      heading: data.heading,
      text: data.text,
      images: toCreateNewsImages(imageKeys),
    });
    if (!result.ok) {
      setSubmitError(
        result.networkError
          ? tNews("errors.connectionError")
          : (result.error ?? tNews("errors.createFailed")),
      );
      return;
    }
    setIsAddOpen(false);
    setRefreshToken((t) => t + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const result = await deleteNews(deleteTarget.id);
    if (!result.ok) {
      setDeleteError(
        result.networkError
          ? tNews("errors.connectionError")
          : (result.error ?? tNews("errors.deleteFailed")),
      );
      return;
    }
    setDeleteTarget(null);
    setDeleteError(null);
    setRefreshToken((t) => t + 1);
  };

  return (
    <>
      <Hero
        headline={tNews("hero.headline")}
        subtitle={tNews("hero.subtitle")}
        ctaLabel={tNews("hero.ctaLabel")}
        onCtaClick={() =>
          document
            .getElementById("latest-news")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        imageSrc="/services/services1.webp"
        imageAlt="Seguras news"
        iconRight={<ArrowRight size={16} />}
      />

      <Section
        id="latest-news"
        title={tNews("section.title")}
        bgScheme="white"
        animation="slideUp"
      >
        <PaginationParent<NewsItemData>
          initialData={initialData}
          url="/api/news"
          emptyMessage={tNews("empty")}
          refreshToken={refreshToken}
          showAddButton={isAdmin}
          onAddButtonClick={openAddModal}
          renderItem={(item) => (
            <div key={item.id} className="mb-6">
              <NewsItem
                item={item}
                showDeleteButton={isAdmin}
                onDeleteButtonClick={() => {
                  setDeleteTarget(item);
                  setDeleteError(null);
                }}
              />
            </div>
          )}
        />
      </Section>

      <ModalForm
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        heading={tNews("addModal.heading")}
        text={tNews("addModal.text")}
      >
        <Form<NewsFormData>
          key={addFormKey}
          header={tNews("form.header")}
          bgScheme="white"
          submitLabel={tNews("form.submitLabel")}
          defaultValues={{ heading: "", text: "" }}
          onSubmit={handleSubmit}
        >
          <FormField
            name="heading"
            label={tNews("form.headingLabel")}
            type="text"
            placeholder={tNews("form.headingPlaceholder")}
            rules={{
              required: true,
              validate: maxLength(255, tNews("validation.heading")),
            }}
          />
          <FormField
            name="text"
            label={tNews("form.textLabel")}
            type="textarea"
            rows={6}
            placeholder={tNews("form.textPlaceholder")}
            rules={{
              required: true,
              validate: maxLength(65535, tNews("validation.text")),
            }}
          />
          <FileInputField
            name="images"
            label={tNews("form.imagesLabel")}
            accept="image/*"
            multiple
            onFilesAdded={handleImagesAdded}
            onFileRemoved={handleImageRemoved}
          />
          {uploadError && (
            <Text
              variant="sm"
              bgScheme="white"
              className="text-red-500 first-letter:uppercase"
            >
              {uploadError}
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
        </Form>
      </ModalForm>

      <Modal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={tNews("deleteModal.title")}
        description={deleteError ?? tNews("deleteModal.description")}
        icon={Trash2}
        confirmLabel={tNews("deleteModal.confirmLabel")}
        onConfirm={handleDeleteConfirm}
        bgScheme="white"
      />
    </>
  );
}
