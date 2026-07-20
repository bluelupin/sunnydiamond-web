/** Figma node 2083:16262 — wishlist page heading (desktop) */
export const wishlistHeadingSpec = {
  minHeight: 95,
  titleGap: 8,
  titleFontSize: {
    mobile: 32,
    desktop: 48,
  },
  countFontSize: {
    mobile: 16,
    desktop: 20,
  },
  countColor: "#4D4D4D",
  dividerColor: "#CCCCCC",
} as const;

/** Figma node 2083:15337 — wishlist page heading (mobile) */
export const wishlistHeadingMobileSpec = {
  minHeight: 140,
  paddingY: 24,
  titleGap: 8,
  toggleGap: 24,
  toggleSize: 24,
  toggleTopGap: 24,
  activeColor: "#0A0A0A",
  inactiveColor: "#CCCCCC",
} as const;

export type WishlistViewMode = "grid" | "list";

/** Figma node 2083:16290 — wishlist product card (desktop) */
export const wishlistCardDesktopSpec = {
  width: 474,
  height: 521,
  paddingX: 24,
  paddingBottom: 40,
  titleFontSize: 20,
  priceFontSize: 20,
  actionsGap: 32,
  columns: 3,
  gridGap: 24,
} as const;

/** Figma node 2083:15364 — wishlist card remove icon */
export const wishlistRemoveIconSpec = {
  size: 20,
  inset: 16,
  strokeWidth: 1.5,
  color: "#0A0A0A",
} as const;

/** Figma node 2083:15370 — wishlist card product name (mobile) */
export const wishlistProductNameMobileSpec = {
  width: 153,
  height: 30,
  fontSize: 14,
  lineHeight: 110,
  color: "#0A0A0A",
  maxLines: 2,
} as const;

/** Figma node 2083:15356 — wishlist product card (mobile) */
export const wishlistCardMobileSpec = {
  width: 185,
  height: 270,
  paddingX: 16,
  paddingTop: 16,
  paddingBottom: 24,
  imageMaxHeight: 120,
  titleFontSize: 14,
  priceFontSize: 14,
  trashSize: 20,
  trashInset: 16,
  copyGap: 8,
  columns: 2,
  backgroundColor: "#FFFFFF",
} as const;

/** Figma node 2083:16191 — wishlist page (desktop) */
export const wishlistPageDesktopSpec = {
  paddingTop: 60,
  paddingBottom: 80,
  titleFontSize: 48,
  countFontSize: 20,
  countColor: "#4D4D4D",
  itemGap: 0,
  imageSize: 200,
  rowPaddingY: 32,
  rowPaddingX: 0,
  dividerColor: "#CCCCCC",
} as const;

/** Figma node 2083:15332 — wishlist page (mobile) */
export const wishlistPageMobileSpec = {
  paddingTop: 32,
  paddingBottom: 48,
  titleFontSize: 32,
  countFontSize: 16,
  countColor: "#4D4D4D",
  itemGap: 0,
  imageSize: 120,
  rowPaddingY: 24,
  rowPaddingX: 0,
  dividerColor: "#CCCCCC",
} as const;

export const wishlistPageContent = {
  title: "Your Wishlist",
  emptyTitle: "Your wishlist is empty",
  emptyDescription: "Save pieces you love and find them here anytime.",
  emptyCta: "Explore Jewellery",
  emptyCtaHref: "/jewellery",
  addToBagLabel: "ADD TO BAG",
  removeLabel: "REMOVE",
  productCountLabel: (count: number) => `${count} ${count === 1 ? "Product" : "Products"}`,
  gridViewLabel: "Grid view",
  listViewLabel: "List view",
  movedToWishlistMessage: "Item moved to Wishlist",
  movedToWishlistViewLabel: "VIEW",
  movedToWishlistHref: "/wishlist",
} as const;

export const wishlistMovedToastDurationMs = 4000;
