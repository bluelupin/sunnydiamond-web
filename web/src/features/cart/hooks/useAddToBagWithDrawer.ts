"use client";

import { useCallback } from "react";
import type { Product } from "@/features/products/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { buildOptimisticAddItemResult } from "@/features/cart/utils/optimisticAddToBag";

export function useAddToBagWithDrawer() {
  const { addItem, totalItems } = useCart();
  const { openBagDrawer, closeBagDrawer } = useCartUI();

  const addToBagAndOpenDrawer = useCallback(
    async (payload: AddToBagPayload | Product) => {
      openBagDrawer(buildOptimisticAddItemResult(payload, totalItems));

      try {
        const result = await addItem(payload);
        openBagDrawer(result);
      } catch (error) {
        closeBagDrawer();
        throw error;
      }
    },
    [addItem, closeBagDrawer, openBagDrawer, totalItems],
  );

  return { addToBagAndOpenDrawer };
}
