"use client";

import { ArrowRight, Trash2 } from "lucide-react";
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
    const { keys, error } = await uploadNewsImages(files);
    if (error) {
      setUploadError(error);
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
    const { error } = await createNews({
      heading: data.heading,
      text: data.text,
      images: toCreateNewsImages(imageKeys),
    });
    if (error) {
      setSubmitError(error);
      return;
    }
    setIsAddOpen(false);
    setRefreshToken((t) => t + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteNews(deleteTarget.id);
    if (error) {
      setDeleteError(error);
      return;
    }
    setDeleteTarget(null);
    setDeleteError(null);
    setRefreshToken((t) => t + 1);
  };

  return (
    <>
      <Hero
        headline="Latest News"
        subtitle="Stay up to date with the latest from Seguras"
        ctaLabel="Read Latest"
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
        title="Latest News"
        bgScheme="white"
        animation="slideUp"
      >
        <PaginationParent<NewsItemData>
          initialData={initialData}
          url="/api/news"
          emptyMessage="No news found yet."
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
        heading="Add News"
        text="Fill in the article details and attach images."
      >
        <Form<NewsFormData>
          key={addFormKey}
          header="News Article"
          bgScheme="white"
          submitLabel="Publish News"
          defaultValues={{ heading: "", text: "" }}
          onSubmit={handleSubmit}
        >
          <FormField
            name="heading"
            label="Heading"
            type="text"
            placeholder="News title"
            rules={{ required: true, validate: maxLength(255, "Heading") }}
          />
          <FormField
            name="text"
            label="Text"
            type="textarea"
            rows={6}
            placeholder="Write the news article..."
            rules={{ required: true, validate: maxLength(65535, "Text") }}
          />
          <FileInputField
            name="images"
            label="Images"
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
        title="Delete News"
        description={
          deleteError ??
          "This news article and its images will be permanently removed. This action cannot be undone."
        }
        icon={Trash2}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        bgScheme="white"
      />
    </>
  );
}
