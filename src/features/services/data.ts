import "server-only";

import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Shield, Users } from "lucide-react";

export interface Service {
  heroIcon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  {
    heroIcon: Shield,
    title: "Venue & Perimetre Security",
    description:
      "Access control, bag search operations, CCTV monitoring, and perimetre protection for stadiums and event sites.",
    href: "/services",
  },
  {
    heroIcon: Users,
    title: "Crowd Management & Stewarding",
    description:
      "Licensed stewards for crowd flow, spectator safety, and ingress management at concerts, festivals, and sporting events.",
    href: "/services",
  },
  {
    heroIcon: ClipboardCheck,
    title: "Event Safety Planning",
    description:
      "Pre-event risk assessments, site surveys, stewarding ratio calculations, and full regulatory compliance with local safety standards.",
    href: "/services",
  },
];
