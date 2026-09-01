"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { TimelineYear } from "../hooks/useAboutTimelineScroll";

const mobileNavCollapseTransitionClassName =
  "grid min-h-0 transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none";

type AboutTimelineNavProps = {
  years: readonly string[];
  activeYear: TimelineYear;
  onYearSelect: (year: TimelineYear) => void;
};

const AboutTimelineNav = ({
  years,
  activeYear,
  onYearSelect,
}: AboutTimelineNavProps) => {
  const listId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
      className="relative w-full shrink-0 items-center md:flex md:w-143"
    >
      <div className="flex flex-col gap-4 md:hidden">
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

      <div
        aria-hidden={isMobileLayout && !isExpanded ? true : undefined}
        className={cn(
          mobileNavCollapseTransitionClassName,
          "md:contents",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
          "md:pointer-events-auto md:grid-rows-[1fr] md:opacity-100",
        )}
      >
        <div className="min-h-0 overflow-hidden md:overflow-visible">
          <ol
            id={listId}
            className="mt-4 flex flex-col items-start gap-4 sm:gap-6 md:mt-0 md:gap-8 lg:items-start md:max-h-full max-h-[270px] md:overflow-y-hidden overflow-y-auto"
          >
            {years.map((year) => {
              const isActive = year === activeYear;

              return (
                <li key={year}>
                  <button
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      "flex w-full items-center justify-end gap-2 text-right transition-opacity duration-500 ease-out motion-reduce:transition-none md:justify-start",
                      !isActive && "opacity-40 hover:opacity-70",
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "hidden h-px w-16 shrink-0 transition-colors duration-500 ease-out motion-reduce:transition-none md:block",
                        isActive ? "bg-white" : "bg-aboutInactive",
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "font-gill leading-110 transition-all duration-500 ease-out motion-reduce:transition-none",
                        isActive
                          ? "text-xl font-semibold text-white"
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
        </div>
      </div>
    </nav>
  );
};

export default AboutTimelineNav;
