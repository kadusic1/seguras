"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/button";
import { type NeutralColorScheme, schemes } from "@/lib/colours";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  bgScheme?: NeutralColorScheme;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  bgScheme = "white",
}: ModalProps) {
  const s = schemes[bgScheme];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
        data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        >
          <Dialog.Content
            className={`z-50 w-full max-w-lg rounded-lg p-6 shadow-lg
          data-[state=closed]:scale-95 data-[state=closed]:opacity-0
          data-[state=open]:scale-100 data-[state=open]:opacity-100 ${s.bg}`}
          >
            {Icon && (
              <div className="mb-4 flex justify-center">
                <Icon className={`size-10 ${s.accent}`} strokeWidth={1.5} />
              </div>
            )}

            <Dialog.Title
              className={`text-center text-lg font-bold ${s.text.primary}`}
            >
              {title}
            </Dialog.Title>

            <Dialog.Description
              className={`mt-2 text-center text-sm ${s.text.muted}`}
            >
              {description}
            </Dialog.Description>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                bgScheme={bgScheme === "white" ? "black" : "white"}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              <Button variant="primary" bgScheme="red" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
