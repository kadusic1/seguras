"use client";

import { Trash2 } from "lucide-react";
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
  const [deleteTarget, setDeleteTarget] =
    useState<JobApplicationItemData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteApplication(deleteTarget.id);
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
      <Section title="Applications" bgScheme="white" animation="slideUp">
        <PaginationParent<JobApplicationItemData>
          initialData={initialData}
          url="/api/jobs"
          showAddButton={false}
          emptyMessage="No applications found yet."
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
        title="Delete Application"
        description={
          deleteError ??
          "This application and any attached CV will be permanently removed. This action cannot be undone."
        }
        icon={Trash2}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        bgScheme="white"
      />
    </>
  );
}
