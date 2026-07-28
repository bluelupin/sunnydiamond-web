"use client";

import { X } from "lucide-react";
import {
  DetailDarkButton,
  DetailOutlineButton,
} from "@/features/products/components/detail/shared";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { profileTabsContent } from "../data/profileContent";

type ProfileDeleteAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
};

export function ProfileDeleteAddressDialog({
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: ProfileDeleteAddressDialogProps) {
  const content = profileTabsContent.addresses.deleteDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
              {content.title}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-darkblack"
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <p className="font-gill text-base font-light leading-110 text-darkblack">
          {content.description}
        </p>

        <div className="flex items-center gap-4">
          <DetailOutlineButton
            type="button"
            className="min-w-0 flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {content.cancelLabel}
          </DetailOutlineButton>
          <DetailDarkButton
            type="button"
            className="min-w-0 flex-1"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : content.confirmLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
