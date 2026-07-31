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
    // Existing flow: gift marked → show gifting modal.
    // Exception only: user already completed View gifting options / personalise
    // (hasExploredGiftingOptions). Newly marked gifts clear that flag.
    if (hasExistingGifting && !hasExploredGiftingOptions) {
      openGiftingPanel("intro");
      return;
    }

    navigateToCheckout();
  };

  const openGiftingOptions = () => {
    // Do not mark explored here — only personalise / continue-to-checkout does.
    // Otherwise merely opening the panel would skip the checkout nudge.
    openGiftingPanel("intro");
  };

  return { proceedToCheckout, openGiftingOptions, navigateToCheckout };
}
