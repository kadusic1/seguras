import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";

export interface ContactItem {
  icon: LucideIcon;
  label: string;
  href?: string;
}

export const contactInfo: ContactItem[] = [
  { icon: Phone, label: "+31 6 409 891 52", href: "tel:+31640989152" },
  {
    icon: Mail,
    label: "segurasservicediensten@gmail.com",
    href: "mailto:segurasservicediensten@gmail.com",
  },
  { icon: MapPin, label: "Westhoven 7, Roermond" },
];
