"use client";

import {
  Calendar,
  Clock,
  Download,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  Shirt,
  UserCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import type { JobApplicationItemData } from "@/features/jobs/types";
import { ItemCommon } from "./item-common";
import { ItemAvatar, ItemBadge, ItemHeader } from "./item-header";

export type { JobApplicationItemData } from "@/features/jobs/types";

interface ApplicationItemProps {
  item: JobApplicationItemData;
  showDeleteButton?: boolean;
  onDeleteButtonClick?: () => void;
}

const employmentTypeLabel: Record<string, string> = {
  security: "Security",
  service: "Service",
};

const employmentTypeIcon: Record<string, LucideIcon> = {
  security: Shield,
  service: UserCheck,
};

interface DetailRowProps {
  icon: LucideIcon;
  label?: string;
  children: ReactNode;
}

function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-black/60">
      <Icon className="size-4 shrink-0" />
      {label && <span className="font-semibold text-black">{label}:</span>}
      <span>{children}</span>
    </div>
  );
}

export function ApplicationItem({
  item,
  showDeleteButton = false,
  onDeleteButtonClick,
}: ApplicationItemProps) {
  const EmploymentIcon = employmentTypeIcon[item.employment_type] ?? Shield;
  const employmentLabel =
    employmentTypeLabel[item.employment_type] ?? item.employment_type;

  return (
    <ItemCommon
      showDeleteButton={showDeleteButton}
      onDeleteButtonClick={onDeleteButtonClick}
    >
      <ItemHeader
        avatar={
          <ItemAvatar>
            <EmploymentIcon className="size-6 text-white" strokeWidth={1.75} />
          </ItemAvatar>
        }
        name={`${item.first_name} ${item.last_name}`}
        badges={<ItemBadge variant="solid">{employmentLabel}</ItemBadge>}
        timeAgo={item.time_ago}
        createdAt={item.created_at}
      />

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        <DetailRow icon={Calendar} label="Born">
          {item.date_of_birth}
        </DetailRow>
        <DetailRow icon={MapPin} label="Address">
          {item.address}
        </DetailRow>
        <DetailRow icon={Mail}>
          <a href={`mailto:${item.email}`} className="hover:text-red-600">
            {item.email}
          </a>
        </DetailRow>
        <DetailRow icon={Phone}>
          <a href={`tel:${item.phone}`} className="hover:text-red-600">
            {item.phone}
          </a>
        </DetailRow>
        <DetailRow icon={Clock} label="Available">
          {item.hours_available} h / week
        </DetailRow>
        <DetailRow icon={Shirt} label="Size">
          {item.clothing_size}
        </DetailRow>
      </div>

      {item.cv_url && (
        <div className="mt-4 border-t border-black/10 pt-4">
          <a
            href={item.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-400"
          >
            <Download className="size-4" />
            Download CV
          </a>
        </div>
      )}
    </ItemCommon>
  );
}
