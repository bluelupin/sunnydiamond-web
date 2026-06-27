"use client";

import { JewelleryCategoryMenu } from "@/shared/ui/layout/JewelleryCategoryMenu";

type JewelleryMegaMenuProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
};

export const JewelleryMegaMenu = ({ onMouseEnter, onMouseLeave, onClose }: JewelleryMegaMenuProps) => {
  return (
    <div
      className="absolute left-0 right-0 top-full z-40 border-t border-[#ECE9E9] bg-white shadow-sm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-[120px] py-10">
        <JewelleryCategoryMenu variant="desktop" onClose={onClose} />
      </div>
    </div>
  );
};
