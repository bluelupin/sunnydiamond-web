export const storeLocatorHeroFigmaSpec = {
  /** Figma node 1480:176277 — store locator hero banner */
  height: {
    mobile: 240,
    desktop: 320,
  },
  overlayOpacity: 0.4,
  titleTop: {
    mobile: 152,
    desktop: 203,
  },
  imageCrop: {
    heightScale: "323.44%",
    topOffset: "-197.37%",
  },
} as const;

export const storeLocatorSearchFigmaSpec = {
  /** Figma node 1480:176350 — desktop search + state filters */
  paddingY: 40,
  contentMaxWidth: 676,
  searchHeight: 56,
  stateItemWidth: 86,
  stateIconHeight: 64,
  stateGap: 32,
  stateLabelSize: 16,
} as const;

export const storeLocatorSearchMobileFigmaSpec = {
  /** Figma node 1480:175894 — mobile search + state filters */
  paddingX: 16,
  paddingY: 24,
  sectionGap: 24,
  stateRowHeight: 56,
  stateGap: 24,
  stateLabelSize: 14,
} as const;

/** Figma — empty pincode search: suggest nearby showrooms instead of blank state. */
export const storeLocatorNearbySuggestionsCopy = {
  title: "NO STORE FOUND FOR YOUR SEARCH",
  subtitle: "Explore nearby stores",
} as const;

/** Figma — pincode search with matches. */
export const storeLocatorPincodeMatchCopy = {
  title: "STORE FOUND FOR YOUR SEARCH",
  nearbySubtitle: "Explore nearby stores",
} as const;

/** UI model for location filter chips (CMS icons preferred). */
export type StoreLocatorStateFilter = {
  id: string;
  label: string;
  /** CMS icon URL — when set, sprite crop fields are unused. */
  iconUrl?: string | null;
  spriteSrc?: string;
  iconWidth: number;
  iconHeight: number;
  mobileIconWidth?: number;
  mobileIconHeight?: number;
  imageWidthPct?: number;
  imageHeightPct?: number;
  imageLeftPct?: number;
  imageTopPct?: number;
};

