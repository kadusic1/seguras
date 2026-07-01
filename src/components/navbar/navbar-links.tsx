"use client";

import Link from "next/link";
import { navLinks } from "./navbar-data";
import { useIsActivePath } from "./use-is-active-path";

export function NavbarLinks() {
  const isActive = useIsActivePath();

  return (
    <ul className="flex items-center gap-8">
      {navLinks.map((link) => {
        const active = isActive(link.href);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`relative pb-1 text-base font-bold italic tracking-wide transition-colors after:transition-opacity after:duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-white ${
                active
                  ? "after:opacity-100"
                  : "text-white after:opacity-0 hover:after:opacity-100"
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
