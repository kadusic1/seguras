"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./types";

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`relative pb-1 text-base font-bold italic tracking-wide transition-colors
                ${
                  isActive
                    ? "text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-red-500"
                    : "text-white hover:text-red-500"
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
