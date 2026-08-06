"use client";

import { cn } from "@/shared/utils/cn";

type CareersShareIconProps = {
  className?: string;
};

/** Figma 1480:2188 — 24px tap target, 16.5×19.5px share glyph centered inside. */
const CareersShareIcon = ({ className }: CareersShareIconProps) => {
  return (
    <span className={cn("relative size-6 shrink-0 overflow-hidden", className)} aria-hidden>
      <span
        className="absolute left-[calc(50%+0.25px)] top-[calc(50%-0.25px)] h-[19.5px] w-[16.5px] -translate-x-1/2 -translate-y-1/2"
      >
        <img src="/images/icons/share-icon.svg" alt="" className="block size-full max-w-none" />
      </span>
    </span>
  );
};

export default CareersShareIcon;
