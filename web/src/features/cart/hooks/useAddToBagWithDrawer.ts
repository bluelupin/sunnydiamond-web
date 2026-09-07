"use client";

import { useCallback } from "react";
import type { Product } from "@/features/products/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { formatAddToBagErrorMessage } from "@/features/cart/utils/formatAddToBagError";

export function useAddToBagWithDrawer() {
  const { addItem, replaceLineItem, showCartStatusToast } = useCart();
  const { openBagDrawer, closeBagDrawer, tryBeginBagAction, endBagAction } = useCartUI();

  const addToBagAndOpenDrawer = useCallback(
    async (payload: AddToBagPayload | Product) => {
      if (!tryBeginBagAction()) {
        return;
      }

      try {
        const result = await addItem(payload);
        openBagDrawer(result);
      } catch (error) {
        closeBagDrawer();
        console.error("Add to bag failed:", error);
        showCartStatusToast(formatAddToBagErrorMessage(error));
      } finally {
        endBagAction();
      }
    },
    [addItem, closeBagDrawer, endBagAction, openBagDrawer, showCartStatusToast, tryBeginBagAction],
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
