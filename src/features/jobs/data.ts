import "server-only";

import type { Job } from "./types";

export const jobs: Job[] = [
  {
    title: "Service Host",
    description:
      "The friendly face of every event. Welcome guests, check tickets, guide visitors, and ensure a smooth experience from the moment they arrive.",
    href: "/jobs",
    badge: "Featured",
    meta: [
      { label: "Type", value: "Full-time" },
      { label: "Location", value: "Nationwide" },
    ],
  },
  {
    title: "Security Officer",
    description:
      "Protect people and venues with vigilance and professionalism. Access control, crowd monitoring, and rapid response at major events.",
    href: "/jobs",
    meta: [
      { label: "Type", value: "Full-time" },
      { label: "Location", value: "Nationwide" },
    ],
  },
];
