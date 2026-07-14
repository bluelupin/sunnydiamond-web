import { jewelleryListingProducts } from "@/features/jewellery-product/data/products";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

const listingProductById = new Map(
  jewelleryListingProducts.map((product) => [product.id, product]),
);

const defaultListingByBaseId = new Map<string, JewelleryListingProduct>();
for (const product of jewelleryListingProducts) {
  const baseId = product.id.split("-")[0];
  if (!defaultListingByBaseId.has(baseId)) {
    defaultListingByBaseId.set(baseId, product);
  }
}

export function resolveWishlistProducts(wishlistedIds: string[]): JewelleryListingProduct[] {
  if (wishlistedIds.length === 0) return [];

  return wishlistedIds
    .map((id) => listingProductById.get(id) ?? defaultListingByBaseId.get(id))
    .filter((product): product is JewelleryListingProduct => product != null);
}

export function getWishlistRemovalId(productId: string, wishlistedIds: string[]): string {
  if (wishlistedIds.includes(productId)) return productId;

  const baseId = productId.split("-")[0];
  if (wishlistedIds.includes(baseId)) return baseId;

  return productId;
}

export function getWishlistProductHref(productId: string): string {
  const baseId = productId.split("-")[0];
  return `/product/${baseId}`;
}
