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
    markGiftingOptionsExplored,
    openGiftingPanel,
    openGuestCheckoutModal,
  } = useCartUI();

  const hasExistingGifting = items.some(
    (item) => Boolean(item.gifting) || Boolean(item.options.isGift),
  );

  const navigateToCheckout = () => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      openGuestCheckoutModal();
      return;
    }

    router.push("/checkout");
  };

  const proceedToCheckout = () => {
    // Gift marked → always show gifting reminder (personalise may have been skipped).
    // No gift → guest welcome modal or /checkout; never open gifting for that case.
    if (hasExistingGifting) {
      openGiftingPanel("intro");
      return;
    }

    navigateToCheckout();
  };

  const openGiftingOptions = () => {
    markGiftingOptionsExplored();
    openGiftingPanel("intro");
  };

  return { proceedToCheckout, openGiftingOptions, navigateToCheckout };
}
