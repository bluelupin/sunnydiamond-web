"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { NormalizedCareerApplicationFlow } from "@/services/careers/careers.types";
import type { CareerJob } from "@/features/careers/types";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { cn } from "@/shared/utils/cn";
import CareersJobIdChip from "./CareersJobIdChip";
import CareersJobMetaRow from "./CareersJobMetaRow";

type CareersApplyOptionsModalProps = {
  job: CareerJob;
  applyModal: NormalizedCareerApplicationFlow["jobDetails"]["applyModal"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAutofillResume: (file: File) => void;
  onApplyManually: () => void;
  onApplyLinkedIn: () => void;
};

const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const primaryButtonClass =
  "inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

const secondaryButtonClass =
  "inline-flex h-14 w-full items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-gray300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

const linkedInButtonClass =
  "inline-flex flex-col items-center border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

type ApplyOptionsActionsProps = {
  applyModal: NormalizedCareerApplicationFlow["jobDetails"]["applyModal"];
  onAutofillClick: () => void;
  onApplyManually: () => void;
  onApplyLinkedIn: () => void;
  onClose: () => void;
  layout: "mobile-footer" | "desktop";
};

function ApplyOptionsActions({
  applyModal,
  onAutofillClick,
  onApplyManually,
  onApplyLinkedIn,
  onClose,
  layout,
}: ApplyOptionsActionsProps) {
  const handleApplyManually = () => {
    onApplyManually();
    onClose();
  };

  const handleApplyLinkedIn = () => {
    onApplyLinkedIn();
    onClose();
  };

  const buttons = (
    <>
      <button type="button" onClick={onAutofillClick} className={primaryButtonClass}>
        {applyModal.autofillResumeLabel}
      </button>
      <button type="button" onClick={handleApplyManually} className={secondaryButtonClass}>
        {applyModal.applyManuallyLabel}
      </button>
      <button type="button" onClick={handleApplyLinkedIn} className={linkedInButtonClass}>
        {applyModal.applyLinkedInLabel}
      </button>
    </>
  );

  if (layout === "mobile-footer") {
    return (
      <div className="shrink-0">
        <div
          className="h-[71px] bg-gradient-to-b from-transparent to-white"
          aria-hidden
        />
        <div className="border-t border-neutral300 bg-white px-4 py-6">
          <div className="flex flex-col items-center gap-4">{buttons}</div>
        </div>
      </div>
    );
  }

  return <div className="flex flex-col items-center gap-4">{buttons}</div>;
}

type ApplyOptionsBodyProps = {
  job: CareerJob;
  applyModal: NormalizedCareerApplicationFlow["jobDetails"]["applyModal"];
  onClose: () => void;
  variant: "mobile" | "desktop";
};

function ApplyOptionsBody({
  job,
  applyModal,
  onClose,
  variant,
}: ApplyOptionsBodyProps) {
  const isMobile = variant === "mobile";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={cn(
              "font-larken font-light leading-110 text-darkblack",
              isMobile ? "text-2xl" : "text-32",
            )}
          >
            {applyModal.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            aria-label={applyModal.closeLabel}
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className="h-px w-full bg-neutral300" aria-hidden />
      </div>

      <div
        className={cn(
          "flex flex-col gap-4",
          isMobile ? "bg-gray200 p-4" : "bg-gray300 p-4",
        )}
      >
        <div
          className={cn(
            "flex gap-3",
            isMobile ? "flex-wrap items-center" : "items-center justify-between gap-4",
          )}
        >
          <p
            className={cn(
              "font-gill font-normal leading-110 text-darkblack",
              isMobile ? "text-base" : "text-xl",
            )}
          >
            {job.title}
          </p>
          <CareersJobIdChip
            jobCode={job.jobCode}
            alwaysInline
            surface={isMobile ? "listing" : "white"}
          />
        </div>
        <CareersJobMetaRow job={job} />
      </div>
    </div>
  );
}

const CareersApplyOptionsModal = ({
  job,
  applyModal,
  open,
  onOpenChange,
  onAutofillResume,
  onApplyManually,
  onApplyLinkedIn,
}: CareersApplyOptionsModalProps) => {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const showMobileDrawer = open && isMobile;
  const showDesktopDialog = open && !isMobile;

  const handleClose = () => onOpenChange(false);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    onAutofillResume(file);
    onOpenChange(false);
    event.target.value = "";
  };

  const handleAutofillClick = () => {
    resumeInputRef.current?.click();
  };

  const hiddenResumeInput = (
    <input
      ref={resumeInputRef}
      type="file"
      accept={RESUME_ACCEPT}
      className="hidden"
      onChange={handleResumeChange}
    />
  );

  const actionProps = {
    applyModal,
    onAutofillClick: handleAutofillClick,
    onApplyManually,
    onApplyLinkedIn,
    onClose: handleClose,
  };

  return (
    <>
      {hiddenResumeInput}
      <Drawer
        open={showMobileDrawer}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
      >
        <DrawerContent
          className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">{applyModal.title}</DrawerTitle>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-6 pb-4">
            <ApplyOptionsBody
              job={job}
              applyModal={applyModal}
              onClose={handleClose}
              variant="mobile"
            />
          </div>
          <ApplyOptionsActions {...actionProps} layout="mobile-footer" />
        </DrawerContent>
      </Drawer>

      <Dialog open={showDesktopDialog} onOpenChange={onOpenChange}>
        <DialogContent
          hideCloseButton
          className="max-w-[520px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
        >
          <DialogTitle className="sr-only">{applyModal.title}</DialogTitle>
          <div className="flex flex-col gap-6">
            <ApplyOptionsBody
              job={job}
              applyModal={applyModal}
              onClose={handleClose}
              variant="desktop"
            />
            <ApplyOptionsActions {...actionProps} layout="desktop" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CareersApplyOptionsModal;
