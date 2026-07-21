import type { LucideIcon } from "lucide-react";

export interface Job {
  icon?: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  meta?: { label: string; value: string }[];
}
