import { cn } from "@/shared/utils/cn";

/** Shared motion tokens for accordion-style expand/collapse panels. */
export const ACCORDION_COLLAPSE_DURATION_MS = 500;

const accordionCollapseDurationClassName = "duration-500";

export const accordionCollapseEasingClassName =
  "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Animates height via grid-template-rows only (no opacity on the grid). */
export const accordionCollapseGridClassName = cn(
  "grid min-h-0 transition-[grid-template-rows]",
  accordionCollapseDurationClassName,
  accordionCollapseEasingClassName,
  "motion-reduce:transition-none",
);

export const accordionCollapseInnerClassName = "min-h-0 overflow-hidden";

export const accordionCollapseIconClassName = cn(
  "transition-opacity duration-300",
  accordionCollapseEasingClassName,
  "motion-reduce:transition-none",
);

export function accordionCollapsePanelClassName(isOpen: boolean) {
  return cn(
    accordionCollapseGridClassName,
    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] pointer-events-none",
  );
}
