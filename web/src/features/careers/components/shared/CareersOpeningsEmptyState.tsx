"use client";

import Link from "next/link";
import DiamondIcon from "@/assets/Icons/Diamond";
import Reveal from "@/shared/Animation/Reveal";
import { careersDarkCtaClassName } from "@/features/careers/constants/careersCtaStyles";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";

const careersOpeningsEmptyStateContent = {
  title: "No Current Openings",
  description:
    "There are no open roles at the moment. In the meantime, discover more about our story and what we stand for.",
  ctaLabel: "LEARN MORE ABOUT US",
} as const;

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

const CareersOpeningsEmptyState = () => {
  const { title, description, ctaLabel } = careersOpeningsEmptyStateContent;

  return (
    <div className="flex w-full items-center justify-center py-8 md:py-12">
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center md:gap-8">
        <Reveal direction="up">
          <DiamondIcon className="size-8 text-gold500 md:size-10" />
        </Reveal>

        <div className="flex w-full flex-col gap-3 md:gap-4">
          <Reveal
            as="h2"
            id="careers-openings-empty-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-xl"
          >
            {description}
          </Reveal>
        </div>

        <Reveal direction="up">
          <Link
            href={WORLD_OF_SUNNY_PATH}
            className={`${careersDarkCtaClassName} shrink-0 ${ctaFocusClass}`}
          >
            <span className="relative z-10">{ctaLabel}</span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
};

export default CareersOpeningsEmptyState;
