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

  const hasExistingGifting = items.some(
    (item) => Boolean(item.gifting) || Boolean(item.options.isGift),
  );

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

    // Gift marked in cart but gifting not saved/skipped → intro nudge before checkout.
    // hasExploredGiftingOptions is set only on Apply in personalise or Continue on intro.
    if (hasExistingGifting && !hasExploredGiftingOptions) {
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
