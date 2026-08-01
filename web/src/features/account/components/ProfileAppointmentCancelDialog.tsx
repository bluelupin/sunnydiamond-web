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
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";

type ProfileAppointmentCancelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: () => void;
  onConfirmCancel: () => void;
};

/** Figma 1480:20323 — cancel appointment bottom sheet on mobile */
export function ProfileAppointmentCancelDialog({
  open,
  onOpenChange,
  onReschedule,
  onConfirmCancel,
}: ProfileAppointmentCancelDialogProps) {
  const isMobile = useIsMobile();
  const content = profileTabsContent.appointments.cancelDialog;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
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
                onClick={() => onOpenChange(false)}
                className="text-darkblack"
                aria-label="Close"
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
              <DetailDarkButton type="button" className="w-full" onClick={onConfirmCancel}>
                {content.confirmLabel}
              </DetailDarkButton>
              <DetailOutlineButton type="button" className="w-full" onClick={onReschedule}>
                {content.rescheduleLabel}
              </DetailOutlineButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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
