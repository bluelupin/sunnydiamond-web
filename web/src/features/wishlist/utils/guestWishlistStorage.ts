import { WISHLIST_STORAGE_KEY } from "@/features/wishlist/constants";
import { normalizeWishlistSkus } from "@/features/wishlist/utils/wishlistProduct.utils";

export function readGuestWishlistFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? normalizeWishlistSkus(parsed.filter((sku): sku is string => typeof sku === "string"))
      : [];
  } catch {
    return [];
  }
}

export function writeGuestWishlistToStorage(skus: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeWishlistSkus(skus);
  if (normalized.length === 0) {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearGuestWishlistStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
}
