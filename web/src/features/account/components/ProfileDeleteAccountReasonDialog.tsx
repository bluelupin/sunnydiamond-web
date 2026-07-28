"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { profileDetailsContent } from "../data/profileContent";

type ProfileDeleteAccountReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { reason: string; comments: string }) => void;
  isSubmitting?: boolean;
};

export function ProfileDeleteAccountReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: ProfileDeleteAccountReasonDialogProps) {
  const dialog = profileDetailsContent.deleteAccount.reasonDialog;
  const [selectedReason, setSelectedReason] = useState<string>(dialog.reasons[0]);
  const [comments, setComments] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedReason(dialog.reasons[0]);
      setComments("");
    }
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    onConfirm({ reason: selectedReason, comments: comments.trim() });
  };

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

        <p className="font-gill text-base font-light leading-110 text-neutral500">
          {dialog.description}
        </p>

        <div className="flex flex-col gap-4">
          <p className="font-larken text-xl font-light leading-110 text-darkblack">
            {dialog.reasonLabel}
          </p>
          <div className="flex flex-col gap-4">
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
                  onChange={() => setSelectedReason(reason)}
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
          onChange={(event) => setComments(event.target.value)}
          placeholder={dialog.commentsPlaceholder}
          rows={4}
          disabled={isSubmitting}
          className="h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-[#999999]"
        />

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
