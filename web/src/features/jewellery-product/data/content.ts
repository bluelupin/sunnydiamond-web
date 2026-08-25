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

export const jewelleryListingEmptyStateContent = {
  filterTitle: "No products found",
  filterDescription: "Try adjusting your filters to see more products.",
  clearFiltersLabel: "Clear All Filters",
} as const;
