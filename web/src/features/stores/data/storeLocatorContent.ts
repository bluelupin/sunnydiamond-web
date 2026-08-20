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

/** Figma State 2 — store found after search (used when CMS `storeFoundMessage` is unset). */
export const storeLocatorSearchMatchMessage = "STORE FOUND FOR YOUR SEARCH";

/** Figma State 2 — store found eyebrow styling. */
export const storeLocatorStatusEyebrowClassName =
  "font-gill text-sm font-normal uppercase leading-110 text-[#5F6F3E] lg:text-base";

/** UI model for location filter chips (CMS icons preferred). */
export type StoreLocatorStateFilter = {
  id: string;
  label: string;
  /** CMS icon URL — when set, sprite crop fields are unused. */
  iconUrl?: string | null;
  iconAlt?: string;
  iconWidth: number;
  iconHeight: number;
  mobileIconWidth?: number;
  mobileIconHeight?: number;
};
