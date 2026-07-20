"use client";

import { JewelleryCategoryMenu } from "@/shared/ui/layout/JewelleryCategoryMenu";
import JewelleryMegaMenuDivider from "@/shared/ui/layout/JewelleryMegaMenuDivider";
import { pageContainerClassName } from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";

type JewelleryMegaMenuProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
};

export const JewelleryMegaMenu = ({ onMouseEnter, onMouseLeave, onClose }: JewelleryMegaMenuProps) => {
  return (
    <div
      className="absolute inset-x-0 top-full z-40 bg-white shadow-sm"
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
