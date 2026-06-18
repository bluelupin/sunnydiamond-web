"use client";

import { cn } from "@/shared/utils/cn";
import DiamondIcon from "@/assets/Icons/Diamond";
import type { TimelineYear } from "../hooks/useAboutTimelineScroll";

type Milestone = {
  title: string;
  description: string;
};

type AboutTimelineContentProps = {
  activeYear: TimelineYear;
  milestone: Milestone;
  reducedMotion: boolean;
};

const AboutTimelineContent = ({
  activeYear,
  milestone,
  reducedMotion,
}: AboutTimelineContentProps) => (
  <article
    aria-labelledby="about-timeline-title"
    className="mt-10 w-full max-w-[445px] bg-white py-8 pl-8 pr-20 lg:mt-0"
  >
    <div
      key={activeYear}
      className={cn(
        "flex flex-col gap-6",
        !reducedMotion && "animate-fade-in duration-500 ease-out",
      )}
    >
      <div className="flex w-full max-w-[308px] items-center gap-2">
        <div className="flex shrink-0 items-center gap-1">
          <DiamondIcon className="h-[18px] w-[18px] text-darkblack" aria-hidden />
          <p className="font-gill text-base font-light leading-[110%] text-darkblack">
            {activeYear}
          </p>
        </div>
        <span className="h-px flex-1 bg-gray50" aria-hidden />
      </div>

      <div className="flex max-w-[445px] flex-col gap-4">
        <h2
          id="about-timeline-title"
          className="font-larken text-[32px] font-light leading-[110%] text-darkblack"
        >
          {milestone.title}
        </h2>
        <p className="font-gill text-xl font-light leading-[110%] text-gray500">
          {milestone.description}
        </p>
      </div>
    </div>
  </article>
);

export default AboutTimelineContent;
