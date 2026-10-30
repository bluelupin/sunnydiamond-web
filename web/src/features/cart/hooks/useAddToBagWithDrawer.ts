"use client";

import { useCallback } from "react";
import type { Product } from "@/features/products/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { formatAddToBagErrorMessage } from "@/features/cart/utils/formatAddToBagError";
import { buildOptimisticAddItemResult } from "@/features/cart/utils/optimisticAddToBag";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { resolveWishlistSkuFromAddToBagPayload } from "@/features/wishlist/utils/resolveWishlistSkuFromAddToBag";

export function useAddToBagWithDrawer() {
  const { addItem, replaceLineItem, showCartStatusToast, totalItems } = useCart();
  const { isWishlisted, removeFromWishlist } = useWishlist();
  const {
    openBagDrawer,
    updateBagDrawerResult,
    closeBagDrawer,
    tryBeginBagAction,
    endBagAction,
  } = useCartUI();

  const addToBagAndOpenDrawer = useCallback(
    async (payload: AddToBagPayload | Product): Promise<boolean> => {
      if (!tryBeginBagAction()) {
        return false;
      }

      openBagDrawer(buildOptimisticAddItemResult(payload, totalItems));

      try {
        const result = await addItem(payload);
        updateBagDrawerResult(result);

        const wishlistSku = resolveWishlistSkuFromAddToBagPayload(payload);
        if (wishlistSku && isWishlisted(wishlistSku)) {
          try {
            await removeFromWishlist(wishlistSku, { showRemovedToast: false });
          } catch (error) {
            console.error("Wishlist sync after add to bag failed:", error);
          }
        }

        return true;
      } catch (error) {
        closeBagDrawer();
        console.error("Add to bag failed:", error);
        showCartStatusToast(formatAddToBagErrorMessage(error));
        return false;
      } finally {
        endBagAction();
      }
    },
    [
      addItem,
      closeBagDrawer,
      endBagAction,
      isWishlisted,
      openBagDrawer,
      removeFromWishlist,
      showCartStatusToast,
      totalItems,
      tryBeginBagAction,
      updateBagDrawerResult,
    ],
  );

  const updateBagAndOpenDrawer = useCallback(
    async (lineItemId: string, payload: AddToBagPayload) => {
      if (!tryBeginBagAction()) {
        return;
      }

      try {
        const result = await replaceLineItem(lineItemId, payload);
        openBagDrawer(result, { mode: "update" });
      } catch (error) {
        closeBagDrawer();
        console.error("Update bag failed:", error);
        showCartStatusToast(formatAddToBagErrorMessage(error));
      } finally {
        endBagAction();
      }
    },
    [
      closeBagDrawer,
      endBagAction,
      openBagDrawer,
      replaceLineItem,
      showCartStatusToast,
      tryBeginBagAction,
    ],
  );

  return { addToBagAndOpenDrawer, updateBagAndOpenDrawer };
}
