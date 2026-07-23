"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/button";

interface SuccessMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessMessage({ open, onOpenChange }: SuccessMessageProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="size-12 text-green-500" strokeWidth={1.5} />
            <Dialog.Title className="text-center text-lg font-bold text-black">
              Application Received
            </Dialog.Title>
            <Dialog.Description className="text-center text-sm text-black/60">
              We will review your application and get back to you soon.
            </Dialog.Description>
            <Button onClick={() => onOpenChange(false)} bgScheme="red">
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
