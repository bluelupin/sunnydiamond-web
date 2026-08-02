"use client";

import { cn } from "@/shared/utils/cn";

const CHEVRON_DOWN_ICON_SRC = "/images/careers/icon-chevron-down.svg";

/** Figma 1480:3410 — 24px box, 15×7.5px chevron stroke. */
const CareersChevronDownIcon = ({ className }: { className?: string }) => {
  return (
    <span className={cn("relative size-6 shrink-0 overflow-clip", className)} aria-hidden>
      <span
        className="absolute left-[calc(50%+0.5px)] top-[calc(50%-0.25px)] h-[7.5px] w-[15px] -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute inset-[-6.67%_-3.33%]">
          <img src={CHEVRON_DOWN_ICON_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </span>
    </span>
  );
};

export default CareersChevronDownIcon;
