export type CustomerWishlistItem = {
  id: string;
  sku: string;
};

export type CustomerWishlist = {
  wishlistId: string;
  skus: string[];
  items: CustomerWishlistItem[];
};
