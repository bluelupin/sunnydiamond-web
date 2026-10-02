"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import {
  getGiftingOptionsCtaLabel,
  hasGiftMarkedCartItems,
  hasSavedGiftingNotes,
} from "../utils/cartGiftNotes";

/** Checkout from the bag: nudge gifting, then guest welcome before /checkout when needed. */
export function useCartCheckout() {
  const router = useRouter();
  const { status } = useAuth();
  const { items } = useCart();
  const {
    hasExploredGiftingOptions,
    hasConsumedGiftingEdit,
    isNavigatingToCheckout,
    openGiftingPanel,
    openGuestCheckoutModal,
    resetGiftingEditConsumed,
    startCheckoutNavigation,
  } = useCartUI();

  useEffect(() => {
    if (!hasSavedGiftingNotes(items)) {
      resetGiftingEditConsumed();
    }
  }, [items, resetGiftingEditConsumed]);

  const giftingOptionsCtaLabel = getGiftingOptionsCtaLabel(items, hasConsumedGiftingEdit);

  const navigateToCheckout = () => {
    if (status === "loading" || isNavigatingToCheckout) {
      return;
    }

    if (status !== "authenticated") {
      openGuestCheckoutModal();
      return;
    }

    startCheckoutNavigation();
    router.push("/checkout");
  };

  const shouldShowGiftingIntroOnCheckout = () => {
    if (items.length === 0 || hasExploredGiftingOptions) {
      return false;
    }

    // Logged-in: always nudge gifting before checkout (unchanged from original behaviour).
    if (status === "authenticated") {
      return true;
    }

    // Guest: personalise intro only when at least one line is marked as a gift.
    return hasGiftMarkedCartItems(items);
  };

  const proceedToCheckout = () => {
    if (isNavigatingToCheckout || status === "loading") {
      return;
    }

    if (shouldShowGiftingIntroOnCheckout()) {
      openGiftingPanel("intro");
      return;
    }

    navigateToCheckout();
  };

  const openGiftingOptions = () => {
    if (isNavigatingToCheckout) {
      return;
    }

    // Open personalise drawer directly; explored is set only on Apply or intro Continue.
    openGiftingPanel("personalise");
  };

  return {
    proceedToCheckout,
    openGiftingOptions,
    navigateToCheckout,
    isNavigatingToCheckout,
    giftingOptionsCtaLabel,
  };
}
