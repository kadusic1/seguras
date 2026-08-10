"use client";

import { Trash2 } from "lucide-react";
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
  const [deleteTarget, setDeleteTarget] = useState<MessageItemData | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteMessage(deleteTarget.id);
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
      <Section title="Messages" bgScheme="white" animation="slideUp">
        <PaginationParent<MessageItemData>
          initialData={initialData}
          url="/api/contact"
          showAddButton={false}
          emptyMessage="No messages found yet."
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
        title="Delete Message"
        description={
          deleteError ??
          "This message will be permanently removed. This action cannot be undone."
        }
        icon={Trash2}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        bgScheme="white"
      />
    </>
  );
}
