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
  /** Figma node 4903:141272 — store locator search strip (desktop) */
  paddingTop: 64,
  paddingBottom: 40,
  searchMaxWidth: 508,
  searchHeight: 56,
  /** @deprecated State tabs removed from Figma 4903:141272 — kept for legacy imports */
  contentMaxWidth: 508,
  stateItemWidth: 86,
  stateIconHeight: 64,
  stateGap: 32,
  stateLabelSize: 16,
} as const;

/** Default when CMS omits searchPlaceholder (Figma 4903:141277). */
export const storeLocatorDefaultSearchPlaceholder = "Search by location or pin code";

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

/** Figma 4453:41764 — “Explore nearby stores” (Desktop/Title/t3-16-Regular, Neutrals/500) */
export const storeLocatorExploreNearbyStoresLabelClassName =
  "font-gill text-base font-normal leading-110 text-neutral500";

/** Space above “Explore nearby stores” after the matched showroom block */
export const storeLocatorExploreNearbyStoresLabelMarginTop = 32;

/** Figma / Spec — valid pincode with no showroom match. */
export const storeLocatorNoAreaTitle = "NO SHOWROOM IN THIS AREA YET";
export const storeLocatorNoAreaSubtitle =
  "Explore the nearest Sunny Diamonds showrooms and plan your visit with ease.";

/** Figma node 4903:141556 — no showrooms in area list lead */
export const storeLocatorNoAreaFigmaSpec = {
  titleToSubtitleGap: 32,
  subtitleToFeaturedGap: 12,
} as const;

/** Figma 4903:141558 — title */
export const storeLocatorNoAreaTitleClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

/** Figma 4903:141561 — subtitle */
export const storeLocatorNoAreaSubtitleClassName =
  "font-gill text-base font-normal leading-110 text-neutral500";

/** Figma / Spec — malformed pincode under the search field. */
export const storeLocatorInvalidPincodeMessage = "Please enter a valid pin code";

/** Figma node 4903:141297 — explore showrooms list + hero image */
export const storeLocatorShowroomsFigmaSpec = {
  sectionPaddingTop: 40,
  sectionPaddingBottom: 104,
  columnGap: 24,
  listMaxWidth: 593,
  listHorizontalPadding: 40,
  listTitleToListGap: 12,
  collapsedRowPaddingY: 24,
  expandedPanelPaddingY: 24,
  expandedPanelBackground: "#F4F3EE",
  heroMinHeight: 559,
} as const;

/** Figma 4903:141429 — expanded showroom panel (search match / selected row) */
export const storeLocatorExpandedPanelFigmaSpec = {
  sectionGap: 16,
  detailsToCtaGap: 24,
  contactStackGap: 16,
  iconTextGap: 12,
} as const;

/** Figma 4903:141436 / 4903:141439 — address & phone (Desktop/Body/b1-20-Light) */
export const storeLocatorShowroomDetailTextClassName =
  "font-gill text-xl font-light leading-110 text-darkblack";

/** Figma 4903:141313 — GET DIRECTIONS; use {@link DetailTextLink} (tertiary CTA underline). */
export const storeLocatorShowroomDirectionsClassName =
  "text-tertiary-cta-underline w-fit pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack sm:pb-1";

/** Figma 4903:141301 — list section title above locations */
export const storeLocatorExploreListTitleClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

/** Figma 4903:141428 — pin / search match list heading (Desktop/Title/t3-16-Regular) */
export const storeLocatorSearchMatchTitleClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

/** Figma 4903:141303 — city name (expanded + collapsed) */
export const storeLocatorShowroomCityClassName =
  "font-larken text-2xl font-light leading-110 text-darkblack";

/** @deprecated use storeLocatorSearchMatchTitleClassName */
export const storeLocatorListHeadingClassName = storeLocatorSearchMatchTitleClassName;

/** @deprecated kept for imports — use storeLocatorSearchMatchTitleClassName */
export const storeLocatorStatusEyebrowClassName = storeLocatorSearchMatchTitleClassName;

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
