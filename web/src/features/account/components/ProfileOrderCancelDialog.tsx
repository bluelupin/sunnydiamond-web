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
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";

type ProfileOrderCancelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSupport: () => void;
  onProceedToCancel: () => void;
};

/** Cancel order bottom sheet on mobile, centered dialog on desktop */
export function ProfileOrderCancelDialog({
  open,
  onOpenChange,
  onContactSupport,
  onProceedToCancel,
}: ProfileOrderCancelDialogProps) {
  const isMobile = useIsMobile();
  const content = profileTabsContent.orders.cancelDialog;

  const handleClose = () => onOpenChange(false);

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
                <span className="md:text-32 text-2xl">
                  {content.title}
                </span>
              </SheetTitle>
              <button
                type="button"
                onClick={handleClose}
                className="text-darkblack"
                aria-label="Close"
              >
                <X className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />

            <p className="mt-6 font-gill text-base font-light leading-110 text-neutral500">
              {content.description}
            </p>
          </div>

          <div className="mt-12 border-t border-neutral300 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-6">
            <div className="flex flex-col gap-4">
              <DetailOutlineButton type="button" className="w-full" onClick={onContactSupport}>
                {content.contactSupportLabel}
              </DetailOutlineButton>
              <DetailDarkButton type="button" className="w-full" onClick={onProceedToCancel}>
                {content.proceedLabel}
              </DetailDarkButton>
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
            <span className="md:text-32 text-2xl">
              {content.title}
            </span>
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
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
          <DetailDarkButton type="button" className="w-full sm:flex-1" onClick={onProceedToCancel}>
            {content.proceedLabel}
          </DetailDarkButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
