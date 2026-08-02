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
  hasExploredGiftingOptions: boolean;
  isGuestCheckoutModalOpen: boolean;
  openBagDrawer: (result: AddItemResult) => void;
  closeBagDrawer: () => void;
  openGiftingPanel: (step?: "intro" | "personalise") => void;
  closeGiftingPanel: () => void;
  markGiftingOptionsExplored: () => void;
  /** Reset so checkout shows the gifting nudge again (e.g. newly marked gift). */
  clearGiftingOptionsExplored: () => void;
  openGuestCheckoutModal: () => void;
  closeGuestCheckoutModal: () => void;
};

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [lastAddedLineItemId, setLastAddedLineItemId] = useState<string | null>(null);
  const [bagDrawerSnapshot, setBagDrawerSnapshot] = useState<BagDrawerSnapshot | null>(null);
  const [isGiftingPanelOpen, setIsGiftingPanelOpen] = useState(false);
  const [giftingStep, setGiftingStep] = useState<"intro" | "personalise">("intro");
  const [hasExploredGiftingOptions, setHasExploredGiftingOptions] = useState(false);
  const [isGuestCheckoutModalOpen, setIsGuestCheckoutModalOpen] = useState(false);

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

  const markGiftingOptionsExplored = useCallback(() => {
    setHasExploredGiftingOptions(true);
  }, []);

  const clearGiftingOptionsExplored = useCallback(() => {
    setHasExploredGiftingOptions(false);
  }, []);

  const openGuestCheckoutModal = useCallback(() => {
    setIsGuestCheckoutModalOpen(true);
  }, []);

  const closeGuestCheckoutModal = useCallback(() => {
    setIsGuestCheckoutModalOpen(false);
  }, []);

  return (
    <CartUIContext.Provider
      value={{
        isBagDrawerOpen,
        lastAddedLineItemId,
        bagDrawerSnapshot,
        isGiftingPanelOpen,
        giftingStep,
        hasExploredGiftingOptions,
        isGuestCheckoutModalOpen,
        openBagDrawer,
        closeBagDrawer,
        openGiftingPanel,
        closeGiftingPanel,
        markGiftingOptionsExplored,
        clearGiftingOptionsExplored,
        openGuestCheckoutModal,
        closeGuestCheckoutModal,
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
