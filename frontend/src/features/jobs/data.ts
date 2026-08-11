import { Shield, UserCheck } from "lucide-react";
import type { Job } from "./types";

export const jobs: Job[] = [
  {
    icon: UserCheck,
    titleKey: "jobs.card_1.title",
    descriptionKey: "jobs.card_1.description",
    href: "/jobs",
    badge: "Service",
    badgeKey: "positions.badgeService",
  },
  {
    icon: Shield,
    titleKey: "jobs.card_2.title",
    descriptionKey: "jobs.card_2.description",
    href: "/jobs",
    badge: "Security",
    badgeKey: "positions.badgeSecurity",
  },
];
