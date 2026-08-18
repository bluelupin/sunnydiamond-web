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
        className="max-w-[512px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
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

          <DialogDescription className="max-w-[464px] font-gill text-base font-light leading-110 text-neutral500">
            {uploadResumeModal.description}
          </DialogDescription>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onOnlyUpload}
              className={cn(careersOutlineCtaClassName, "flex-1")}
            >
              <span className="relative z-10">{uploadResumeModal.onlyUploadLabel}</span>
            </button>
            <button
              type="button"
              onClick={onAutofillResume}
              className={cn(careersDarkCtaClassName, "flex-1")}
            >
              <span className="relative z-10">{uploadResumeModal.autofillResumeLabel}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareersUploadResumeModal;
