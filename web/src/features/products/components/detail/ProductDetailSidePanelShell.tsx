"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export const productDetailSidePanelOverlayClassName =
  "min-h-0 flex-1 bg-[#1E1E1E]/75 animate-in fade-in duration-300 max-lg:min-h-12";

export const productDetailSidePanelAsideClassName =
  "flex min-h-0 w-full max-w-480 shrink-0 flex-col overflow-hidden bg-white shadow-2xl max-lg:max-h-[calc(100vh-4rem)] max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300 lg:h-full lg:animate-in lg:slide-in-from-right lg:duration-300";

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
    <div className="fixed inset-0 z-[70] flex max-lg:flex-col lg:justify-end">
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
