"use client";

import { X } from "lucide-react";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { profileDetailsContent } from "../data/profileContent";

const SUCCESS_ICON_SRC = "/icons/icon-application-success.svg";

type ProfileDeleteAccountSuccessDialogProps = {
  open: boolean;
  /** Dismissing this dialog logs the customer out — the session is already gone. */
  onOpenChange: (open: boolean) => void;
};

export function ProfileDeleteAccountSuccessDialog({
  open,
  onOpenChange,
}: ProfileDeleteAccountSuccessDialogProps) {
  const dialog = profileDetailsContent.deleteAccount.successDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="relative flex flex-col items-center gap-6 text-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 text-darkblack"
            aria-label="Close"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>

          <span className="relative size-10 shrink-0" aria-hidden>
            <img src={SUCCESS_ICON_SRC} alt="" className="block size-full max-w-none" />
          </span>

          <div className="flex w-full flex-col gap-4">
            <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
              {dialog.title}
            </DialogTitle>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {dialog.description}
            </p>
          </div>

          <DetailDarkButton
            type="button"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            {dialog.ctaLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
