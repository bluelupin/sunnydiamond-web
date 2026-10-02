const GUEST_CART_ID_KEY = "sunny-guest-cart-id";
const CART_LINE_METADATA_KEY = "sunny-cart-line-meta-v1";
const CART_LINE_ORDER_KEY = "sunny-cart-line-order-v1";

import type { CartGiftingOptions, CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";

export type CartLineMetadata = {
  options: CartLineOptions;
  gifting?: CartGiftingOptions;
  productCustomOptions?: ProductCustomOptions;
  /** Catalog final price shown on PDP / Price Breakup — persisted for cart line display. */
  displayPrice?: number;
  /** Configured product image from PDP (e.g. selected metal variant) — persisted for cart UI. */
  displayImage?: string;
};

export type StoredCartLineMetadata = Record<string, CartLineMetadata>;

export function getGuestCartId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cartId = window.localStorage.getItem(GUEST_CART_ID_KEY)?.trim();
  return cartId || null;
}

export function setGuestCartId(cartId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_CART_ID_KEY, cartId);
}

export function clearGuestCartId(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_CART_ID_KEY);
}

export function readCartLineMetadata(): StoredCartLineMetadata {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CART_LINE_METADATA_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as StoredCartLineMetadata;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCartLineMetadata(metadata: StoredCartLineMetadata): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_LINE_METADATA_KEY, JSON.stringify(metadata));
}

export function readCartLineOrder(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_LINE_ORDER_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((key): key is string => typeof key === "string" && key.trim().length > 0);
  } catch {
    return [];
  }
}

export function writeCartLineOrder(orderKeys: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  if (orderKeys.length === 0) {
    window.localStorage.removeItem(CART_LINE_ORDER_KEY);
    return;
  }

  window.localStorage.setItem(CART_LINE_ORDER_KEY, JSON.stringify(orderKeys));
}
