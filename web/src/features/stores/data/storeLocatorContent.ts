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

export type StoreLocatorStateFilter = {
  id: string;
  label: string;
  spriteSrc: string;
  iconWidth: number;
  iconHeight: number;
  mobileIconWidth?: number;
  mobileIconHeight?: number;
  imageWidthPct: number;
  imageHeightPct: number;
  imageLeftPct: number;
  imageTopPct: number;
};

export const storeLocatorPageContent = {
  hero: {
    title: "Store Locator",
    image: {
      /** Figma UI-Production node 1480:176277 — showroom interior */
      desktopUrl: "/images/contact/visit-us.png",
      mobileUrl: "/images/contact/visit-us-mobile.png",
      alt: "Sunny Diamonds showroom interior",
      width: 1440,
      height: 804,
    },
  },
  search: {
    placeholder: "Search by location or pincode",
    stateFilters: [
      {
        id: "tamil-nadu",
        label: "Tamil Nadu",
        spriteSrc: "/images/stores/state-icons/sprites/tamil-nadu-kerala-sprite.png",
        iconWidth: 69.368,
        iconHeight: 64,
        mobileIconWidth: 40,
        mobileIconHeight: 37,
        imageWidthPct: 552.08,
        imageHeightPct: 273.55,
        imageLeftPct: -122.02,
        imageTopPct: -62.58,
      },
      {
        id: "karnataka",
        label: "Karnataka",
        spriteSrc: "/images/stores/state-icons/sprites/south-states-sprite.png",
        iconWidth: 63.75,
        iconHeight: 60,
        mobileIconWidth: 40,
        mobileIconHeight: 37,
        imageWidthPct: 1135.69,
        imageHeightPct: 402.22,
        imageLeftPct: -303.46,
        imageTopPct: -126.11,
      },
      {
        id: "maharashtra",
        label: "Maharashtra",
        spriteSrc: "/images/stores/state-icons/sprites/south-states-sprite.png",
        iconWidth: 62.66,
        iconHeight: 64,
        mobileIconWidth: 40,
        mobileIconHeight: 41,
        imageWidthPct: 1161.5,
        imageHeightPct: 379.06,
        imageLeftPct: -83.96,
        imageTopPct: -116.23,
      },
      {
        id: "new-delhi",
        label: "New Delhi",
        spriteSrc: "/images/stores/state-icons/sprites/south-states-sprite.png",
        iconWidth: 80.711,
        iconHeight: 64,
        mobileIconWidth: 48,
        mobileIconHeight: 38,
        imageWidthPct: 956.83,
        imageHeightPct: 402.22,
        imageLeftPct: -429.96,
        imageTopPct: -122.22,
      },
      {
        id: "telangana",
        label: "Telangana",
        spriteSrc: "/images/stores/state-icons/sprites/south-states-sprite.png",
        iconWidth: 75.738,
        iconHeight: 64,
        mobileIconWidth: 48,
        mobileIconHeight: 41,
        imageWidthPct: 801.48,
        imageHeightPct: 316.16,
        imageLeftPct: -497.05,
        imageTopPct: -80.35,
      },
      {
        id: "kerala",
        label: "Kerala",
        spriteSrc: "/images/stores/state-icons/sprites/kerala-sprite.png",
        iconWidth: 94.28,
        iconHeight: 64,
        mobileIconWidth: 48,
        mobileIconHeight: 33,
        imageWidthPct: 451.34,
        imageHeightPct: 303.94,
        imageLeftPct: -246.96,
        imageTopPct: -81,
      },
    ] satisfies StoreLocatorStateFilter[],
  },
} as const;
