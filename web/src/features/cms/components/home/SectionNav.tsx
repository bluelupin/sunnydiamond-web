"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useHomeSidebarNavigation } from "@/hooks/homepage/useHomeSidebarNavigation";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";
import { SectionNavProgressIndicator } from "@/features/cms/components/home/SectionNavProgressIndicator";
import { saveHomeActiveSection } from "@/shared/lib/browserBackScrollRestore";
import { scrollToHomeSection } from "@/shared/utils/homeSectionScroll";
import { cn } from "@/shared/utils/cn";

const NAV_GRADIENT = "/icons/section-nav-gradient.svg";

const SectionNav = () => {
  const navSections = useHomeSidebarNavigation();
  const sectionIds = useMemo(
    () => navSections.map((section) => section.sectionId),
    [navSections],
  );
  const navStartSectionId = sectionIds[0];

  const { activeId, isVisible, progress } = useScrollSpy({
    sectionIds,
    navStartSectionId,
  });
  const [isFooterIntersecting, setIsFooterIntersecting] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterIntersecting(Boolean(entry?.isIntersecting));
      },
      { threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const showNav = isVisible && !isFooterIntersecting;

  const activeIndex = useMemo(
    () => navSections.findIndex((section) => section.sectionId === activeId),
    [activeId, navSections],
  );

  const handleClick = (sectionId: string) => {
    saveHomeActiveSection(sectionId);
    scrollToHomeSection(sectionId);
  };

  if (navSections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "group/nav pointer-events-none fixed bottom-0 left-0 z-50 hidden md:block",
        "transition-all duration-500 ease-out will-change-transform",
        showNav
          ? "translate-x-0 opacity-100"
          : "-translate-x-3 opacity-0",
      )}
    >
      <nav aria-label="Page sections" className="relative flex flex-col gap-y-5 pb-60 pl-10 pt-10">
        <div
          aria-hidden
          className={cn(
            "section-nav-scrim pointer-events-none absolute inset-y-0 left-0 w-[200px]",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]",
            "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]",
          )}
        >
          <Image
            src={NAV_GRADIENT}
            alt=""
            fill
            sizes="(max-width: 1440px) 50vw, 720px"
            className="section-nav-scrim-image object-cover object-left object-bottom drop-shadow-[16px_0_40px_rgba(0,0,0,0.08)] drop-shadow-[0_-12px_32px_rgba(0,0,0,0.05)]"
          />
          <div className="section-nav-scrim-overlay absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05)_0%,transparent_24%)]" />
        </div>

        {navSections.map((section, index) => {
          const isActive = activeId === section.sectionId;
          const isComplete = activeIndex >= 0 && index < activeIndex;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section.sectionId)}
              aria-label={`Scroll to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-center rounded-sm transition-[gap] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-linkGold focus-visible:ring-offset-2",
                isActive ? "gap-5" : "gap-0",
                "group-hover/nav:gap-5 group-focus-within/nav:gap-5",
                showNav ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                <SectionNavProgressIndicator
                  progress={progress[section.sectionId] ?? 0}
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
