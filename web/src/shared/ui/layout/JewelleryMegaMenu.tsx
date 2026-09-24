"use client";

import { JewelleryCategoryMenu } from "@/shared/ui/layout/JewelleryCategoryMenu";
import JewelleryMegaMenuDivider from "@/shared/ui/layout/JewelleryMegaMenuDivider";
import { pageContainerClassName } from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";

type JewelleryMegaMenuProps = {
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
};

export const JewelleryMegaMenu = ({
  open,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: JewelleryMegaMenuProps) => {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full z-40 bg-white shadow-sm",
        "motion-safe:transform-gpu motion-safe:origin-top",
        "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
        open
          ? "motion-safe:translate-y-0 motion-safe:opacity-100"
          : "motion-safe:-translate-y-2 motion-safe:opacity-0",
        !open && "pointer-events-none",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <JewelleryMegaMenuDivider />
      <div className={cn(pageContainerClassName, "py-10")}>
        <JewelleryCategoryMenu variant="desktop" onClose={onClose} />
      </div>
    </div>
  );
};
