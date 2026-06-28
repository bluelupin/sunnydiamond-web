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

/** Figma node 692:4117 — jewellery product list category nav (desktop) */
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

/** Figma node 692:4847 — jewellery product list category nav (mobile) */
export const jewelleryListingCategoryNavMobileSpec = {
  paddingX: 16,
  paddingY: 24,
  navGap: 12,
  itemWidth: 56,
  itemGap: 8,
  iconSize: 24,
  labelFontSize: 14,
  labelLineHeight: 1.1,
  activeLabelColor: "#4D4D4D",
  inactiveLabelColor: "#999999",
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
  chevronDownIcon: "/images/jewellery/chevron-down-24.svg",
  chevronDownMobileIcon: "/images/jewellery/chevron-down-20.svg",
} as const;

/** Figma node 1279:1015 — mobile sticky filter / sort footer bar */
export const jewelleryListingMobileFooterSpec = {
  height: 64,
  paddingX: 16,
  controlHeight: 32,
  controlGap: 8,
  fontSize: 16,
  iconSize: 20,
  textColor: "#0A0A0A",
  backgroundColor: "#FFFFFF",
} as const;

/** Figma node 692:4876 / 692:4174 — mobile product image frame */
export const jewelleryListingProductCardMobileSpec = {
  height: 227,
  paddingX: 16,
  paddingY: 24,
  sectionGap: 16,
  imageClipHeight: 110,
  /** Figma 692:4901 — ring image frame, reduced 10% from 134px */
  imageInnerSize: 121,
  copyGap: 8,
  copyFontSize: 14,
  bestsellerHeight: 28,
  bestsellerPadding: 8,
  bestsellerFontSize: 12,
  wishlistSize: 20,
  wishlistInset: 8,
} as const;

/** Figma node 692:4144 — jewellery product list card (default state) */
export const jewelleryListingProductCardSpec = {
  height: 496,
  paddingX: 24,
  paddingY: 40,
  sectionGap: 24,
  imageClipHeight: 303,
  /** Figma 692:4146 — inner image frame, reduced 10% from 319×413 */
  imageInnerHeight: 287,
  imageInnerWidth: 372,
  imageScaleHeight: 214.8,
  imageScaleWidth: 128.01,
  imageOffsetLeft: -13.92,
  imageOffsetTop: -57.12,
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

/** Figma node 692:4740 — jewellery product list filter drawer */
export const jewelleryListingFilterDrawerSpec = {
  panelWidth: 474,
  contentWidth: 424,
  contentInset: 24,
  headerTop: 40,
  headerHeight: 32,
  dividerTop: 94,
  contentTop: 116,
  sectionGap: 24,
  titleGap: 16,
  chipRowGap: 12,
  chipGap: 7,
  chipCheckGap: 4,
  chipHeight: 56,
  chipPaddingX: 24,
  chipPaddingY: 12,
  chipFontSize: 16,
  checkIconSize: 18,
  closeIconSize: 32,
  titleFontSize: 24,
  sectionTitleFontSize: 16,
  bodyFontSize: 14,
  selectFontSize: 16,
  inputHeight: 56,
  inputPadding: 12,
  labelInputGap: 8,
  selectChevronSize: 24,
  selectChevronIconWidth: 7.038,
  selectChevronIconHeight: 14.651,
  sliderTrackHeight: 4,
  sliderFillHeight: 3,
  sliderThumbSize: 12,
  sliderLabelGap: 12,
  minMaxColumnGap: 24,
  footerGradientHeight: 71,
  footerPaddingX: 40,
  footerPaddingY: 24,
  footerButtonGap: 24,
  buttonHeight: 56,
  buttonPaddingX: 28,
  buttonPaddingY: 20,
  buttonFontSize: 14,
  footerBorderWidth: 0.5,
  clearButtonBorderWidth: 0.8,
  inputBackground: "#F2F2F2",
  trackColor: "#CCCCCC",
  fillColor: "#0A0A0A",
  focusedBorderColor: "#4D4D4D",
  placeholderColor: "#999999",
  scrollbarWidth: 2,
} as const;

/** Figma node 692:4805 — filter drawer gemstone select chevron */
export const jewelleryListingFilterDrawerAssets = {
  selectChevronIcon: "/images/jewellery/chevron-down-filter.svg",
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
  mobileIconSize: 40,
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
