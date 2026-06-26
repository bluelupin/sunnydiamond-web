/** Figma node 692:4114 — jewellery product list hero banner */
export const jewelleryListingHeroSpec = {
  title: "Handcrafted Brilliance",
  height: {
    mobile: 240,
    desktop: 320,
  },
  overlayOpacity: 0.4,
  titleTop: {
    mobile: 152,
    desktop: 203,
  },
  titleFontSize: {
    mobile: 32,
    desktop: 48,
  },
} as const;

export const jewelleryListingHeroAssets = {
  desktop: "/images/jewellery/plp-hero.webp",
  mobile: "/images/jewellery/plp-hero.webp",
  alt: "Handcrafted Brilliance — diamond jewellery collection",
} as const;

/** Figma node 692:4117 — jewellery product list category nav */
export const jewelleryListingCategoryNavSpec = {
  padding: 40,
  itemWidth: 86,
  itemGap: 8,
  navGap: 32,
  iconSize: 40,
  labelFontSize: 16,
  labelLineHeight: 1.1,
  activeLabelColor: "#0A0A0A",
  inactiveLabelColor: "#999999",
  borderColor: "#CCCCCC",
} as const;

/** Figma node 692:4232 — jewellery product list toolbar (sticky) */
export const jewelleryListingToolbarSpec = {
  height: 94,
  paddingX: 40,
  productCountColor: "#4D4D4D",
  productCountFontSize: 20,
  controlFontSize: 20,
  controlColor: "#0A0A0A",
  controlsGap: 56,
  controlInnerGap: 12,
  filterPaddingY: 6,
  sortPaddingX: 12,
  sortPaddingY: 8,
  iconSize: 24,
} as const;

export const jewelleryListingToolbarAssets = {
  filterIcon: "/images/jewellery/filter-icon.svg",
  chevronDownIcon: "/images/jewellery/chevron-down.svg",
} as const;

/** Figma node 692:4144 — jewellery product list card (default state) */
export const jewelleryListingProductCardSpec = {
  height: 496,
  paddingX: 24,
  paddingY: 40,
  sectionGap: 24,
  imageHeight: 303,
  copyGap: 12,
  copyPaddingX: 12,
  fontSize: 20,
  textColor: "#0A0A0A",
  backgroundColor: "#FBFAF6",
  wishlistSize: 32,
  wishlistInset: 24,
} as const;

/** Figma node 692:4242 — jewellery product list pagination / load more */
export const jewelleryListingPaginationSpec = {
  width: 360,
  sectionGap: 24,
  statusGap: 12,
  countFontSize: 16,
  countColor: "#0A0A0A",
  progressTrackHeight: 2,
  progressFillHeight: 3,
  progressTrackColor: "#CCCCCC",
  progressFillColor: "#0A0A0A",
  buttonHeight: 56,
  buttonPaddingX: 28,
  buttonPaddingY: 20,
  buttonFontSize: 14,
  buttonColor: "#0A0A0A",
  buttonBorderColor: "#CCCCCC",
} as const;

/** Figma node 692:4249 — jewellery product list guarantees bar */
export const jewelleryListingGuaranteesSpec = {
  height: 264,
  paddingX: 180,
  paddingY: 64,
  itemWidth: 260,
  itemHeight: 136,
  itemPadding: 12,
  itemGap: 12,
  iconSize: 64,
  labelFontSize: 20,
  labelColor: "#0A0A0A",
  dividerColor: "#999999",
  backgroundColor: "#FBFAF6",
} as const;

export const jewelleryListingGuarantees = [
  {
    iconSrc: "/images/about/guarantees/moneyback.svg",
    label: "100% Moneyback Guarantee",
  },
  {
    iconSrc: "/images/about/guarantees/return.svg",
    label: "15 Days Return Policy",
  },
  {
    iconSrc: "/images/about/guarantees/cod.svg",
    label: "Cash on Delivery",
  },
] as const;
