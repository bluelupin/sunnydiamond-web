"use client";

import { X } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";
import { pickResponsiveDialogCopy } from "../utils/pickResponsiveDialogCopy";

const SUCCESS_ICON_SRC = "/icons/icon-application-success.svg";

type ProfileOrderReturnSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
};

export function ProfileOrderReturnSuccessDialog({
  open,
  onOpenChange,
  orderNumber,
}: ProfileOrderReturnSuccessDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const content = profileTabsContent.orders;
  const dialog = content.returnSuccessDialog;
  const description = pickResponsiveDialogCopy(dialog, "description", isMobile);

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
            <p className="font-gill text-base font-light leading-110 text-neutral500">{description}</p>
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
              <CopyIcon className="size-4" />
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
