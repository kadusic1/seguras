"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./types";

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
];

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-8">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`relative pb-1 text-sm font-medium tracking-wide transition-colors
                ${
                  isActive
                    ? "text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-red-500"
                    : "text-zinc-300 hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
