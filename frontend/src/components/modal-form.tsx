"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { CloseButton } from "@/components/close-button";
import { Heading } from "@/components/heading";
import { Logo } from "@/components/logo";
import { Text } from "@/components/text";

/**
 * Props for the {@link ModalForm} component.
 */
interface ModalFormProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange: (open: boolean) => void;
  /** Heading text displayed below the brand header. */
  heading: string;
  /** Optional description rendered below the heading. */
  text?: string;
  /** Form content rendered inside the modal body. */
  children: ReactNode;
}

/**
 * Full-screen modal dialog for housing a form on a white background.
 *
 * Displays the Seguras brand header centred at the top, followed by a heading,
 * optional description, and the form children. Uses a white colour scheme with
 * black text.
 */
export function ModalForm({
  open,
  onOpenChange,
  heading,
  text,
  children,
}: ModalFormProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Dialog.Content className="z-50 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
            <div className="shrink-0 flex justify-end px-6 pt-4 sm:px-10">
              <CloseButton onClick={() => onOpenChange(false)} />
            </div>

            <div className="overflow-y-auto flex-1 px-6 pb-8 sm:px-10 sm:pb-10">
              <div className="flex flex-col items-center gap-3 pt-6 sm:pt-8">
                <Logo variant="dark" />

                <Heading
                  as="h2"
                  size="md"
                  bgScheme="white"
                  className="text-center"
                >
                  {heading}
                </Heading>
                {text && (
                  <Text variant="base" bgScheme="white" className="text-center">
                    {text}
                  </Text>
                )}
              </div>

              {children}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
