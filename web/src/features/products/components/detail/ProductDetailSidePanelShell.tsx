"use client";

import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { RIGHT_PANEL_ASIDE_MD_CLASS, RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";

export const productDetailSidePanelOverlayClassName =
  "min-h-0 flex-1 bg-[#1E1E1E]/75 animate-in fade-in duration-300 max-md:min-h-12";

export const productDetailSidePanelAsideClassName =
  `flex min-h-0 w-full ${RIGHT_PANEL_ASIDE_MD_CLASS} max-w-full shrink-0 flex-col overflow-hidden bg-white shadow-2xl max-md:max-h-[calc(100dvh-3rem)] max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300 md:h-full md:animate-in md:slide-in-from-right md:duration-300`;

const PDP_SIDE_PANEL_MOBILE_QUERY = "(max-width: 767px)";

const PDP_SIDE_PANEL_OVERLAY_CLASS = "z-[70] bg-[#1E1E1E]/75";

const PDP_SIDE_PANEL_SHELL_CLASS =
  "z-[70] flex min-h-0 flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl";

type ProductDetailSidePanelShellProps = {
  open: boolean;
  onClose: () => void;
  overlayAriaLabel: string;
  dialogAriaLabel: string;
  children: ReactNode;
  asideClassName?: string;
  overlayClassName?: string;
};

export function ProductDetailSidePanelShell({
  open,
  onClose,
  dialogAriaLabel,
  children,
  asideClassName,
  overlayClassName,
}: ProductDetailSidePanelShellProps) {
  const { showMobileShell } = useResponsiveOverlayShell(open, PDP_SIDE_PANEL_MOBILE_QUERY);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const panelClassName = cn(PDP_SIDE_PANEL_SHELL_CLASS, asideClassName);
  const overlayClass = cn(PDP_SIDE_PANEL_OVERLAY_CLASS, overlayClassName);

  if (showMobileShell) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent
          overlayClassName={overlayClass}
          className={cn(
            panelClassName,
            "mt-12 max-h-[calc(100dvh-3rem)] w-full rounded-none [&>div:first-child]:hidden",
          )}
        >
          <DrawerTitle className="sr-only">{dialogAriaLabel}</DrawerTitle>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName={overlayClass}
        className={cn(
          panelClassName,
          "h-dvh max-h-dvh w-full",
          RIGHT_PANEL_WIDTH_CLASS,
          "data-[state=open]:duration-300 data-[state=closed]:duration-300",
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">{dialogAriaLabel}</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
}
