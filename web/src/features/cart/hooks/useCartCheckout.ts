"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";

/** Checkout from the bag: nudge gifting, then guest welcome before /checkout when needed. */
export function useCartCheckout() {
  const router = useRouter();
  const { status } = useAuth();
  const { items } = useCart();
  const {
    hasExploredGiftingOptions,
    isNavigatingToCheckout,
    openGiftingPanel,
    openGuestCheckoutModal,
    startCheckoutNavigation,
  } = useCartUI();

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

  return { proceedToCheckout, openGiftingOptions, navigateToCheckout, isNavigatingToCheckout };
}
