"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export const productDetailSidePanelOverlayClassName =
  "min-h-0 flex-1 bg-[#1E1E1E]/75 animate-in fade-in duration-300 max-md:min-h-12";

export const productDetailSidePanelAsideClassName =
  "flex min-h-0 w-full max-w-480 shrink-0 flex-col overflow-hidden bg-white shadow-2xl max-md:max-h-[calc(100dvh-3rem)] max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300 md:h-full md:animate-in md:slide-in-from-right md:duration-300";

type ProductDetailSidePanelShellProps = {
  open: boolean;
  onClose: () => void;
  overlayAriaLabel: string;
  dialogAriaLabel: string;
  children: ReactNode;
  asideClassName?: string;
};

export function ProductDetailSidePanelShell({
  open,
  onClose,
  overlayAriaLabel,
  dialogAriaLabel,
  children,
  asideClassName,
}: ProductDetailSidePanelShellProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex max-md:flex-col max-md:overflow-hidden md:justify-end">
      <button
        type="button"
        aria-label={overlayAriaLabel}
        className={productDetailSidePanelOverlayClassName}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dialogAriaLabel}
        className={cn(productDetailSidePanelAsideClassName, asideClassName)}
      >
        {children}
      </aside>
    </div>
  );
}
