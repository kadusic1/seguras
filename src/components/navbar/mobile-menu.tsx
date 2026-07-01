"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavbarCta } from "./navbar-cta";
import { navLinks } from "./types";

function MenuIcon({ open }: { open: boolean }) {
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
      aria-label={open ? "Close menu" : "Open menu"}
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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
        className="relative z-50 flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-red-500"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <MenuIcon open={isOpen} />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-72 flex-col bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 px-6 pt-28">
          <nav>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-md px-4 py-3 text-lg font-bold italic transition-colors ${
                        isActive
                          ? "bg-red-600/10 text-red-500"
                          : "text-white hover:bg-zinc-900 hover:text-red-500"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto px-6 pb-8">
            <NavbarCta />
          </div>
        </div>
      </div>
    </div>
  );
}
