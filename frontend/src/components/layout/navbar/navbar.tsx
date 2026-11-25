import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Button, Logo } from "@/components/ui";
import { MobileMenu } from "./mobile-menu";
import { NavbarLinks } from "./navbar-links";
import { NavbarSignOut } from "./navbar-signout";

export async function Navbar() {
  const session = await auth();
  const t = await getTranslations("Navbar");
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          {session ? <NavbarSignOut /> : <Logo href="/login" />}

          <div className="hidden lg:block">
            <NavbarLinks isLoggedIn={!!session} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Button
              href="/contact"
              variant="primary"
              bgScheme="red"
              iconRight={<ArrowRight className="size-4" />}
            >
              {t("contact")}
            </Button>
          </div>
          <MobileMenu isLoggedIn={!!session} />
        </div>
      </div>
    </nav>
  );
}
