"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { NavbarLinks } from "./navbar-links";

function MenuIcon({ open, label }: { open: boolean; label: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      role="img"
      aria-label={label}
      className="transition-transform duration-300"
    >
      {open ? (
        <>
          <path d="M18 6L6 18" className="animate-[draw_0.3s_ease]" />
          <path d="M6 6l12 12" className="animate-[draw_0.3s_ease]" />
        </>
      ) : (
        <>
          <path d="M3 12h18" className="animate-[draw_0.3s_ease]" />
          <path d="M3 6h18" className="animate-[draw_0.3s_ease]" />
          <path d="M3 18h18" className="animate-[draw_0.3s_ease]" />
        </>
      )}
    </svg>
  );
}

interface MobileMenuProps {
  isLoggedIn?: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const tCommon = useTranslations("Common");
  const menuLabel = isOpen ? tCommon("menu.close") : tCommon("menu.open");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-10 w-10 cursor-pointer items-center justify-center text-white transition-colors hover:text-red-500"
        aria-label={menuLabel}
      >
        <MenuIcon open={isOpen} label={menuLabel} />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-72 flex-col overflow-y-auto bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 px-6 pt-28">
          <nav>
            <NavbarLinks
              wrapperClassName="flex flex-col gap-4"
              onLinkClick={() => setIsOpen(false)}
              isLoggedIn={isLoggedIn}
              variant="mobile"
            />
          </nav>

          <div className="mt-auto flex flex-col gap-4 px-6 pb-8">
            <Button
              href="/contact"
              variant="primary"
              bgScheme="red"
              onClick={() => setIsOpen(false)}
              iconRight={<ArrowRight className="size-4" />}
            >
              {t("contact")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
