"use client";

import { cn } from "@/shared/utils/cn";
import { aboutTimelineYears } from "../data/content";
import type { TimelineYear } from "../hooks/useAboutTimelineScroll";

type AboutTimelineNavProps = {
  activeYear: TimelineYear;
  onYearSelect: (year: TimelineYear) => void;
};

const AboutTimelineNav = ({ activeYear, onYearSelect }: AboutTimelineNavProps) => {
  return (
    <nav aria-label="Company timeline" className="relative w-full shrink-0 lg:w-143 lg:pt-148">
      <ol className="flex flex-col gap-8">
        {aboutTimelineYears.map((year) => {
          const isActive = year === activeYear;

          return (
            <li key={year}>
              <button
                type="button"
                onClick={() => onYearSelect(year)}
                className={cn(
                  "flex w-full items-center justify-start gap-2 text-left transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  !isActive && "opacity-40 hover:opacity-70",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "h-px w-16 shrink-0 transition-colors duration-500 ease-out motion-reduce:transition-none",
                    isActive ? "bg-white" : "bg-aboutInactive",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "font-gill leading-110 transition-all duration-500 ease-out motion-reduce:transition-none",
                    isActive
                      ? "text-2xl font-semibold text-white"
                      : "text-xl font-normal text-aboutInactive",
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
