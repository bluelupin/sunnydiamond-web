"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { getGiftingOptionsCtaLabel, hasSavedGiftingNotes } from "../utils/cartGiftNotes";

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

  const proceedToCheckout = () => {
    if (isNavigatingToCheckout) {
      return;
    }

    // Gifting intro on checkout is for logged-in users only.
    // Guests skip straight to the guest checkout / login modal.
    if (
      status === "authenticated" &&
      items.length > 0 &&
      !hasExploredGiftingOptions
    ) {
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
