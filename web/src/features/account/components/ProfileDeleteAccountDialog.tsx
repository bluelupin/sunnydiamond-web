"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import { appointmentFieldClassName } from "@/shared/constants/appointmentForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useToast } from "@/shared/hooks/use-toast";
import { profileDetailsContent } from "../data/profileContent";

type ProfileDeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileDeleteAccountDialog({
  open,
  onOpenChange,
}: ProfileDeleteAccountDialogProps) {
  const { toast } = useToast();
  const dialog = profileDetailsContent.deleteAccount.dialog;
  const [selectedReason, setSelectedReason] = useState<string>(dialog.reasons[0]);
  const [otherReason, setOtherReason] = useState("");

  const handleSubmit = () => {
    onOpenChange(false);
    toast({
      title: dialog.unavailableTitle,
      description: dialog.unavailableDescription,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none">
        <div className="flex items-start justify-between gap-4 border-b border-neutral300 pb-4">
          <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
            {dialog.title}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-darkblack"
            aria-label="Close"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <p className="font-gill text-base font-light leading-110 text-neutral500">
          {dialog.description}
        </p>

        <div className="space-y-4">
          <p className="font-larken text-xl font-light leading-110 text-darkblack">
            {dialog.reasonLabel}
          </p>
          <div className="space-y-4">
            {dialog.reasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 font-gill text-base leading-110 text-darkblack"
              >
                <input
                  type="radio"
                  name="delete-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="size-6 accent-darkblack"
                />
                <span className="font-light">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea
          value={otherReason}
          onChange={(event) => setOtherReason(event.target.value)}
          placeholder={dialog.otherPlaceholder}
          rows={4}
          className={`${appointmentFieldClassName} min-h-[100px] resize-none py-3`}
        />

        <DetailDarkButton type="button" className="w-full" onClick={handleSubmit}>
          {dialog.submitLabel}
        </DetailDarkButton>
      </DialogContent>
    </Dialog>
  );
}
