"use client";

import { cn } from "@/shared/utils/cn";

const SEARCH_ICON_SRC = "/images/careers/icon-search.svg";

/** Figma 1480:1077 — 24px search icon inside skills field. */
const CareersSearchIcon = ({ className }: { className?: string }) => {
  return (
    <span className={cn("relative size-6 shrink-0 overflow-clip", className)} aria-hidden>
      <span className="absolute inset-[12.5%]">
        <span className="absolute inset-[-2.78%]">
          <img src={SEARCH_ICON_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </span>
    </span>
  );
};

export default CareersSearchIcon;
