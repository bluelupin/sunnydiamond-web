"use client";

import { X } from "lucide-react";
import { careersPageContent } from "@/features/careers/data/content";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";

type CareersSubmitConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const CareersSubmitConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
}: CareersSubmitConfirmationModalProps) => {
  const { confirmSubmissionModal } = careersPageContent.applicationForm;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[512px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
                {confirmSubmissionModal.title}
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                aria-label={confirmSubmissionModal.closeLabel}
              >
                <X className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <DialogDescription className="max-w-[464px] font-gill text-base font-light leading-110 text-darkblack">
            {confirmSubmissionModal.description}
          </DialogDescription>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-14 flex-1 items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-gray300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              {confirmSubmissionModal.goBackLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-14 flex-1 items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              {confirmSubmissionModal.submitLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareersSubmitConfirmationModal;
