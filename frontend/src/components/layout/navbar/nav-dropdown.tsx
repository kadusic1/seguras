"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { linkClass, sectionLabelClass } from "./navbar-link-styles";
import type { NavLink } from "./types";

interface NavDropdownProps {
  label: string;
  icon: LucideIcon;
  links: NavLink[];
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export function NavDropdown({
  label,
  icon: Icon,
  links,
  variant,
  onLinkClick,
}: NavDropdownProps) {
  const pathname = usePathname();
  const active = links.some((link) => pathname.startsWith(link.href));
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  if (variant === "mobile") {
    return (
      <li>
        <span className={sectionLabelClass}>
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </span>
        <ul className="mt-2 flex flex-col gap-4 border-l-2 border-zinc-800 pl-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={linkClass(pathname === link.href)}
              >
                {link.icon && (
                  <link.icon className="size-4 shrink-0" aria-hidden="true" />
                )}
                {t(link.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li
      className="group relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`${linkClass(active, false)} cursor-default`}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {label}
        <ChevronDown
          className={`size-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "group-hover:rotate-180"
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`absolute left-0 top-full pt-2 transition-opacity duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="w-52 space-y-1 border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => {
                  setIsOpen(false);
                  onLinkClick?.();
                }}
                className={`${linkClass(pathname === link.href)} px-2`}
              >
                {link.icon && (
                  <link.icon className="size-4 shrink-0" aria-hidden="true" />
                )}
                {t(link.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
