"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AddItemResult, CartLineItem } from "../types/cart.types";

type BagDrawerSnapshot = {
  lineItemId: string;
  lineItem: CartLineItem;
  totalItemsAfterAdd: number;
};

export type BagDrawerMode = "add" | "update";

type CartUIContextType = {
  isBagDrawerOpen: boolean;
  bagDrawerMode: BagDrawerMode;
  lastAddedLineItemId: string | null;
  bagDrawerSnapshot: BagDrawerSnapshot | null;
  isGiftingPanelOpen: boolean;
  giftingStep: "intro" | "personalise";
  hasExploredGiftingOptions: boolean;
  isGuestCheckoutModalOpen: boolean;
  isNavigatingToCheckout: boolean;
  tryBeginBagAction: () => boolean;
  endBagAction: () => void;
  openBagDrawer: (result: AddItemResult, options?: { mode?: BagDrawerMode }) => void;
  closeBagDrawer: () => void;
  openGiftingPanel: (step?: "intro" | "personalise") => void;
  closeGiftingPanel: () => void;
  markGiftingOptionsExplored: () => void;
  /** Reset so checkout shows the gifting nudge again (e.g. newly marked gift). */
  clearGiftingOptionsExplored: () => void;
  openGuestCheckoutModal: () => void;
  closeGuestCheckoutModal: () => void;
  startCheckoutNavigation: () => void;
};

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [bagDrawerMode, setBagDrawerMode] = useState<BagDrawerMode>("add");
  const [lastAddedLineItemId, setLastAddedLineItemId] = useState<string | null>(null);
  const [bagDrawerSnapshot, setBagDrawerSnapshot] = useState<BagDrawerSnapshot | null>(null);
  const [isGiftingPanelOpen, setIsGiftingPanelOpen] = useState(false);
  const [giftingStep, setGiftingStep] = useState<"intro" | "personalise">("intro");
  const [hasExploredGiftingOptions, setHasExploredGiftingOptions] = useState(false);
  const [isGuestCheckoutModalOpen, setIsGuestCheckoutModalOpen] = useState(false);
  const [isNavigatingToCheckout, setIsNavigatingToCheckout] = useState(false);
  const isBagDrawerOpenRef = useRef(false);
  const bagActionInFlightRef = useRef(false);
  const lastBagDrawerOpenRef = useRef<{ lineItemId: string; at: number } | null>(null);

  const tryBeginBagAction = useCallback(() => {
    if (bagActionInFlightRef.current) {
      return false;
    }

    bagActionInFlightRef.current = true;
    return true;
  }, []);

  const endBagAction = useCallback(() => {
    bagActionInFlightRef.current = false;
  }, []);

  const applyBagDrawerResult = useCallback(
    (result: AddItemResult, options?: { mode?: BagDrawerMode }) => {
      setBagDrawerMode(options?.mode ?? "add");
      setLastAddedLineItemId(result.lineItemId);
      setBagDrawerSnapshot({
        lineItemId: result.lineItemId,
        lineItem: result.lineItem,
        totalItemsAfterAdd: result.totalItemsAfterAdd,
      });
    },
    [],
  );

  const openBagDrawer = useCallback(
    (result: AddItemResult, options?: { mode?: BagDrawerMode }) => {
      const now = Date.now();
      const lastOpen = lastBagDrawerOpenRef.current;
      const isDuplicateOpen =
        isBagDrawerOpenRef.current &&
        lastOpen?.lineItemId === result.lineItemId &&
        now - lastOpen.at < 1000;

      applyBagDrawerResult(result, options);

      if (isDuplicateOpen) {
        return;
      }

      lastBagDrawerOpenRef.current = { lineItemId: result.lineItemId, at: now };

      if (!isBagDrawerOpenRef.current) {
        isBagDrawerOpenRef.current = true;
        setIsBagDrawerOpen(true);
      }
    },
    [applyBagDrawerResult],
  );

  const closeBagDrawer = useCallback(() => {
    isBagDrawerOpenRef.current = false;
    lastBagDrawerOpenRef.current = null;
    setIsBagDrawerOpen(false);
    setBagDrawerMode("add");
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

  const startCheckoutNavigation = useCallback(() => {
    setIsNavigatingToCheckout(true);
  }, []);

  return (
    <CartUIContext.Provider
      value={{
        isBagDrawerOpen,
        bagDrawerMode,
        lastAddedLineItemId,
        bagDrawerSnapshot,
        isGiftingPanelOpen,
        giftingStep,
        hasExploredGiftingOptions,
        isGuestCheckoutModalOpen,
        isNavigatingToCheckout,
        tryBeginBagAction,
        endBagAction,
        openBagDrawer,
        closeBagDrawer,
        openGiftingPanel,
        closeGiftingPanel,
        markGiftingOptionsExplored,
        clearGiftingOptionsExplored,
        openGuestCheckoutModal,
        closeGuestCheckoutModal,
        startCheckoutNavigation,
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
