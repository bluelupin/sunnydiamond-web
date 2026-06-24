"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { aboutTimelineYears } from "../data/content";
import type { TimelineYear } from "../hooks/useAboutTimelineScroll";

type AboutTimelineNavProps = {
  activeYear: TimelineYear;
  onYearSelect: (year: TimelineYear) => void;
};

const AboutTimelineNav = ({ activeYear, onYearSelect }: AboutTimelineNavProps) => {
  const listId = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeYear]);

  const handleYearSelect = (year: TimelineYear) => {
    onYearSelect(year);
    setIsExpanded(false);
  };

  return (
    <nav
      aria-label="Company timeline"
      className="relative w-full shrink-0 lg:w-143 lg:flex items-center"
    >
      <div className="flex flex-col gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between pt-5"
          aria-expanded={isExpanded}
          aria-controls={listId}
        >
          <span className="font-gill text-2xl font-normal leading-110 text-white">
            {activeYear}
          </span>
          {isExpanded ? (
            <ChevronUp
              size={24}
              strokeWidth={1.25}
              className="shrink-0 text-white"
              aria-hidden
            />
          ) : (
            <ChevronDown
              size={24}
              strokeWidth={1.25}
              className="shrink-0 text-white"
              aria-hidden
            />
          )}
        </button>
        <span className="h-px w-full bg-white/40" aria-hidden />
      </div>

      <ol
        id={listId}
        className={cn(
          "flex flex-col lg:items-end items-start gap-8",
          isExpanded ? "mt-4 flex" : "hidden",
          "lg:mt-0 lg:flex lg:items-start",
        )}
      >
        {aboutTimelineYears.map((year) => {
          const isActive = year === activeYear;

          return (
            <li key={year}>
              <button
                type="button"
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "flex w-full items-center justify-end gap-2 text-right transition-opacity duration-500 ease-out motion-reduce:transition-none lg:justify-start",
                  !isActive && "opacity-40 hover:opacity-70",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "hidden h-px w-16 shrink-0 transition-colors duration-500 ease-out motion-reduce:transition-none lg:block",
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
