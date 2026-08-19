"use client";

import { X } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { profileTabsContent } from "../data/profileContent";

const SUCCESS_ICON_SRC = "/icons/icon-application-success.svg";

type ProfileOrderReturnSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  /** Refund ETA from the return mutation — absent until the refund is scheduled. */
  refundNote?: string;
};

export function ProfileOrderReturnSuccessDialog({
  open,
  onOpenChange,
  orderNumber,
  refundNote,
}: ProfileOrderReturnSuccessDialogProps) {
  const { toast } = useToast();
  const content = profileTabsContent.orders;
  const dialog = content.returnSuccessDialog;

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      toast({ title: content.copyOrderIdSuccess });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the order ID manually.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="relative flex flex-col items-center gap-6 text-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 text-darkblack"
            aria-label="Close"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>

          <span className="relative size-10 shrink-0" aria-hidden>
            <img src={SUCCESS_ICON_SRC} alt="" className="block size-full max-w-none" />
          </span>

          <div className="flex w-full flex-col gap-4">
            <DialogTitle className="font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
              {dialog.title}
            </DialogTitle>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {dialog.description}
            </p>
            {refundNote ? (
              <p className="font-gill text-base font-light leading-110 text-neutral500">
                {refundNote}
              </p>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1 font-gill text-base leading-110 text-darkblack">
            <span className="font-light">{content.orderIdLabel}</span>
            <span className="font-normal">{orderNumber}</span>
            <button
              type="button"
              onClick={() => void handleCopyOrderId()}
              className="text-darkblack"
              aria-label={content.copyOrderIdLabel}
            >
              <CopyIcon className="size-5" />
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
