"use client";

import type { ReactNode } from "react";
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
import { pickResponsiveDialogCopy } from "../utils/pickResponsiveDialogCopy";

const SUCCESS_ICON_SRC = "/icons/icon-application-success.svg";

type ProfileOrderCancelSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
};

type ProfileOrderCancelSuccessDialogBodyProps = {
  dialog: (typeof profileTabsContent.orders)["cancelSuccessDialog"];
  content: typeof profileTabsContent.orders;
  orderNumber: string;
  description: string;
  descriptionDesktopLines?: readonly string[];
  onCopyOrderId: () => void;
  title?: ReactNode;
  mobileLayout?: boolean;
};

function ProfileOrderCancelSuccessDialogBody({
  content,
  orderNumber,
  description,
  descriptionDesktopLines,
  onCopyOrderId,
  title,
  mobileLayout = false,
}: ProfileOrderCancelSuccessDialogBodyProps) {
  const orderIdRow = (
    <span className="inline-flex items-center justify-center gap-1 font-gill text-base leading-110 text-darkblack">
      <span className="font-light">{content.orderIdLabel}</span>
      <span className="font-normal">{orderNumber}</span>
      <button
        type="button"
        onClick={() => void onCopyOrderId()}
        className="inline-flex shrink-0 text-darkblack"
        aria-label={content.copyOrderIdLabel}
      >
        <CopyIcon className="size-4" />
      </button>
    </span>
  );

  if (mobileLayout) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        {title}
        <p className="max-w-[19rem] text-center font-gill text-base font-light leading-110 text-neutral500">
          {description}
        </p>
        <div className="pt-2">{orderIdRow}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      {title}
      <p className="w-full text-center font-gill text-base font-light leading-110 text-darkblack">
        {descriptionDesktopLines?.length
          ? descriptionDesktopLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))
          : description}
      </p>
      <div className="flex w-full justify-center">{orderIdRow}</div>
    </div>
  );
}

/** Cancel success bottom sheet on mobile, centered dialog on desktop */
export function ProfileOrderCancelSuccessDialog({
  open,
  onOpenChange,
  orderNumber,
}: ProfileOrderCancelSuccessDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const content = profileTabsContent.orders;
  const dialog = content.cancelSuccessDialog;
  const titleCopy = pickResponsiveDialogCopy(dialog, "title", isMobile);
  const description = pickResponsiveDialogCopy(dialog, "description", isMobile);

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
    description,
    descriptionDesktopLines: dialog.descriptionDesktopLines,
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
          <div className="relative px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-8 text-center">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-6 text-darkblack"
              aria-label="Close"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>

            <div className="flex flex-col items-center gap-6">
              <span className="relative size-10 shrink-0" aria-hidden>
                <img src={SUCCESS_ICON_SRC} alt="" className="block size-full max-w-none" />
              </span>

              <ProfileOrderCancelSuccessDialogBody
                {...bodyProps}
                mobileLayout
                title={
                  <SheetTitle className="font-larken text-2xl font-light leading-110 text-darkblack">
                    {titleCopy}
                  </SheetTitle>
                }
              />
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
        className="max-w-[520px] gap-0 border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="relative flex w-full flex-col items-center gap-4 text-center">
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

          <ProfileOrderCancelSuccessDialogBody
            {...bodyProps}
            title={
              <DialogTitle className="w-full text-center font-larken text-32 font-light leading-110 text-darkblack">
                {titleCopy}
              </DialogTitle>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
