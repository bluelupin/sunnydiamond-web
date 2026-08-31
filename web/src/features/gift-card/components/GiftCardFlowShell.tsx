"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { cn } from "@/shared/utils/cn";
import { GiftCardFlowProvider, useGiftCardFlow } from "../context/GiftCardFlowContext";
import GiftCardFlowPanel from "./GiftCardFlowPanel";

type GiftCardFlowShellProps = {
  defaultOpen?: boolean;
};

const GiftCardFlowShellInner = ({ defaultOpen = true }: GiftCardFlowShellProps) => {
  const router = useRouter();
  const { resetFlow } = useGiftCardFlow();
  const [open, setOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleClose = () => {
    setOpen(false);
    resetFlow();
    router.push("/gifting#gift-card");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
      return;
    }
    setOpen(true);
  };

  if (isMobile) {
    return (
      <Drawer open={open} shouldScaleBackground={false} onOpenChange={handleOpenChange}>
        <DrawerContent
          className="flex min-h-0 max-h-[90vh] flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">Gift card</DrawerTitle>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <GiftCardFlowPanel onClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className={cn(
          "h-full w-full gap-0 border-0 p-0 shadow-none",
          RIGHT_PANEL_WIDTH_CLASS,
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Gift card</SheetTitle>
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <GiftCardFlowPanel onClose={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const GiftCardFlowShell = (props: GiftCardFlowShellProps) => (
  <GiftCardFlowProvider>
    <GiftCardFlowShellInner {...props} />
  </GiftCardFlowProvider>
);

export default GiftCardFlowShell;
