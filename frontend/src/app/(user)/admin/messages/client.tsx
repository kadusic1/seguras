"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Section } from "@/components/blocks";
import { Modal } from "@/components/overlay";
import type { PaginatedResponse } from "@/components/paginated-items";
import { MessageItem, PaginationParent } from "@/components/paginated-items";
import { deleteMessage } from "@/features/messages/api";
import type { MessageItemData } from "@/features/messages/types";

interface MessagesClientProps {
  initialData: PaginatedResponse<MessageItemData>;
}

export function MessagesClient({ initialData }: MessagesClientProps) {
  const t = useTranslations("Messages");
  const [deleteTarget, setDeleteTarget] = useState<MessageItemData | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error, networkError } = await deleteMessage(deleteTarget.id);
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
        <PaginationParent<MessageItemData>
          initialData={initialData}
          url="/api/contact"
          showAddButton={false}
          emptyMessage={t("empty")}
          refreshToken={refreshToken}
          renderItem={(item) => (
            <div key={item.id} className="mb-6">
              <MessageItem
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
