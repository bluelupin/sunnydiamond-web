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

type ProfileOrderReturnDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSupport: () => void;
  onProceedToReturn: () => void;
};

export function ProfileOrderReturnDialog({
  open,
  onOpenChange,
  onContactSupport,
  onProceedToReturn,
}: ProfileOrderReturnDialogProps) {
  const content = profileTabsContent.orders.returnDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral300 pb-4">
          <DialogTitle className="font-larken font-light leading-110 text-darkblack">
            <span className="text-32">
              {content.title}
            </span>
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

        <p className="font-gill text-base font-light leading-110 text-neutral500">
          {content.description}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <DetailOutlineButton type="button" className="w-full sm:flex-1" onClick={onContactSupport}>
            {content.contactSupportLabel}
          </DetailOutlineButton>
          <DetailDarkButton type="button" className="w-full sm:flex-1" onClick={onProceedToReturn}>
            {content.proceedLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
