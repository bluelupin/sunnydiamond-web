/** Figma 4903:69969 — expanded navigation search overlay (desktop). */
export const searchOverlayFigmaSpec = {
  contentMaxWidth: 1040,
  searchPlaceholder: "What are you looking for ?",
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
  searchInputClassName:
    "min-w-0 flex-1 bg-transparent font-gill text-sm font-light leading-110 text-darkblack placeholder:font-light placeholder:text-gray600 focus:outline-none [&::-webkit-search-cancel-button]:hidden",
  /** Radix hit target only; visible dim is the flex scrim below the white band. */
  overlayScrimClassName:
    "fixed inset-x-0 bottom-0 top-16 z-[60] bg-transparent md:landscape:top-[104px]",
  /** Mobile — full-height white panel below header; desktop landscape — white band + dim scrim. */
  panelShellClassName:
    "fixed inset-x-0 bottom-0 top-16 z-[61] flex !h-[calc(100dvh-4rem)] flex-col bg-white p-0 shadow-none outline-none md:landscape:top-[104px] md:landscape:!h-[calc(100dvh-104px)] md:landscape:bg-transparent",
  /** Figma 4903:69970 mobile — scrollable white fill; 1440×693 desktop — capped search band. */
  panelSurfaceClassName:
    "flex min-h-0 w-full flex-1 overflow-y-auto bg-white md:landscape:flex-none md:landscape:shrink-0",
  panelSurfaceMinHeightClassName:
    "md:landscape:min-h-[min(589px,calc(100dvh-104px-30dvh))]",
  panelSurfaceMaxHeightClassName:
    "md:landscape:max-h-[min(589px,calc(100dvh-104px-30dvh))]",
  /** Dimmed page below white band — desktop landscape only (Figma “bg screen”). */
  panelScrimClassName:
    "hidden min-h-[30dvh] w-full flex-1 bg-darkblack/40 md:landscape:block",
  /** Figma 4903:69969 — 40px from header rule to search column. */
  contentTopPaddingClassName: "pt-10",
  contentColumnClassName: "mx-auto flex w-full min-h-0 flex-col px-4 pb-6 md:px-10",
} as const;
