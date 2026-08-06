"use client";

import type { ReactNode } from "react";
import { DeleteButton } from "@/components/ui";

export const itemCardClassName =
  "mx-auto w-full max-w-3xl rounded-2xl border-2 border-gray-400 bg-gray-200 p-6 sm:p-8";

interface ItemCommonProps {
  children: ReactNode;
  showDeleteButton?: boolean;
  onDeleteButtonClick?: () => void;
}

export function ItemCommon({
  children,
  showDeleteButton = false,
  onDeleteButtonClick,
}: ItemCommonProps) {
  return (
    <article className={itemCardClassName}>
      {children}
      {showDeleteButton && (
        <div className="mt-8 flex justify-end">
          <DeleteButton onClick={onDeleteButtonClick} />
        </div>
      )}
    </article>
  );
}
