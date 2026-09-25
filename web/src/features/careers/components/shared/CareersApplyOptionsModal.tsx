"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { NormalizedCareerApplicationFlow } from "@/services/careers/careers.types";
import type { CareerJob } from "@/features/careers/types";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
import { cn } from "@/shared/utils/cn";
import { CAREERS_AUTOFILL_RESUME_ACCEPT } from "@/features/careers/constants/careersApplicationForm";
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

const primaryButtonClass = cn(careersDarkCtaClassName, "w-full");

const secondaryButtonClass = cn(careersOutlineCtaClassName, "w-full");

type ApplyOptionsActionsProps = {
  applyModal: NormalizedCareerApplicationFlow["jobDetails"]["applyModal"];
  linkedinApplyUrl?: string;
  onAutofillClick: () => void;
  onApplyManually: () => void;
  onApplyLinkedIn: () => void;
  onClose: () => void;
  layout: "mobile-footer" | "desktop";
};

function ApplyOptionsActions({
  applyModal,
  linkedinApplyUrl,
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

  const buttonStack = (
    <div className="flex w-full flex-col items-center gap-4">
      <button type="button" onClick={onAutofillClick} className={primaryButtonClass}>
        <span className="relative z-10">{applyModal.autofillResumeLabel}</span>
      </button>
      <button type="button" onClick={handleApplyManually} className={secondaryButtonClass}>
        <span className="relative z-10">{applyModal.applyManuallyLabel}</span>
      </button>
      {linkedinApplyUrl ? (
        <DetailTextLink onClick={handleApplyLinkedIn}>{applyModal.applyLinkedInLabel}</DetailTextLink>
      ) : null}
    </div>
  );

  if (layout === "mobile-footer") {
    return (
      <div
        className="flex w-full shrink-0 flex-col items-center justify-center border-t border-neutral300 bg-white px-4 py-6"
      >
        {buttonStack}
      </div>
    );
  }

  return buttonStack;
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2
              className={cn(
                "font-larken font-light leading-110 text-darkblack",
                isMobile ? "text-2xl" : "text-32",
              )}
            >
              {applyModal.title}
            </h2>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {applyModal.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            aria-label={applyModal.closeLabel}
          >
            <X className="size-6" strokeWidth={1} aria-hidden />
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

    event.target.value = "";
    onAutofillResume(file);
    onOpenChange(false);
  };

  const handleAutofillClick = () => {
    resumeInputRef.current?.click();
  };

  const hiddenResumeInput = (
    <input
      ref={resumeInputRef}
      type="file"
      accept={CAREERS_AUTOFILL_RESUME_ACCEPT}
      className="hidden"
      onChange={handleResumeChange}
    />
  );

  const actionProps = {
    applyModal,
    linkedinApplyUrl: job.linkedinApplyUrl,
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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 DrawerVerticleScrollbar">
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
