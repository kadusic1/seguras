import type { LucideIcon } from "lucide-react";

export interface Job {
  icon?: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  meta?: { label: string; value: string }[];
}

export interface JobApplicationItemData {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  email: string;
  phone: string;
  hours_available: number;
  clothing_size: string;
  employment_type: string;
  created_at: string;
  time_ago: string;
  cv_url?: string;
}
