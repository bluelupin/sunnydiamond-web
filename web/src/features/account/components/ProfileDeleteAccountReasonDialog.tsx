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
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileDetailsContent } from "../data/profileContent";

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
  includeDescription?: boolean;
};

function DeleteAccountReasonForm({
  dialog,
  selectedReason,
  onSelectReason,
  comments,
  onCommentsChange,
  isSubmitting,
  mobile = false,
  includeDescription = true,
}: ReasonFormProps) {
  return (
    <>
      {includeDescription ? (
        <p
          className={
            mobile
              ? "font-gill text-base font-light leading-110 text-darkblack"
              : "font-gill text-base font-light leading-110 text-neutral500"
          }
        >
          {dialog.description}
        </p>
      ) : null}

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
            <label
              key={reason}
              className="flex items-center gap-2 font-gill text-base leading-110 text-darkblack"
            >
              <input
                type="radio"
                name="delete-account-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => onSelectReason(reason)}
                disabled={isSubmitting}
                className="size-6 shrink-0 accent-darkblack"
              />
              <span className="font-light">{reason}</span>
            </label>
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
    </>
  );
}

/** Figma 1480:21033 — delete account reason bottom sheet on mobile */
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
          overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
          className="flex max-h-[90vh] w-full flex-col gap-0 rounded-none border-0 bg-white p-0 sm:max-w-full [&>button]:hidden"
        >
          <div className="shrink-0 px-4 pt-6">
            <div className="flex items-center justify-between gap-4">
              <SheetTitle className="font-larken text-2xl font-light leading-110 text-darkblack">
                {dialog.title}
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

            <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-6">
            <div className="flex flex-col gap-6 pb-6">
              <SheetDescription className="font-gill text-base font-light leading-110 text-darkblack">
                {dialog.description}
              </SheetDescription>
              <DeleteAccountReasonForm {...formProps} mobile includeDescription={false} />
            </div>
          </div>

          <div className="shrink-0 border-t border-neutral300 px-4 pb-6 pt-6">
            {errorMessage ? (
              <p
                className="mb-4 font-gill text-sm font-light leading-110 text-red-700"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
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

        {errorMessage ? (
          <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <DetailDarkButton
          type="button"
          className="w-full"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : dialog.confirmLabel}
        </DetailDarkButton>
      </DialogContent>
    </Dialog>
  );
}
