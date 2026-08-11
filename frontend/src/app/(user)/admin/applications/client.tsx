"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Section } from "@/components/blocks";
import { Modal } from "@/components/overlay";
import {
  ApplicationItem,
  type PaginatedResponse,
  PaginationParent,
} from "@/components/paginated-items";
import { deleteApplication } from "@/features/jobs/api";
import type { JobApplicationItemData } from "@/features/jobs/types";

interface ApplicationsClientProps {
  initialData: PaginatedResponse<JobApplicationItemData>;
}

export function ApplicationsClient({ initialData }: ApplicationsClientProps) {
  const t = useTranslations("Applications");
  const [deleteTarget, setDeleteTarget] =
    useState<JobApplicationItemData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error, networkError } = await deleteApplication(deleteTarget.id);
    if (error || networkError) {
      setDeleteError(
        networkError
          ? t("errors.connectionError")
          : (error ?? t("errors.deleteFailed")),
      );
      return;
    }
    setDeleteTarget(null);
    setDeleteError(null);
    setRefreshToken((token) => token + 1);
  };

  return (
    <>
      <Section title={t("section.title")} bgScheme="white" animation="slideUp">
        <PaginationParent<JobApplicationItemData>
          initialData={initialData}
          url="/api/jobs"
          showAddButton={false}
          emptyMessage={t("empty")}
          refreshToken={refreshToken}
          renderItem={(item) => (
            <div key={item.id} className="mb-6">
              <ApplicationItem
                item={item}
                showDeleteButton
                onDeleteButtonClick={() => {
                  setDeleteTarget(item);
                  setDeleteError(null);
                }}
              />
            </div>
          )}
        />
      </Section>

      <Modal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={t("deleteModal.title")}
        description={deleteError ?? t("deleteModal.description")}
        icon={Trash2}
        confirmLabel={t("deleteModal.confirmLabel")}
        onConfirm={handleDeleteConfirm}
        bgScheme="white"
      />
    </>
  );
}
