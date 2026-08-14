"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { MobileStickyFooterSpacer } from "@/shared/ui/layout/MobileStickyFooterSpacer";
import CartBenefitsSection from "@/features/cart/components/CartBenefitsSection";
import CartGlobalGiftNote from "@/features/cart/components/CartGlobalGiftNote";
import CartItem from "@/features/cart/components/CartItem";
import CartMobileStickyFooter from "@/features/cart/components/CartMobileStickyFooter";
import CartPriceDetails from "@/features/cart/components/CartPriceDetails";
import { useCart } from "@/features/cart/context/CartContext";
import { resolveCartGiftNoteDisplay } from "@/features/cart/utils/cartGiftNotes";
import { useCartCheckout } from "@/features/cart/hooks/useCartCheckout";
import { CartPrimaryLink } from "./CartFlowUi";

const CartPage = () => {
  const { items, isHydrating, refreshCart, updateQuantity, removeItem, updateLineItemOptions } = useCart();
  const { isNavigatingToCheckout } = useCartCheckout();
  const giftNoteDisplay = useMemo(() => resolveCartGiftNoteDisplay(items), [items]);
  const [offersOpen, setOffersOpen] = useState(false);
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);
  const { footerRef, clearancePx } = useMobileStickyFooterClearance();

  useEffect(() => {
    if (!isHydrating) {
      void refreshCart();
    }
  }, [isHydrating, refreshCart]);

  if (isHydrating) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-gray300 px-4 py-20 text-center">
        <p className="sr-only" aria-live="polite">
          Loading your shopping bag
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-32">
          Your bag is empty
        </h1>
        <p className="max-w-md font-gill text-base font-light leading-110 text-neutral500">
          Discover our exquisite diamond collection and find something that speaks to you.
        </p>
        <CartPrimaryLink href="/jewellery" className="mt-2 w-full max-w-xs">
          Shop Now
        </CartPrimaryLink>
      </section>
    );
  }

  return (
    <>
      <section
        className={cn(
          "bg-gray300 lg:pb-16",
          "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
          "md:max-lg:pb-16",
        )}
      >
        <div className="mx-auto w-full px-5 max-md:pt-4 pt-6 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
          <h1 className="mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:mb-10 lg:text-32">
            Your Shopping Bag
          </h1>

          <div
            className={cn(
              "grid grid-cols-1 gap-6 md:max-lg:portrait:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:max-lg:landscape:grid-cols-2 md:max-lg:items-start lg:grid-cols-2 lg:gap-6",
              isNavigatingToCheckout && "pointer-events-none",
            )}
            aria-busy={isNavigatingToCheckout || undefined}
          >
            <div
              className="flex min-w-0 flex-col gap-6"
              {...(isNavigatingToCheckout ? { inert: true } : {})}
            >
              {giftNoteDisplay.globalNote ? (
                <CartGlobalGiftNote note={giftNoteDisplay.globalNote} />
              ) : null}

              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  giftNoteDisplay={giftNoteDisplay}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onUpdateOptions={updateLineItemOptions}
                />
              ))}

              <div className="pt-4 md:hidden">
                <CartBenefitsSection />
              </div>

              <MobileStickyFooterSpacer height={clearancePx} />
            </div>

            <aside className="hidden h-fit w-full min-w-0 flex-col gap-0 md:max-lg:sticky md:max-lg:top-12 md:max-lg:flex lg:sticky lg:top-12 lg:flex">
              <CartPriceDetails />
              <CartBenefitsSection />
            </aside>
          </div>
        </div>
      </section>

      <CartMobileStickyFooter
        ref={footerRef}
        offersOpen={offersOpen}
        onOffersToggle={() => setOffersOpen((open) => !open)}
        breakupOpen={priceBreakupOpen}
        onBreakupToggle={() => setPriceBreakupOpen((open) => !open)}
      />
    </>
  );
};

export default CartPage;
