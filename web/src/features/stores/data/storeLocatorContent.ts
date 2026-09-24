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

/** Figma — default list heading (default + invalid states). */
export const storeLocatorExploreShowroomsTitle = "Explore Our Showrooms";

/** Figma / Spec — pincode match list heading. */
export const storeLocatorSearchMatchMessage = "We Found a Showroom Near You";

/** Figma desktop — label above non-matched stores after a search hit. */
export const storeLocatorExploreNearbyStoresLabel = "Explore nearby stores";

/** Figma / Spec — valid pincode with no showroom match. */
export const storeLocatorNoAreaTitle = "NO SHOWROOM IN THIS AREA YET";
export const storeLocatorNoAreaSubtitle =
  "Explore the nearest Sunny Diamonds showrooms and plan your visit with ease.";

/** Figma / Spec — malformed pincode under the search field. */
export const storeLocatorInvalidPincodeMessage = "Please enter a valid pin code";

/** Match / explore heading styling (Figma — dark title, not green eyebrow). */
export const storeLocatorListHeadingClassName =
  "font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl";

/** @deprecated kept for imports — use storeLocatorListHeadingClassName */
export const storeLocatorStatusEyebrowClassName = storeLocatorListHeadingClassName;

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
