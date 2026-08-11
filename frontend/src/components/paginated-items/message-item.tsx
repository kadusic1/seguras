"use client";

import { Mail, Phone } from "lucide-react";
import { Text } from "@/components/ui";
import type { MessageItemData } from "@/features/messages/types";
import { ItemCommon } from "./item-common";
import { ItemAvatar, ItemBadge, ItemHeader } from "./item-header";

export type { MessageItemData } from "@/features/messages/types";

interface MessageItemProps {
  item: MessageItemData;
  showDeleteButton?: boolean;
  onDeleteButtonClick?: () => void;
}

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function MessageItem({
  item,
  showDeleteButton = false,
  onDeleteButtonClick,
}: MessageItemProps) {
  return (
    <ItemCommon
      showDeleteButton={showDeleteButton}
      onDeleteButtonClick={onDeleteButtonClick}
    >
      <ItemHeader
        avatar={
          <ItemAvatar>
            <span className="text-base font-semibold text-white">
              {initials(item.first_name, item.last_name)}
            </span>
          </ItemAvatar>
        }
        name={`${item.first_name} ${item.last_name}`}
        badges={
          item.company ? <ItemBadge>{item.company}</ItemBadge> : undefined
        }
        timeAgo={item.time_ago}
      />

      <div className="mt-3 flex flex-wrap gap-4">
        <a
          href={`mailto:${item.email}`}
          className="inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-red-600"
        >
          <Mail className="size-4" />
          {item.email}
        </a>
        <a
          href={`tel:${item.phone}`}
          className="inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-red-600"
        >
          <Phone className="size-4" />
          {item.phone}
        </a>
      </div>

      <Text
        variant="base"
        bgScheme="white"
        className="mt-4 whitespace-pre-line"
      >
        {item.message}
      </Text>
    </ItemCommon>
  );
}
