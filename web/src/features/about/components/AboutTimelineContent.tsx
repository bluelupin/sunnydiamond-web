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
    className="w-full max-w-445 bg-white py-8 pl-8 pr-20"
  >
    <div
      key={activeYear}
      className={cn(
        "flex flex-col gap-6",
        !reducedMotion && "animate-fade-in duration-500 ease-out",
      )}
    >
      <div className="flex w-full max-w-308 items-center gap-2">
        <div className="flex shrink-0 items-center gap-1">
          <DiamondIcon className="h-18 w-18 shrink-0 text-darkblack" aria-hidden />
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            {activeYear}
          </p>
        </div>
        <span className="h-px flex-1 bg-neutral300" aria-hidden />
      </div>

      <div className="flex w-full max-w-445 flex-col gap-4">
        <h2 id="about-timeline-title" className="font-larken text-32 font-light leading-110 text-darkblack">
          {milestone.title}
        </h2>
        <p className="font-gill text-xl font-light leading-110 text-neutral500">
          {milestone.description}
        </p>
      </div>
    </div>
  </article>
);

export default AboutTimelineContent;
