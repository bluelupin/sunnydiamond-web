/** Figma 4903:69969 — expanded navigation search overlay (desktop). */
export const searchOverlayFigmaSpec = {
  contentMaxWidth: 1040,
  searchPlaceholder: "What are you looking for?",
  /** Figma empty state — no query-specific copy. */
  emptyStateMessage: "Nothing Matches Your Search",
  /** Figma — Gill Sans Regular 14px / 400. */
  emptyStateClassName: "font-gill text-sm font-normal leading-110 text-darkblack",
  /** Vertical gap between search bar block and suggestions (24px). */
  sectionGapClassName: "gap-6",
  /** Gap between suggestion rows (16px). */
  suggestionGapClassName: "gap-4",
  /** Figma — 1040×46 (desktop) / 343×46 (mobile inset). */
  searchBarClassName:
    "flex h-[46px] w-full shrink-0 items-center gap-2 border border-aboutInactive bg-aboutInactive px-3 py-0",
  /** Figma — magnifier in field + typed query #0A0A0A. */
  searchBarIconClassName: "size-6 shrink-0 text-darkblack",
  /** Figma typing in field — Gill Sans 14px / Light (300) / #0A0A0A; placeholder styles unchanged. */
  searchInputClassName:
    "min-w-0 flex-1 bg-transparent font-gill text-[14px] font-light font-[300] leading-110 text-darkblack placeholder:font-light placeholder:text-gray600 focus:outline-none [&::-webkit-search-cancel-button]:hidden",
  /** Figma — magnifier on suggestion rows below the field #4D4D4D. */
  suggestionSearchIconClassName: "size-6 shrink-0 text-neutral500",
  /** Mobile — full-height panel below header (portrait / narrow). */
  mobileOverlayScrimClassName:
    "fixed inset-x-0 bottom-0 top-16 z-[60] bg-transparent max-md:top-[calc(4rem+env(safe-area-inset-top,0px))] md:max-desktop:portrait:top-[calc(4rem+env(safe-area-inset-top,0px))]",
  mobilePanelShellClassName:
    "fixed inset-x-0 bottom-0 top-16 z-[61] flex !h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] flex-col bg-white p-0 shadow-none outline-none max-md:top-[calc(4rem+env(safe-area-inset-top,0px))] md:max-desktop:portrait:top-[calc(4rem+env(safe-area-inset-top,0px))] md:max-desktop:portrait:!h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))]",
  /** Desktop — same drop-down anchor as WorldOfSunnyMegaMenu (`absolute` under header bar). */
  desktopDropdownShellClassName:
    "absolute inset-x-0 top-full z-40 flex max-h-[min(589px,calc(100dvh-104px-4rem))] flex-col overflow-hidden bg-white p-0 shadow-sm outline-none",
  /** Figma 4903:69970 mobile — scrollable white fill; desktop — capped search band in dropdown. */
  panelSurfaceClassName: "flex min-h-0 w-full flex-1 overflow-y-auto bg-white",
  desktopPanelSurfaceClassName:
    "flex min-h-0 w-full flex-1 overflow-y-auto bg-white max-h-[min(589px,calc(100dvh-104px-4rem))]",
  /** Same expand/collapse motion as WorldOfSunnyMegaMenu / JewelleryMegaMenu. */
  dropdownExpandTransitionClassName:
    "motion-safe:transform-gpu motion-safe:origin-top motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
  /** Mobile Radix dialog panel (data-state driven). */
  mobilePanelExpandTransitionClassName:
    "motion-safe:transform-gpu motion-safe:origin-top motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out data-[state=open]:motion-safe:translate-y-0 data-[state=open]:motion-safe:opacity-100 data-[state=closed]:motion-safe:-translate-y-2 data-[state=closed]:motion-safe:opacity-0 data-[state=closed]:pointer-events-none",
  mobileOverlayFadeTransitionClassName:
    "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0",
  /** Figma 4903:69969 — 40px from header rule to search column. */
  contentTopPaddingClassName: "pt-10",
  contentColumnClassName: "mx-auto flex w-full min-h-0 flex-col px-4 pb-6 md:px-10",
} as const;
