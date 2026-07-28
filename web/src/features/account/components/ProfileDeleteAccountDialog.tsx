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
import { profileDetailsContent } from "../data/profileContent";

type ProfileDeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
};

export function ProfileDeleteAccountDialog({
  open,
  onOpenChange,
  onDelete,
}: ProfileDeleteAccountDialogProps) {
  const dialog = profileDetailsContent.deleteAccount.dialog;

  const handleDelete = () => {
    onOpenChange(false);
    onDelete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
              {dialog.title}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-darkblack"
              aria-label="Close"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <p className="font-gill text-base font-light leading-110 text-darkblack">
          {dialog.description}
        </p>

        <div className="flex items-center gap-4">
          <DetailOutlineButton
            type="button"
            className="min-w-0 flex-1"
            onClick={() => onOpenChange(false)}
          >
            {dialog.cancelLabel}
          </DetailOutlineButton>
          <DetailDarkButton type="button" className="min-w-0 flex-1" onClick={handleDelete}>
            {dialog.confirmLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
