import {
  Building2,
  House,
  Newspaper,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import type { NavLink } from "./types";

export const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/services", label: "Services", icon: ShieldCheck },
  { href: "/about", label: "About Us", icon: Building2 },
  { href: "/jobs", label: "Jobs", icon: UserPlus },
  { href: "/news", label: "News", icon: Newspaper },
];
