"use client";

import { cn } from "@/shared/utils/cn";

const ICON_BOX_CLASS = "relative size-6 shrink-0 overflow-hidden";

type CareersJobMetaIconProps = {
  name: "experience" | "map" | "workplace";
  className?: string;
};

const CareersJobMetaIcon = ({ name, className }: CareersJobMetaIconProps) => {
  if (name === "map") {
    return (
      <span className={cn(ICON_BOX_CLASS, className)} aria-hidden>
        <span className="absolute inset-[9.38%_18.75%]">
          <img
            src="/images/careers/icon-map-outline.svg"
            alt=""
            className="block size-full max-w-none"
          />
        </span>
        <span className="absolute inset-[28.13%_37.5%_46.88%_37.5%]">
          <img
            src="/images/careers/icon-map-pin.svg"
            alt=""
            className="block size-full max-w-none"
          />
        </span>
      </span>
    );
  }

  if (name === "experience") {
    return (
      <span className={cn(ICON_BOX_CLASS, className)} aria-hidden>
        <span className="absolute inset-[16.67%_12.5%_14.58%_12.5%]">
          <img
            src="/images/careers/icon-experience.svg"
            alt=""
            className="block size-full max-w-none"
          />
        </span>
      </span>
    );
  }

  return (
    <span className={cn(ICON_BOX_CLASS, className)} aria-hidden>
      <span className="absolute inset-[20.83%_4.17%_16.67%_8.33%]">
        <img
          src="/images/careers/icon-multiple-user.svg"
          alt=""
          className="block size-full max-w-none"
        />
      </span>
    </span>
  );
};

export default CareersJobMetaIcon;
