"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
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
  hasConsumedGiftingEdit: boolean;
  isGuestCheckoutModalOpen: boolean;
  isNavigatingToCheckout: boolean;
  tryBeginBagAction: () => boolean;
  endBagAction: () => void;
  openBagDrawer: (result: AddItemResult, options?: { mode?: BagDrawerMode }) => void;
  /** Refresh drawer content after add-to-bag completes without re-opening the panel. */
  updateBagDrawerResult: (result: AddItemResult, options?: { mode?: BagDrawerMode }) => void;
  handleBagDrawerOpenChange: (open: boolean) => void;
  closeBagDrawer: () => void;
  openGiftingPanel: (step?: "intro" | "personalise") => void;
  closeGiftingPanel: () => void;
  markGiftingOptionsExplored: () => void;
  /** Reset so checkout shows the gifting nudge again (e.g. newly marked gift). */
  clearGiftingOptionsExplored: () => void;
  /** After the one allowed edit of saved gift notes, revert the cart CTA to View. */
  markGiftingEditConsumed: () => void;
  resetGiftingEditConsumed: () => void;
  openGuestCheckoutModal: () => void;
  closeGuestCheckoutModal: () => void;
  startCheckoutNavigation: () => void;
};

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

/** Ignore dismiss gestures briefly after opening so Vaul/Radix cannot close-then-reopen the drawer. */
const BAG_DRAWER_DISMISS_LOCK_MS = 500;

export function CartUIProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [bagDrawerMode, setBagDrawerMode] = useState<BagDrawerMode>("add");
  const [lastAddedLineItemId, setLastAddedLineItemId] = useState<string | null>(null);
  const [bagDrawerSnapshot, setBagDrawerSnapshot] = useState<BagDrawerSnapshot | null>(null);
  const [isGiftingPanelOpen, setIsGiftingPanelOpen] = useState(false);
  const [giftingStep, setGiftingStep] = useState<"intro" | "personalise">("intro");
  const [hasExploredGiftingOptions, setHasExploredGiftingOptions] = useState(false);
  const [hasConsumedGiftingEdit, setHasConsumedGiftingEdit] = useState(false);
  const [isGuestCheckoutModalOpen, setIsGuestCheckoutModalOpen] = useState(false);
  const [isNavigatingToCheckout, setIsNavigatingToCheckout] = useState(false);
  const isBagDrawerOpenRef = useRef(false);
  const bagActionInFlightRef = useRef(false);
  /** Ignore dismiss gestures while add-to-bag is in flight or the open animation is settling. */
  const bagDrawerDismissLockedUntilRef = useRef(0);

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

  const updateBagDrawerResult = useCallback(
    (result: AddItemResult, options?: { mode?: BagDrawerMode }) => {
      applyBagDrawerResult(result, options);
    },
    [applyBagDrawerResult],
  );

  const openBagDrawer = useCallback(
    (result: AddItemResult, options?: { mode?: BagDrawerMode }) => {
      applyBagDrawerResult(result, options);

      if (isBagDrawerOpenRef.current) {
        return;
      }

      isBagDrawerOpenRef.current = true;
      bagDrawerDismissLockedUntilRef.current = Date.now() + BAG_DRAWER_DISMISS_LOCK_MS;
      setIsBagDrawerOpen(true);
    },
    [applyBagDrawerResult],
  );

  const closeBagDrawer = useCallback(() => {
    isBagDrawerOpenRef.current = false;
    bagDrawerDismissLockedUntilRef.current = 0;
    setIsBagDrawerOpen(false);
    setBagDrawerMode("add");
  }, []);

  const handleBagDrawerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }

      if (
        bagActionInFlightRef.current ||
        Date.now() < bagDrawerDismissLockedUntilRef.current
      ) {
        return;
      }

      closeBagDrawer();
    },
    [closeBagDrawer],
  );

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

  const markGiftingEditConsumed = useCallback(() => {
    setHasConsumedGiftingEdit(true);
  }, []);

  const resetGiftingEditConsumed = useCallback(() => {
    setHasConsumedGiftingEdit(false);
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

  const clearCheckoutNavigation = useCallback(() => {
    setIsNavigatingToCheckout(false);
  }, []);

  // Clear once checkout is no longer the active route (covers browser Back to cart).
  useEffect(() => {
    if (pathname !== "/checkout") {
      clearCheckoutNavigation();
    }
  }, [pathname, clearCheckoutNavigation]);

  // bfcache can restore /cart without a pathname change, leaving the flag stuck true
  // after startCheckoutNavigation() ran right before router.push("/checkout").
  useEffect(() => {
    const resetIfOnCart = () => {
      if (window.location.pathname === "/cart") {
        clearCheckoutNavigation();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetIfOnCart();
      }
    };

    window.addEventListener("popstate", resetIfOnCart, true);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", resetIfOnCart, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [clearCheckoutNavigation]);

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
        hasConsumedGiftingEdit,
        isGuestCheckoutModalOpen,
        isNavigatingToCheckout,
        tryBeginBagAction,
        endBagAction,
        openBagDrawer,
        updateBagDrawerResult,
        handleBagDrawerOpenChange,
        closeBagDrawer,
        openGiftingPanel,
        closeGiftingPanel,
        markGiftingOptionsExplored,
        clearGiftingOptionsExplored,
        markGiftingEditConsumed,
        resetGiftingEditConsumed,
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
