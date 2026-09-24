import type { CartLineItem } from "../types/cart.types";

export function isCartLineMarkedGift(item: CartLineItem): boolean {
  if (item.options.isGift === false) {
    return false;
  }

  return Boolean(item.options.isGift || item.gifting);
}
