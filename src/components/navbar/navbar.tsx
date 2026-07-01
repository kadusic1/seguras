import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { NavbarCta } from "./navbar-cta";
import { NavbarLinks } from "./navbar-links";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image
                src="/logo.svg"
                alt="Seguras"
                width={26}
                height={26}
                className="h-auto w-auto"
                priority
              />
            </div>
            <span className="text-xl font-bold italic text-white">
              SEGURAS SECURITY
            </span>
          </Link>

          <div className="hidden lg:block">
            <NavbarLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <NavbarCta />
          </div>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
