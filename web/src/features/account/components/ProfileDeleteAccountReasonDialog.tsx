"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import FormRadioOption from "@/shared/ui/FormRadioOption";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileDetailsContent } from "../data/profileContent";
import FormFieldError from "@/shared/ui/FormFieldError";

type ProfileDeleteAccountReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { reason: string; comments: string }) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

type ReasonFormProps = {
  dialog: typeof profileDetailsContent.deleteAccount.reasonDialog;
  selectedReason: string;
  onSelectReason: (reason: string) => void;
  comments: string;
  onCommentsChange: (comments: string) => void;
  isSubmitting: boolean;
  mobile?: boolean;
};

function DeleteAccountReasonForm({
  dialog,
  selectedReason,
  onSelectReason,
  comments,
  onCommentsChange,
  isSubmitting,
  mobile = false,
}: ReasonFormProps) {
  const description = mobile ? dialog.descriptionMobile : dialog.description;

  return (
    <div className="flex flex-col gap-6">
      <p
        className={
          mobile
            ? "font-gill text-base font-light leading-110 text-darkblack"
            : "font-gill text-base font-light leading-110 text-neutral500"
        }
      >
        {description}
      </p>

      <div className="flex flex-col gap-4">
        <p
          className={
            mobile
              ? "font-gill text-xl font-normal leading-110 text-darkblack"
              : "font-larken text-xl font-light leading-110 text-darkblack"
          }
        >
          {dialog.reasonLabel}
        </p>
        <div className={mobile ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
          {dialog.reasons.map((reason) => (
            <FormRadioOption
              key={reason}
              name="delete-account-reason"
              value={reason}
              label={reason}
              checked={selectedReason === reason}
              disabled={isSubmitting}
              onSelect={onSelectReason}
              labelClassName={
                mobile ? "text-darkblack" : "text-[#2B2B2B]"
              }
            />
          ))}
        </div>
      </div>

      <textarea
        value={comments}
        onChange={(event) => onCommentsChange(event.target.value)}
        placeholder={dialog.commentsPlaceholder}
        rows={4}
        disabled={isSubmitting}
        className="h-[100px] w-full resize-none bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-gray600"
      />
    </div>
  );
}

/** Figma 1480:58423 desktop / 1480:21033 mobile — delete account reason drawer */
export function ProfileDeleteAccountReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  errorMessage,
}: ProfileDeleteAccountReasonDialogProps) {
  const isMobile = useIsMobile();
  const dialog = profileDetailsContent.deleteAccount.reasonDialog;
  const [selectedReason, setSelectedReason] = useState<string>(dialog.reasons[0]);
  const [comments, setComments] = useState("");

  const dialogTitle = isMobile ? dialog.titleMobile : dialog.title;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }

    if (!nextOpen) {
      setSelectedReason(dialog.reasons[0]);
      setComments("");
    }
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    onConfirm({ reason: selectedReason, comments: comments.trim() });
  };

  const formProps = {
    dialog,
    selectedReason,
    onSelectReason: setSelectedReason,
    comments,
    onCommentsChange: setComments,
    isSubmitting,
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          overlayClassName="z-[90] bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
          className="z-[90] flex max-h-[90vh] w-full flex-col gap-0 rounded-none border-0 bg-white p-0 sm:max-w-full [&>button]:hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar">
            <div className="px-4 pt-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <SheetTitle className="font-larken text-2xl font-light leading-110 text-darkblack">
                    {dialogTitle}
                  </SheetTitle>
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    className="text-darkblack"
                    aria-label="Close"
                    disabled={isSubmitting}
                  >
                    <X className="size-6" strokeWidth={1.5} aria-hidden />
                  </button>
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>
            </div>

            <div className="px-4 pt-6">
              <SheetDescription className="sr-only">{dialog.descriptionMobile}</SheetDescription>
              <DeleteAccountReasonForm {...formProps} mobile />
            </div>
          </div>

          <div className="pointer-events-none h-[71px] shrink-0 bg-gradient-to-b from-transparent to-white" aria-hidden />

          <div className="shrink-0 border-t border-neutral300 px-4 pb-6 pt-6">
            <FormFieldError message={errorMessage ?? undefined} className="mb-4" />
            <DetailDarkButton
              type="button"
              className="w-full"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : dialog.confirmLabel}
            </DetailDarkButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        elevated
        hideCloseButton
        className="max-w-[520px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="font-larken text-[32px] font-light leading-110 text-darkblack">
                  {dialogTitle}
                </DialogTitle>
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="text-darkblack"
                  aria-label="Close"
                  disabled={isSubmitting}
                >
                  <X className="size-6" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
              <div className="h-px w-full bg-neutral300" aria-hidden />
            </div>

            <DeleteAccountReasonForm {...formProps} />
          </div>

          <div className="flex flex-col gap-4">
            <FormFieldError message={errorMessage ?? undefined} />
            <DetailDarkButton
              type="button"
              className="w-full"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : dialog.confirmLabel}
            </DetailDarkButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
