/** Figma 4903:69969 — expanded navigation search overlay (desktop). */
export const searchOverlayFigmaSpec = {
  contentMaxWidth: 1040,
  /** Vertical gap between search bar block and suggestions (24px). */
  sectionGapClassName: "gap-6",
  /** Gap between suggestion rows (16px). */
  suggestionGapClassName: "gap-4",
  searchBarClassName:
    "flex w-full items-center gap-2 border border-aboutInactive bg-aboutInactive p-3",
  searchInputClassName:
    "min-w-0 flex-1 bg-transparent font-gill text-sm font-light leading-110 text-darkblack placeholder:font-light placeholder:text-gray600 focus:outline-none [&::-webkit-search-cancel-button]:hidden",
  /** Figma 4903:69970 — panel sits below fixed header (64px mobile / 104px desktop landscape). */
  panelTopClassName: "top-16 md:landscape:top-[104px]",
  panelMaxHeightClassName:
    "max-h-[calc(100dvh-4rem)] md:landscape:max-h-[calc(100dvh-104px)]",
  /** Figma 4903:69969 — 40px from header rule to search column. */
  contentTopPaddingClassName: "pt-10",
  contentColumnClassName:
    "mx-auto flex w-full min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 md:px-10",
} as const;
