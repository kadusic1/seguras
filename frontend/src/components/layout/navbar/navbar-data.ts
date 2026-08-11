import {
  Briefcase,
  Building2,
  House,
  Mail,
  Newspaper,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import type { NavLink } from "./types";

export const navLinks: NavLink[] = [
  { href: "/", labelKey: "home", icon: House },
  { href: "/services", labelKey: "services", icon: ShieldCheck },
  { href: "/about", labelKey: "about", icon: Building2 },
  { href: "/jobs", labelKey: "jobs", icon: UserPlus },
  { href: "/news", labelKey: "news", icon: Newspaper },
];

export const adminNavLinks: NavLink[] = [
  { href: "/admin/messages", labelKey: "messages", icon: Mail },
  { href: "/admin/applications", labelKey: "applications", icon: Briefcase },
];
