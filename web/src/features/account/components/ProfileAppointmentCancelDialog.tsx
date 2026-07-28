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

type ProfileAppointmentCancelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: () => void;
  onConfirmCancel: () => void;
};

export function ProfileAppointmentCancelDialog({
  open,
  onOpenChange,
  onReschedule,
  onConfirmCancel,
}: ProfileAppointmentCancelDialogProps) {
  const content = profileTabsContent.appointments.cancelDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral300 pb-4">
          <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
            {content.title}
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
          <DetailOutlineButton type="button" className="w-full sm:flex-1" onClick={onReschedule}>
            {content.rescheduleLabel}
          </DetailOutlineButton>
          <DetailDarkButton type="button" className="w-full sm:flex-1" onClick={onConfirmCancel}>
            {content.confirmLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
