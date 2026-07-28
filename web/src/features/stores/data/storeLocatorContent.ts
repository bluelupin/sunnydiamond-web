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
  /** Figma node 1480:176350 — search + state filters */
  paddingY: 40,
  contentMaxWidth: 676,
  searchHeight: 56,
  stateItemWidth: 86,
  stateIconHeight: 64,
} as const;

export type StoreLocatorStateFilter = {
  id: string;
  label: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
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
        iconSrc: "/images/stores/state-icons/tamil-nadu.png",
        iconWidth: 70,
        iconHeight: 64,
      },
      {
        id: "karnataka",
        label: "Karnataka",
        iconSrc: "/images/stores/state-icons/karnataka.svg",
        iconWidth: 64,
        iconHeight: 60,
      },
      {
        id: "maharashtra",
        label: "Maharashtra",
        iconSrc: "/images/stores/state-icons/maharashtra.svg",
        iconWidth: 81,
        iconHeight: 64,
      },
      {
        id: "new-delhi",
        label: "New Delhi",
        iconSrc: "/images/stores/state-icons/new-delhi.svg",
        iconWidth: 81,
        iconHeight: 64,
      },
      {
        id: "telangana",
        label: "Telangana",
        iconSrc: "/images/stores/state-icons/telangana.svg",
        iconWidth: 76,
        iconHeight: 64,
      },
      {
        id: "kerala",
        label: "Kerala",
        iconSrc: "/images/stores/state-icons/kerala.svg",
        iconWidth: 94,
        iconHeight: 64,
      },
    ] satisfies StoreLocatorStateFilter[],
  },
} as const;
