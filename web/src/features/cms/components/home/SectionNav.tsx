"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";
import { useVisibleHomeSections } from "@/shared/hooks/use-visible-home-sections";
import { cn } from "@/shared/utils/cn";

const ACTIVE_INDICATOR = "/images/navigation/section-nav-active.svg";

const SectionNav = () => {
  const visibleSections = useVisibleHomeSections();
  const sectionIds = useMemo(
    () => visibleSections.map((section) => section.id),
    [visibleSections],
  );

  const { activeId, isVisible } = useScrollSpy({
    sectionIds,
    visibilityThresholdIndex: 0,
  });

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  if (!visibleSections.length) {
    return null;
  }

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed left-10 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-5 transition-all duration-500 ease-out will-change-transform md:flex",
        isVisible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-3 opacity-0",
      )}
    >
      {visibleSections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            aria-label={`Scroll to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ab863b] focus-visible:ring-offset-2"
          >
            <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
              {isActive ? (
                <Image
                  src={ACTIVE_INDICATOR}
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden
                  className="size-4"
                />
              ) : (
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-darkblack transition-colors duration-300 group-hover:bg-[#ab863b]"
                />
              )}
            </span>

            <span
              className={cn(
                "whitespace-nowrap font-gill text-base font-normal uppercase leading-[110%] transition-colors duration-300",
                isActive ? "text-[#ab863b]" : "text-darkblack group-hover:text-[#ab863b]",
              )}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default SectionNav;
