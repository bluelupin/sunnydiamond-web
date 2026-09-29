"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "@/features/cart/context/CartContext";
import { readStoredCartLines } from "@/features/cart/utils/cartProduct.utils";
import { getGuestCartId } from "@/services/magento/cart/cartSession";

function hasPersistedCartSession(): boolean {
  return Boolean(getGuestCartId()) || readStoredCartLines().length > 0;
}

/** True on `/cart` when the page should use the empty-cart shell surfaces. */
export function useIsCartEmptyPageShell(): boolean {
  const pathname = usePathname() ?? "/";
  const { items, totalItems, isHydrating } = useCart();
  const { status } = useAuth();

  if (pathname !== "/cart") {
    return false;
  }

  if (items.length > 0 || totalItems > 0) {
    return false;
  }

  if (!isHydrating) {
    return true;
  }

  // Auth/cart still resolving — prefer the filled-cart shell to avoid gray200 on non-empty carts.
  if (status === "loading" || status === "authenticated") {
    return false;
  }

  return !hasPersistedCartSession();
}
