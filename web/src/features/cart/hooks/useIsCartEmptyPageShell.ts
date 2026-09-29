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
  const { items, isHydrating } = useCart();
  const { status } = useAuth();

  if (pathname !== "/cart" || items.length > 0) {
    return false;
  }

  if (!isHydrating) {
    return true;
  }

  if (status === "authenticated") {
    return false;
  }

  return !hasPersistedCartSession();
}
