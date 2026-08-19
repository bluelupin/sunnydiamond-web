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
import { profileTabsContent } from "../data/profileContent";

type ProfileOrderReturnReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { reason: string; comments: string }) => void;
  /** Admin-configured reasons, with the `profileContent` list as offline fallback. */
  reasons: OrderActionReason[];
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function ProfileOrderReturnReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  reasons,
  isSubmitting = false,
  errorMessage,
}: ProfileOrderReturnReasonDialogProps) {
  const ordersContent = profileTabsContent.orders;
  const dialog = ordersContent.returnReasonDialog;
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

  const handleConfirm = () => {
    if (!selectedReason) {
      return;
    }

    onConfirm({ reason: selectedReason.label, comments: comments.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
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
                  name="return-order-reason"
                  value={reason.code}
                  checked={selectedReason?.code === reason.code}
                  onChange={() => setSelectedCode(reason.code)}
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
          onChange={(event) => setComments(event.target.value)}
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

        {errorMessage ? (
          <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <DetailDarkButton
          type="button"
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleConfirm}
          disabled={isSubmitting || commentMissing || !selectedReason}
        >
          {isSubmitting ? "Submitting..." : dialog.confirmLabel}
        </DetailDarkButton>
      </DialogContent>
    </Dialog>
  );
}
