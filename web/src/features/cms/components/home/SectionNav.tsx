"use client";

import { useMemo } from "react";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";
import { useVisibleHomeSections } from "@/shared/hooks/use-visible-home-sections";
import { cn } from "@/shared/utils/cn";

const SIZE = 22;
const STROKE = 1.25;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

const SectionNav = () => {
  const visibleSections = useVisibleHomeSections();
  const sectionIds = useMemo(
    () => visibleSections.map((section) => section.id),
    [visibleSections],
  );

  const { activeId, isVisible, progress } = useScrollSpy({
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
        "fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-5 transition-all duration-500 ease-out will-change-transform md:flex lg:left-6",
        isVisible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-3 opacity-0",
      )}
    >
      {visibleSections.map((section) => {
        const isActive = activeId === section.id;
        const p = Math.max(0, Math.min(1, progress[section.id] ?? 0));
        const dashOffset = CIRC * (1 - p);

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            aria-label={`Scroll to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span
              className="relative inline-flex items-center justify-center"
              style={{ width: SIZE, height: SIZE }}
            >
              <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="-rotate-90 block"
                aria-hidden="true"
              >
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={`${isActive ? "#999999" : "none"}`}
                  strokeWidth={STROKE}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-primary/25" : "text-muted-foreground/25",
                  )}
                />
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                  className="text-primary transition-[stroke-dashoffset] duration-200 ease-out"
                  style={{ opacity: p > 0.001 ? 1 : 0 }}
                />
              </svg>
              <span
                className={cn(
                  "absolute h-2 w-2 rounded-full transition-all duration-300",
                  isActive
                    ? "scale-100 bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.95)] ring-1 ring-gray600"
                    : "scale-90 bg-gray600/90 group-hover:bg-primary/70",
                )}
              />
            </span>

            <span
              className={cn(
                "pointer-events-none ml-3 whitespace-nowrap font-body text-xs tracking-wide",
                "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100",
                "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                "transition-all duration-300 ease-out",
                isActive ? "text-primary" : "text-foreground/70",
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
