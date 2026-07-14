"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AddItemResult, CartLineItem } from "../types/cart.types";

type BagDrawerSnapshot = {
  lineItemId: string;
  lineItem: CartLineItem;
  totalItemsAfterAdd: number;
};

type CartUIContextType = {
  isBagDrawerOpen: boolean;
  lastAddedLineItemId: string | null;
  bagDrawerSnapshot: BagDrawerSnapshot | null;
  isGiftingPanelOpen: boolean;
  giftingStep: "intro" | "personalise";
  openBagDrawer: (result: AddItemResult) => void;
  closeBagDrawer: () => void;
  openGiftingPanel: (step?: "intro" | "personalise") => void;
  closeGiftingPanel: () => void;
};

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [lastAddedLineItemId, setLastAddedLineItemId] = useState<string | null>(null);
  const [bagDrawerSnapshot, setBagDrawerSnapshot] = useState<BagDrawerSnapshot | null>(null);
  const [isGiftingPanelOpen, setIsGiftingPanelOpen] = useState(false);
  const [giftingStep, setGiftingStep] = useState<"intro" | "personalise">("intro");

  const openBagDrawer = useCallback((result: AddItemResult) => {
    setLastAddedLineItemId(result.lineItemId);
    setBagDrawerSnapshot({
      lineItemId: result.lineItemId,
      lineItem: result.lineItem,
      totalItemsAfterAdd: result.totalItemsAfterAdd,
    });
    setIsBagDrawerOpen(true);
  }, []);

  const closeBagDrawer = useCallback(() => {
    setIsBagDrawerOpen(false);
  }, []);

  const openGiftingPanel = useCallback((step: "intro" | "personalise" = "intro") => {
    setGiftingStep(step);
    setIsGiftingPanelOpen(true);
  }, []);

  const closeGiftingPanel = useCallback(() => {
    setIsGiftingPanelOpen(false);
    setGiftingStep("intro");
  }, []);

  return (
    <CartUIContext.Provider
      value={{
        isBagDrawerOpen,
        lastAddedLineItemId,
        bagDrawerSnapshot,
        isGiftingPanelOpen,
        giftingStep,
        openBagDrawer,
        closeBagDrawer,
        openGiftingPanel,
        closeGiftingPanel,
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) throw new Error("useCartUI must be used within CartUIProvider");
  return context;
}
