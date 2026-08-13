"use client";

import { useCallback, useRef } from "react";
import type { Product } from "@/features/products/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { toast } from "@/shared/ui/sonner";

export function useAddToBagWithDrawer() {
  const { addItem, replaceLineItem } = useCart();
  const { openBagDrawer, closeBagDrawer } = useCartUI();
  const bagActionInFlightRef = useRef(false);

  const addToBagAndOpenDrawer = useCallback(
    async (payload: AddToBagPayload | Product) => {
      if (bagActionInFlightRef.current) {
        return;
      }

      bagActionInFlightRef.current = true;

      try {
        const result = await addItem(payload);
        openBagDrawer(result);
      } catch (error) {
        closeBagDrawer();
        console.error("Add to bag failed:", error);
        toast.error("Couldn't add this item to your bag. Please try again.");
      } finally {
        bagActionInFlightRef.current = false;
      }
    },
    [addItem, closeBagDrawer, openBagDrawer],
  );

  const updateBagAndOpenDrawer = useCallback(
    async (lineItemId: string, payload: AddToBagPayload) => {
      if (bagActionInFlightRef.current) {
        return;
      }

      bagActionInFlightRef.current = true;

      try {
        const result = await replaceLineItem(lineItemId, payload);
        openBagDrawer(result, { mode: "update" });
      } catch (error) {
        closeBagDrawer();
        console.error("Update bag failed:", error);
        toast.error("Couldn't update this item in your bag. Please try again.");
      } finally {
        bagActionInFlightRef.current = false;
      }
    },
    [closeBagDrawer, openBagDrawer, replaceLineItem],
  );

  return { addToBagAndOpenDrawer, updateBagAndOpenDrawer };
}
