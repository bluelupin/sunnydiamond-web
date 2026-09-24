"use client";

import { usePathname, useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { cn } from "@/shared/utils/cn";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import GiftCardFlowPanel from "./GiftCardFlowPanel";

const GIFT_CARD_OVERLAY_CLASS = "bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";
const GIFT_CARD_MOBILE_QUERY = "(max-width: 1023px)";

const GiftCardFlowShell = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isPanelOpen, closePanel, resetFlow } = useGiftCardFlow();
  const { showMobileShell } = useResponsiveOverlayShell(isPanelOpen, GIFT_CARD_MOBILE_QUERY);

  const handleClose = () => {
    closePanel();
    resetFlow();
    if (pathname === "/gift-card") {
      router.push("/gifting#gift-card");
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
      return;
    }
  };

  if (showMobileShell) {
    return (
      <Drawer open={isPanelOpen} shouldScaleBackground={false} onOpenChange={handleOpenChange}>
        <DrawerContent
          overlayClassName={cn("z-[70]", GIFT_CARD_OVERLAY_CLASS)}
          className="z-[70] flex h-[90vh] min-h-0 max-h-[90vh] flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
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
    <Sheet open={isPanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName={cn("z-[70]", GIFT_CARD_OVERLAY_CLASS)}
        className={cn(
          "z-[70] h-full w-full gap-0 border-0 p-0 shadow-none",
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

export default GiftCardFlowShell;
