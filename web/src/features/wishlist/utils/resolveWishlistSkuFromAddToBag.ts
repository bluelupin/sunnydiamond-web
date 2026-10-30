import type { Product } from "@/features/products/data/products";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";

const isAddToBagPayload = (payload: AddToBagPayload | Product): payload is AddToBagPayload =>
  "product" in payload;

/** Wishlist entries are keyed by the catalog (parent configurable) SKU on `product.id`. */
export function resolveWishlistSkuFromAddToBagPayload(
  payload: AddToBagPayload | Product,
): string | null {
  const product = isAddToBagPayload(payload) ? payload.product : payload;
  const sku = product.id?.trim();
  return sku || null;
}
