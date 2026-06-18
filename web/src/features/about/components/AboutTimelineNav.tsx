"use client";

import { cn } from "@/shared/utils/cn";
import { aboutTimelineYears } from "../data/content";
import type { TimelineYear } from "../hooks/useAboutTimelineScroll";

type AboutTimelineNavProps = {
  activeYear: TimelineYear;
  progress: number;
  onYearSelect: (year: TimelineYear) => void;
};

const AboutTimelineNav = ({ activeYear, progress, onYearSelect }: AboutTimelineNavProps) => {
  const activeIndex = aboutTimelineYears.indexOf(activeYear);

  return (
    <nav aria-label="Company timeline" className="relative shrink-0 lg:pt-[148px]">
      <ol className="flex flex-col gap-8">
        {aboutTimelineYears.map((year, index) => {
          const isActive = year === activeYear;
          const isPassed = index < activeIndex;
          return (
            <li key={year} className="relative">
              {index < aboutTimelineYears.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-[calc(100%-4rem+31px)] top-6 hidden h-[calc(100%+2rem)] w-px lg:block",
                    isPassed ? "bg-white" : isActive && progress > 0.35 ? "bg-white/70" : "bg-white/20",
                  )}
                />
              ) : null}

              <button
                type="button"
                onClick={() => onYearSelect(year)}
                className={cn(
                  "group flex w-full items-center justify-end gap-2 text-right transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  !isActive && "opacity-40 hover:opacity-70",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "h-px w-16 shrink-0 transition-colors duration-500 ease-out motion-reduce:transition-none",
                    isActive ? "bg-white" : isPassed ? "bg-white/70" : "bg-[#F2F2F2]",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "font-gill leading-[110%] transition-all duration-500 ease-out motion-reduce:transition-none",
                    isActive
                      ? "text-2xl font-semibold text-white"
                      : "text-xl font-normal text-[#F2F2F2] group-hover:text-white/80",
                  )}
                >
                  {year}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AboutTimelineNav;
