import { ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { MobileMenu } from "./mobile-menu";
import { NavbarLinks } from "./navbar-links";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />

          <div className="hidden lg:block">
            <NavbarLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Button
              href="/contact"
              variant="primary"
              colorScheme="red"
              iconRight={<ArrowRight className="size-4" />}
            >
              Contact
            </Button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
