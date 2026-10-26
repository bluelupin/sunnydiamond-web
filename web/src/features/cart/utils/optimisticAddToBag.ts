import type { Product } from "@/features/products/data/products";
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

  return {
    lineItemId,
    lineItem: {
      id: lineItemId,
      product,
      quantity: 1,
      options,
    },
    totalItemsAfterAdd: currentTotalItems + 1,
  };
}

/** Snapshot for instant bag drawer UI while a cart line update completes. */
export function buildOptimisticUpdateItemResult(
  payload: AddToBagPayload | Product,
  currentTotalItems: number,
): AddItemResult {
  return {
    ...buildOptimisticAddItemResult(payload, currentTotalItems),
    totalItemsAfterAdd: currentTotalItems,
  };
}
