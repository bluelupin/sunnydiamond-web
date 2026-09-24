"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import type { OrderActionReason } from "@/services/customer/order-actions.types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";
import FormFieldError from "@/shared/ui/FormFieldError";

type ProfileOrderCancelReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { reason: string; comments: string }) => void;
  /** Admin-configured reasons, with the `profileContent` list as offline fallback. */
  reasons: OrderActionReason[];
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

type ProfileOrderCancelReasonDialogBodyProps = {
  dialog: (typeof profileTabsContent.orders)["cancelReasonDialog"];
  ordersContent: typeof profileTabsContent.orders;
  reasons: OrderActionReason[];
  selectedReason: OrderActionReason | undefined;
  comments: string;
  isSubmitting: boolean;
  commentMissing: boolean;
  errorMessage?: string | null;
  onSelectReason: (code: string) => void;
  onCommentsChange: (value: string) => void;
  onConfirm: () => void;
};

function ProfileOrderCancelReasonDialogBody({
  dialog,
  ordersContent,
  reasons,
  selectedReason,
  comments,
  isSubmitting,
  commentMissing,
  errorMessage,
  onSelectReason,
  onCommentsChange,
  onConfirm,
}: ProfileOrderCancelReasonDialogBodyProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {dialog.description}
      </p>

      <div className="flex flex-col gap-4">
        <p className="font-larken text-xl font-light leading-110 text-darkblack">
          {dialog.reasonLabel}
        </p>
        <div className="flex flex-col gap-4">
          {reasons.map((reason) => (
            <label
              key={reason.code}
              className="flex items-center gap-2 font-gill text-base leading-110 text-darkblack"
            >
              <input
                type="radio"
                name="cancel-order-reason"
                value={reason.code}
                checked={selectedReason?.code === reason.code}
                onChange={() => onSelectReason(reason.code)}
                disabled={isSubmitting}
                className="size-6 shrink-0 accent-darkblack"
              />
              <span className="font-light">{reason.label}</span>
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
        className="h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-[#999999]"
      />

      {commentMissing ? (
        <p className="font-gill text-sm font-light leading-110 text-neutral500">
          {ordersContent.otherReasonRequiredMessage}
        </p>
      ) : null}

      <FormFieldError message={errorMessage ?? undefined} />

      <DetailDarkButton
        type="button"
        className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onConfirm}
        disabled={isSubmitting || commentMissing || !selectedReason}
      >
        {isSubmitting ? "Submitting..." : dialog.confirmLabel}
      </DetailDarkButton>
    </div>
  );
}

/** Cancel reason bottom sheet on mobile, centered dialog on desktop */
export function ProfileOrderCancelReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  reasons,
  isSubmitting = false,
  errorMessage,
}: ProfileOrderCancelReasonDialogProps) {
  const isMobile = useIsMobile();
  const ordersContent = profileTabsContent.orders;
  const dialog = ordersContent.cancelReasonDialog;
  const [selectedCode, setSelectedCode] = useState("");
  const [comments, setComments] = useState("");

  const selectedReason = reasons.find((reason) => reason.code === selectedCode) ?? reasons[0];
  const commentMissing = Boolean(selectedReason?.requiresComment) && !comments.trim();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedCode("");
      setComments("");
    }
    onOpenChange(nextOpen);
  };

  const handleClose = () => handleOpenChange(false);

  const handleConfirm = () => {
    if (!selectedReason) {
      return;
    }

    onConfirm({ reason: selectedReason.label, comments: comments.trim() });
  };

  const bodyProps: ProfileOrderCancelReasonDialogBodyProps = {
    dialog,
    ordersContent,
    reasons,
    selectedReason,
    comments,
    isSubmitting,
    commentMissing,
    errorMessage,
    onSelectReason: setSelectedCode,
    onCommentsChange: setComments,
    onConfirm: handleConfirm,
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
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <SheetTitle className="font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
                  {dialog.title}
                </SheetTitle>
                <button
                  type="button"
                  onClick={handleClose}
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

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-6">
            <ProfileOrderCancelReasonDialogBody {...bodyProps} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-h-[90vh] max-w-[520px] gap-6 overflow-y-auto border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
              {dialog.title}
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="text-darkblack"
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <ProfileOrderCancelReasonDialogBody {...bodyProps} />
      </DialogContent>
    </Dialog>
  );
}
