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
import { profileDetailsContent } from "../data/profileContent";

type ProfileDeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
};

/** Figma 1480:20797 — delete account bottom sheet on mobile */
export function ProfileDeleteAccountDialog({
  open,
  onOpenChange,
  onDelete,
}: ProfileDeleteAccountDialogProps) {
  const isMobile = useIsMobile();
  const dialog = profileDetailsContent.deleteAccount.dialog;

  const handleDelete = () => {
    onOpenChange(false);
    onDelete?.();
  };

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
                {dialog.title}
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
              {dialog.description}
            </SheetDescription>
          </div>

          <div className="mt-12 border-t border-neutral300 px-4 pb-6 pt-6">
            <div className="flex flex-col gap-4">
              <DetailDarkButton type="button" className="w-full" onClick={handleDelete}>
                {dialog.confirmLabel}
              </DetailDarkButton>
              <DetailOutlineButton
                type="button"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                {dialog.cancelLabel}
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
