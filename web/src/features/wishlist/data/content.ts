export type WishlistViewMode = "grid" | "list";

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
  removedFromWishlistMessage: "Item removed from wishlist",
  removedFromWishlistUndoLabel: "UNDO",
  movedToWishlistViewLabel: "VIEW",
  movedToWishlistHref: "/profile?section=wishlist",
  loadErrorMessage: "Unable to load wishlist products. Please try again.",
} as const;

export const wishlistMovedToastDurationMs = 4000;

/** Longer window so users can undo a wishlist removal. */
export const wishlistRemovedToastDurationMs = 8000;
