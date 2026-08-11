"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Modal } from "@/components/overlay";
import { Logo } from "@/components/ui";

export function NavbarSignOut() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <>
      <Logo onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={t("signOut")}
        description={t("signOutDescription")}
        icon={LogOut}
        confirmLabel={t("signOut")}
        onConfirm={async () => {
          await signOut({ redirect: false });
          window.location.href = "/";
        }}
        bgScheme="white"
      />
    </>
  );
}
