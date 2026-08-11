import "server-only";

import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Shield, Users } from "lucide-react";

export interface Service {
  heroIcon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  href: string;
}

export const services: Service[] = [
  {
    heroIcon: Shield,
    titleKey: "services.card_1.title",
    descriptionKey: "services.card_1.description",
    href: "/services",
  },
  {
    heroIcon: Users,
    titleKey: "services.card_2.title",
    descriptionKey: "services.card_2.description",
    href: "/services",
  },
  {
    heroIcon: ClipboardCheck,
    titleKey: "services.card_3.title",
    descriptionKey: "services.card_3.description",
    href: "/services",
  },
];
