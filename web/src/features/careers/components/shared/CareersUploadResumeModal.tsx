"use client";

import { X } from "lucide-react";
import type { NormalizedCareerApplicationFlow } from "@/services/careers/careers.types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
import { cn } from "@/shared/utils/cn";

type CareersUploadResumeModalProps = {
  uploadResumeModal: NormalizedCareerApplicationFlow["applicationForm"]["uploadResumeModal"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOnlyUpload: () => void;
  onAutofillResume: () => void;
};

const CareersUploadResumeModal = ({
  uploadResumeModal,
  open,
  onOpenChange,
  onOnlyUpload,
  onAutofillResume,
}: CareersUploadResumeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName="max-md:bg-black/25 max-md:backdrop-blur-md"
        className="max-md:left-0 max-md:top-auto max-md:bottom-0 max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:data-[state=open]:animate-none max-md:data-[state=closed]:animate-none max-h-[90dvh] overflow-y-auto gap-0 rounded-none border-0 bg-white p-0 md:max-w-[512px] md:border md:border-neutral300 md:p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 px-4 pt-6 md:p-0">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
                {uploadResumeModal.title}
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                aria-label={uploadResumeModal.closeLabel}
              >
                <X className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <DialogDescription className="px-4 pb-2 font-gill text-base font-light leading-110 text-neutral500 md:max-w-[464px] md:p-0">
            {uploadResumeModal.description}
          </DialogDescription>

          <div className="flex flex-col gap-4 border-t border-neutral300/60 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] md:flex-row md:border-0 md:p-0">
            <button
              type="button"
              onClick={onAutofillResume}
              className={cn(careersDarkCtaClassName, "w-full shrink-0 md:order-2 md:w-auto md:flex-1")}
            >
              <span className="relative z-10">{uploadResumeModal.autofillResumeLabel}</span>
            </button>
            <button
              type="button"
              onClick={onOnlyUpload}
              className={cn(careersOutlineCtaClassName, "w-full shrink-0 md:order-1 md:w-auto md:flex-1")}
            >
              <span className="relative z-10">{uploadResumeModal.onlyUploadLabel}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareersUploadResumeModal;
