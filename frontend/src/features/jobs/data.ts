import { Shield, UserCheck } from "lucide-react";
import type { Job } from "./types";

export const jobs: Job[] = [
  {
    icon: UserCheck,
    title: "Service Host",
    description:
      "The friendly face of every event. Welcome guests, check tickets, guide visitors, and ensure a smooth experience from the moment they arrive.",
    href: "/jobs",
    badge: "Service",
  },
  {
    icon: Shield,
    title: "Security Officer",
    description:
      "Protect people and venues with vigilance and professionalism. Access control, crowd monitoring, and rapid response at major events.",
    href: "/jobs",
    badge: "Security",
  },
];
