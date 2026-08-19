"use client";

import { X } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";

const SUCCESS_ICON_SRC = "/icons/icon-application-success.svg";

type ProfileOrderCancelSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  /** Refund ETA from the cancellation mutation — absent for unpaid orders. */
  refundNote?: string;
};

type ProfileOrderCancelSuccessDialogBodyProps = {
  dialog: (typeof profileTabsContent.orders)["cancelSuccessDialog"];
  content: typeof profileTabsContent.orders;
  orderNumber: string;
  refundNote?: string;
  onCopyOrderId: () => void;
};

function ProfileOrderCancelSuccessDialogBody({
  dialog,
  content,
  orderNumber,
  refundNote,
  onCopyOrderId,
}: ProfileOrderCancelSuccessDialogBodyProps) {
  return (
    <>
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {dialog.description}
      </p>
      {refundNote ? (
        <p className="font-gill text-base font-light leading-110 text-neutral500">
          {refundNote}
        </p>
      ) : null}

      <span className="inline-flex items-center gap-1 font-gill text-base leading-110 text-darkblack">
        <span className="font-light">{content.orderIdLabel}</span>
        <span className="font-normal">{orderNumber}</span>
        <button
          type="button"
          onClick={() => void onCopyOrderId()}
          className="text-darkblack"
          aria-label={content.copyOrderIdLabel}
        >
          <CopyIcon className="size-5" />
        </button>
      </span>
    </>
  );
}

/** Cancel success bottom sheet on mobile, centered dialog on desktop */
export function ProfileOrderCancelSuccessDialog({
  open,
  onOpenChange,
  orderNumber,
  refundNote,
}: ProfileOrderCancelSuccessDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const content = profileTabsContent.orders;
  const dialog = content.cancelSuccessDialog;

  const handleClose = () => onOpenChange(false);

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

  const bodyProps: ProfileOrderCancelSuccessDialogBodyProps = {
    dialog,
    content,
    orderNumber,
    refundNote,
    onCopyOrderId: () => void handleCopyOrderId(),
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
          className="w-full gap-0 rounded-none border-0 bg-white p-0 sm:max-w-full [&>button]:hidden"
        >
          <div className="px-4 pt-6">
            <div className="relative flex items-center justify-between gap-4">
              <SheetTitle className="font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
                {dialog.title}
              </SheetTitle>
              <button
                type="button"
                onClick={handleClose}
                className="text-darkblack"
                aria-label="Close"
              >
                <X className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="relative size-10 shrink-0" aria-hidden>
                <img src={SUCCESS_ICON_SRC} alt="" className="block size-full max-w-none" />
              </span>

              <div className="flex w-full flex-col gap-4">
                <ProfileOrderCancelSuccessDialogBody {...bodyProps} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="relative flex flex-col items-center gap-6 text-center">
          <button
            type="button"
            onClick={handleClose}
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
            <ProfileOrderCancelSuccessDialogBody {...bodyProps} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
