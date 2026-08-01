"use client";

import { X } from "lucide-react";
import {
  DetailDarkButton,
  DetailOutlineButton,
} from "@/features/products/components/detail/shared";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { profileTabsContent } from "../data/profileContent";

type ProfileDeleteAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
};

/** Figma 1480:21781 — delete address bottom sheet spacing */
export function ProfileDeleteAddressDialog({
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: ProfileDeleteAddressDialogProps) {
  const content = profileTabsContent.addresses.deleteDialog;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDeleting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className="w-full gap-0 rounded-none border-0 bg-white p-0 sm:max-w-full [&>button]:hidden"
      >
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className="font-larken text-2xl font-light leading-110 text-darkblack">
              {content.title}
            </SheetTitle>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="text-darkblack"
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />

          <SheetDescription className="mt-6 font-gill text-base font-light leading-110 text-darkblack">
            {content.description}
          </SheetDescription>
        </div>

        <div className="mt-12 border-t border-neutral300 px-4 pb-6 pt-6">
          <div className="flex flex-col gap-4">
            <DetailDarkButton
              type="button"
              className="w-full"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : content.confirmLabel}
            </DetailDarkButton>
            <DetailOutlineButton
              type="button"
              className="w-full"
              onClick={() => handleOpenChange(false)}
              disabled={isDeleting}
            >
              {content.cancelLabel}
            </DetailOutlineButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
