"use client";

import type { ReactNode } from "react";
import JewelleryMegaMenuDivider from "@/shared/ui/layout/JewelleryMegaMenuDivider";
import { cn } from "@/shared/utils/cn";

/** Same shell / collapse motion as WorldOfSunnyMegaMenu. */
type SearchDesktopMegaMenuProps = {
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
};

export function SearchDesktopMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
  children,
}: SearchDesktopMegaMenuProps) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full z-40 bg-white shadow-sm",
        "motion-safe:transform-gpu motion-safe:origin-top",
        "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
        open
          ? "motion-safe:translate-y-0 motion-safe:opacity-100 min-h-[50vh]"
          : "motion-safe:-translate-y-2 motion-safe:opacity-0",
        !open && "pointer-events-none",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <JewelleryMegaMenuDivider />
      {children}
    </div>
  );
}
