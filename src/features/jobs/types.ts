export interface Job {
  title: string;
  description: string;
  href: string;
  badge?: string;
  meta?: { label: string; value: string }[];
}
