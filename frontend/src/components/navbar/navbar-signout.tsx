"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Modal } from "@/components/modal";

export function NavbarSignOut() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Logo onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Sign out"
        description="Are you sure you want to sign out?"
        icon={LogOut}
        confirmLabel="Sign out"
        onConfirm={async () => {
          await signOut({ redirect: false });
          window.location.href = "/";
        }}
        bgScheme="white"
      />
    </>
  );
}
