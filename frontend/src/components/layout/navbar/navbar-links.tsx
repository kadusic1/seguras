"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { NavDropdown } from "./nav-dropdown";
import { adminNavLinks, navLinks } from "./navbar-data";
import { linkClass } from "./navbar-link-styles";
import { useIsActivePath } from "./use-is-active-path";

interface NavbarLinksProps {
  wrapperClassName?: string;
  onLinkClick?: () => void;
  isLoggedIn?: boolean;
  variant?: "desktop" | "mobile";
}

export function NavbarLinks({
  wrapperClassName,
  onLinkClick,
  isLoggedIn,
  variant = "desktop",
}: NavbarLinksProps) {
  const isActive = useIsActivePath();
  const t = useTranslations("Navbar");

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
              {t(link.labelKey)}
            </Link>
          </li>
        );
      })}
      {isLoggedIn && (
        <NavDropdown
          label={t("admin")}
          icon={Shield}
          links={adminNavLinks}
          variant={variant}
          onLinkClick={onLinkClick}
        />
      )}
    </ul>
  );
}
