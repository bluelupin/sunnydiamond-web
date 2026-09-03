"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { NormalizedCareerApplicationFlow } from "@/services/careers/careers.types";
import { CAREERS_SUBMITTING_APPLICATION_LABEL } from "@/features/careers/constants/careersApplicationForm";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/shared/ui/drawer";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
import { cn } from "@/shared/utils/cn";
import FormFieldError from "@/shared/ui/FormFieldError";

type CareersSubmitConfirmationModalProps = {
  confirmSubmissionModal: NormalizedCareerApplicationFlow["applicationForm"]["confirmSubmissionModal"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

type ConfirmSubmissionContentProps = {
  confirmSubmissionModal: NormalizedCareerApplicationFlow["applicationForm"]["confirmSubmissionModal"];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
  titleElement: "dialog" | "drawer";
  variant: "mobile" | "desktop";
};

type ConfirmSubmissionActionsProps = {
  confirmSubmissionModal: NormalizedCareerApplicationFlow["applicationForm"]["confirmSubmissionModal"];
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant: "mobile" | "desktop";
};

const confirmSubmissionTitleClassName =
  "font-larken sm:!text-32 !text-2xl font-light leading-110 text-darkblack";

const confirmSubmissionDescriptionClassName =
  "max-w-[464px] font-gill text-base font-light leading-110 text-darkblack";

const submitButtonClassName = careersDarkCtaClassName;

const goBackButtonClassName = careersOutlineCtaClassName;

function ConfirmSubmissionActions({
  confirmSubmissionModal,
  isSubmitting,
  onClose,
  onConfirm,
  variant,
}: ConfirmSubmissionActionsProps) {
  const submitLabel = isSubmitting
    ? CAREERS_SUBMITTING_APPLICATION_LABEL
    : confirmSubmissionModal.submitLabel;

  const submitButton = (
    <button
      type="button"
      onClick={onConfirm}
      disabled={isSubmitting}
      className={cn(submitButtonClassName, variant === "mobile" ? "w-full" : "flex-1")}
    >
      <span className="relative z-10">{submitLabel}</span>
    </button>
  );

  const goBackButton = (
    <button
      type="button"
      onClick={onClose}
      disabled={isSubmitting}
      className={cn(goBackButtonClassName, variant === "mobile" ? "w-full" : "flex-1")}
    >
      <span className="relative z-10">{confirmSubmissionModal.goBackLabel}</span>
    </button>
  );

  if (variant === "mobile") {
    return (
      <div className="shrink-0 border-t border-neutral300 px-4 py-6">
        <div className="flex w-full flex-col gap-4">
          {submitButton}
          {goBackButton}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {goBackButton}
      {submitButton}
    </div>
  );
}

function ConfirmSubmissionContent({
  confirmSubmissionModal,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
  titleElement,
  variant,
}: ConfirmSubmissionContentProps) {
  const title = confirmSubmissionModal.title;
  const description = confirmSubmissionModal.description;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          {titleElement === "dialog" ? (
            <DialogTitle className={confirmSubmissionTitleClassName}>{title}</DialogTitle>
          ) : (
            <DrawerTitle className={confirmSubmissionTitleClassName}>{title}</DrawerTitle>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={confirmSubmissionModal.closeLabel}
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className="h-px w-full bg-neutral300" aria-hidden />
      </div>

      {titleElement === "dialog" ? (
        <DialogDescription className={confirmSubmissionDescriptionClassName}>
          {description}
        </DialogDescription>
      ) : (
        <DrawerDescription className={confirmSubmissionDescriptionClassName}>
          {description}
        </DrawerDescription>
      )}

      <FormFieldError message={errorMessage ?? undefined} />

      {variant === "desktop" ? (
        <ConfirmSubmissionActions
          confirmSubmissionModal={confirmSubmissionModal}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onConfirm={onConfirm}
          variant="desktop"
        />
      ) : null}
    </div>
  );
}

const CareersSubmitConfirmationModal = ({
  confirmSubmissionModal,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  errorMessage = null,
}: CareersSubmitConfirmationModalProps) => {
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

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleClose = () => handleOpenChange(false);

  const contentProps = {
    confirmSubmissionModal,
    isSubmitting,
    errorMessage,
    onClose: handleClose,
    onConfirm,
  };

  const actionProps = {
    confirmSubmissionModal,
    isSubmitting,
    onClose: handleClose,
    onConfirm,
  };

  const showMobileDrawer = open && isMobile;
  const showDesktopDialog = open && !isMobile;

  return (
    <>
      <Drawer open={showMobileDrawer} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
            <ConfirmSubmissionContent
              {...contentProps}
              titleElement="drawer"
              variant="mobile"
            />
          </div>
          <ConfirmSubmissionActions {...actionProps} variant="mobile" />
        </DrawerContent>
      </Drawer>

      <Dialog open={showDesktopDialog} onOpenChange={handleOpenChange}>
        <DialogContent
          hideCloseButton
          className="max-w-[512px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
        >
          <ConfirmSubmissionContent
            {...contentProps}
            titleElement="dialog"
            variant="desktop"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CareersSubmitConfirmationModal;
