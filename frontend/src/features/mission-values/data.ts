import "server-only";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  HeartHandshake,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";

export interface MissionValue {
  heroIcon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  href: string;
}

export const missionValues: MissionValue[] = [
  {
    heroIcon: Shield,
    titleKey: "mission.cards.card_1.title",
    descriptionKey: "mission.cards.card_1.description",
    href: "/contact",
  },
  {
    heroIcon: Users,
    titleKey: "mission.cards.card_2.title",
    descriptionKey: "mission.cards.card_2.description",
    href: "/contact",
  },
  {
    heroIcon: Target,
    titleKey: "mission.cards.card_3.title",
    descriptionKey: "mission.cards.card_3.description",
    href: "/contact",
  },
  {
    heroIcon: Lightbulb,
    titleKey: "mission.cards.card_4.title",
    descriptionKey: "mission.cards.card_4.description",
    href: "/contact",
  },
  {
    heroIcon: HeartHandshake,
    titleKey: "mission.cards.card_5.title",
    descriptionKey: "mission.cards.card_5.description",
    href: "/contact",
  },
  {
    heroIcon: Award,
    titleKey: "mission.cards.card_6.title",
    descriptionKey: "mission.cards.card_6.description",
    href: "/contact",
  },
];
