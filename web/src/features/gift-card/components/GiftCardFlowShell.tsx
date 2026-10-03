"use client";

import { usePathname, useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { cn } from "@/shared/utils/cn";
import { INLINE_CUSTOM_SELECT_LISTBOX_SELECTOR } from "@/shared/ui/InlineCustomSelect";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import GiftCardFlowPanel from "./GiftCardFlowPanel";

const GIFT_CARD_OVERLAY_CLASS = "bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";
/** Bottom drawer on phone only; tablet and desktop use the right-side sheet. */
const GIFT_CARD_MOBILE_QUERY = "(max-width: 767px)";
const RAZORPAY_CONTAINER_SELECTOR = ".razorpay-container";
// The open panel sets `pointer-events: none` on <body>, which Razorpay's popup would inherit.
const GIFT_CARD_PORTAL_CLICKABLE_CSS = `
${RAZORPAY_CONTAINER_SELECTOR}, ${INLINE_CUSTOM_SELECT_LISTBOX_SELECTOR} {
  pointer-events: auto !important;
}
`;

// Portaled overlays (Razorpay, Contact-style selects) must not dismiss the sheet/drawer.
const keepPanelOpenForPortaledOverlay = (event: Event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (
    event.target.closest(RAZORPAY_CONTAINER_SELECTOR)
    || event.target.closest(INLINE_CUSTOM_SELECT_LISTBOX_SELECTOR)
  ) {
    event.preventDefault();
  }
};

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

  const portalClickableStyle = isPanelOpen ? <style>{GIFT_CARD_PORTAL_CLICKABLE_CSS}</style> : null;

  if (showMobileShell) {
    return (
      <>
        {portalClickableStyle}
        <Drawer open={isPanelOpen} shouldScaleBackground={false} onOpenChange={handleOpenChange}>
          <DrawerContent
            overlayClassName={cn("z-[70]", GIFT_CARD_OVERLAY_CLASS)}
            className="z-[70] flex h-[90vh] min-h-0 max-h-[90vh] flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
            onPointerDownOutside={keepPanelOpenForPortaledOverlay}
            onInteractOutside={keepPanelOpenForPortaledOverlay}
            onFocusOutside={keepPanelOpenForPortaledOverlay}
          >
            <DrawerTitle className="sr-only">Gift card</DrawerTitle>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <GiftCardFlowPanel onClose={handleClose} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {portalClickableStyle}
      <Sheet open={isPanelOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          overlayClassName={cn("z-[70]", GIFT_CARD_OVERLAY_CLASS)}
          className={cn(
            "z-[70] h-full w-full gap-0 border-0 p-0 shadow-none",
            RIGHT_PANEL_WIDTH_CLASS,
            "[&>button]:hidden",
          )}
          onPointerDownOutside={keepPanelOpenForPortaledOverlay}
          onInteractOutside={keepPanelOpenForPortaledOverlay}
          onFocusOutside={keepPanelOpenForPortaledOverlay}
        >
          <SheetTitle className="sr-only">Gift card</SheetTitle>
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <GiftCardFlowPanel onClose={handleClose} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GiftCardFlowShell;
