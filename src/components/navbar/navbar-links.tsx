"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { navLinks } from "./navbar-data";
import { useIsActivePath } from "./use-is-active-path";

interface NavbarLinksProps {
  wrapperClassName?: string;
  onLinkClick?: () => void;
  isLoggedIn?: boolean;
}

const linkClass = (active: boolean) =>
  `flex items-center gap-2 relative pb-1 text-base font-bold italic tracking-wide transition-colors after:transition-opacity after:duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-white ${
    active
      ? "after:opacity-100"
      : "text-white after:opacity-0 hover:after:opacity-100"
  }`;

export function NavbarLinks({
  wrapperClassName,
  onLinkClick,
  isLoggedIn,
}: NavbarLinksProps) {
  const isActive = useIsActivePath();

  return (
    <ul className={wrapperClassName ?? "flex items-center gap-8"}>
      {navLinks.map((link) => {
        const active = isActive(link.href);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={linkClass(active)}
            >
              {link.icon && (
                <link.icon className="size-4 shrink-0" aria-hidden="true" />
              )}
              {link.label}
            </Link>
          </li>
        );
      })}
      {isLoggedIn && (
        <li>
          <Link
            href="/admin"
            onClick={onLinkClick}
            className={linkClass(isActive("/admin"))}
          >
            <Shield className="size-4 shrink-0" aria-hidden="true" />
            Admin
          </Link>
        </li>
      )}
    </ul>
  );
}
