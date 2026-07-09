"use client";

import { useMemo } from "react";
import Image from "next/image";
import { homeSections } from "@/features/cms/data/content";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";
import { SectionNavProgressIndicator } from "@/features/cms/components/home/SectionNavProgressIndicator";
import { cn } from "@/shared/utils/cn";

const NAV_GRADIENT = "/images/navigation/section-nav-gradient.svg";

const NAV_START_SECTION_ID = "alankara";

const navSections = homeSections.slice(
  Math.max(0, homeSections.findIndex((section) => section.id === NAV_START_SECTION_ID)),
);

const sectionIds = navSections.map((section) => section.id);

const SectionNav = () => {
  const { activeId, isVisible, progress } = useScrollSpy({
    sectionIds,
    navStartSectionId: NAV_START_SECTION_ID,
  });

  const activeIndex = useMemo(
    () => navSections.findIndex((section) => section.id === activeId),
    [activeId, navSections],
  );

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div
      className={cn(
        "group/nav fixed bottom-40 left-0 z-50 hidden pl-40 md:block",
        "transition-all duration-500 ease-out will-change-transform",
        isVisible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-3 opacity-0",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[min(800px,100vh)] w-[min(720px,18vw)]"
      >
        <Image
          src={NAV_GRADIENT}
          alt=""
          fill
          sizes="(max-width: 1440px) 50vw, 720px"
          className="object-cover object-left"
        />
      </div>

      <nav aria-label="Page sections" className="relative flex flex-col gap-y-5 py-10">
        {navSections.map((section, index) => {
          const isActive = activeId === section.id;
          const isComplete = activeIndex >= 0 && index < activeIndex;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section.id)}
              aria-label={`Scroll to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-center rounded-sm transition-[gap] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-linkGold focus-visible:ring-offset-2",
                isActive ? "gap-5" : "gap-0",
                "group-hover/nav:gap-5 group-focus-within/nav:gap-5",
              )}
            >
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                <SectionNavProgressIndicator
                  progress={progress[section.id] ?? 0}
                  isActive={isActive}
                  isComplete={isComplete}
                />
              </span>

              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap font-gill text-base font-normal uppercase leading-110",
                  "transition-[max-width,opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                  isActive
                    ? "max-w-xs translate-x-0 opacity-100 text-linkGold"
                    : "max-w-0 -translate-x-1 opacity-0 text-darkblack",
                  "group-hover/nav:max-w-xs group-hover/nav:translate-x-0 group-hover/nav:opacity-100",
                  "group-focus-within/nav:max-w-xs group-focus-within/nav:translate-x-0 group-focus-within/nav:opacity-100",
                )}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SectionNav;
