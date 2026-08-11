"use client";

import type { ReactNode } from "react";
import { Heading } from "@/components/ui";
import { RelativeTime } from "./relative-time";

interface ItemAvatarProps {
  children: ReactNode;
}

/** 48x48 solid red circle used as the leading element in a card header. */
export function ItemAvatar({ children }: ItemAvatarProps) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600">
      {children}
    </div>
  );
}

type ItemBadgeVariant = "soft" | "solid";

const badgeVariantClass: Record<ItemBadgeVariant, string> = {
  soft: "bg-red-500/10 text-red-600",
  solid: "bg-red-700 text-white",
};

interface ItemBadgeProps {
  children: ReactNode;
  variant?: ItemBadgeVariant;
}

/**
 * Pill badge for card headers. "soft" mirrors Heading's own badge style for
 * bgScheme="white" (secondary/optional metadata); "solid" is a stronger
 * fill for primary metadata.
 */
export function ItemBadge({ children, variant = "soft" }: ItemBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeVariantClass[variant]}`}
    >
      {children}
    </span>
  );
}

interface ItemHeaderProps {
  avatar: ReactNode;
  name: string;
  badges?: ReactNode;
  timeAgo: string;
}

/**
 * Shared header row for avatar-led cards (MessageItem, ApplicationItem):
 * avatar, name, optional badge(s), and a right-aligned relative timestamp.
 * Wraps on narrow screens so the timestamp can drop to its own line.
 */
export function ItemHeader({ avatar, name, badges, timeAgo }: ItemHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-3">
      {avatar}
      <Heading as="h3" size="md" bgScheme="white">
        {name}
      </Heading>
      {badges}
      <RelativeTime date={timeAgo} />
    </header>
  );
}
