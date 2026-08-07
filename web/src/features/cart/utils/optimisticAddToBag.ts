import type { Product } from "@/features/products/data/products";
import { getProductDisplayPrice } from "@/features/products/data/productDetailContent";
import type { AddItemResult, AddToBagPayload } from "../types/cart.types";

const isAddToBagPayload = (payload: AddToBagPayload | Product): payload is AddToBagPayload =>
  "product" in payload;

/** Snapshot for instant bag drawer UI while Magento add-to-cart completes. */
export function buildOptimisticAddItemResult(
  payload: AddToBagPayload | Product,
  currentTotalItems: number,
): AddItemResult {
  const product = isAddToBagPayload(payload) ? payload.product : payload;
  const options = isAddToBagPayload(payload) ? (payload.options ?? {}) : {};
  const lineItemId = `optimistic-${product.id}`;
  const displayPrice = getProductDisplayPrice(product);

  return {
    lineItemId,
    lineItem: {
      id: lineItemId,
      product,
      quantity: 1,
      options,
      displayPrice,
    },
    totalItemsAfterAdd: currentTotalItems + 1,
  };
}
