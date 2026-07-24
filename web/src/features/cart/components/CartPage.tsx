"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import CartBenefitsSection from "@/features/cart/components/CartBenefitsSection";
import CartItem from "@/features/cart/components/CartItem";
import CartMobileStickyFooter from "@/features/cart/components/CartMobileStickyFooter";
import CartPriceDetails from "@/features/cart/components/CartPriceDetails";
import { useCart } from "@/features/cart/context/CartContext";
import { cartFlowSpec } from "@/features/cart/data/cartFlowSpec";
import { CartPrimaryLink } from "./CartFlowUi";

const CartPage = () => {
  const { items, isHydrating, refreshCart, updateQuantity, removeItem, updateLineItemOptions } = useCart();
  const [offersOpen, setOffersOpen] = useState(false);
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);

  useEffect(() => {
    if (!isHydrating) {
      void refreshCart();
    }
  }, [isHydrating, refreshCart]);

  const mobileScrollPadding = (() => {
    const { cartPage } = cartFlowSpec.mobile;
    if (offersOpen && priceBreakupOpen) {
      return `max-md:pb-[calc(${cartPage.stickyFooterFullyExpandedClearance}px+env(safe-area-inset-bottom,0px))]`;
    }
    if (priceBreakupOpen) {
      return `max-md:pb-[calc(${cartPage.stickyFooterBreakupExpandedClearance}px+env(safe-area-inset-bottom,0px))]`;
    }
    if (offersOpen) {
      return `max-md:pb-[calc(${cartPage.stickyFooterOffersExpandedClearance}px+env(safe-area-inset-bottom,0px))]`;
    }
    return `max-md:pb-[calc(${cartPage.stickyFooterCollapsedClearance}px+env(safe-area-inset-bottom,0px))]`;
  })();

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
          "bg-gray300 -mt-2 md:landscape:mt-0 md:pb-16",
          mobileScrollPadding,
        )}
      >
        <div className="mx-auto w-full px-5 pt-6 md:px-8 md:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
          <h1 className="mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:mb-10 lg:text-32">
            Your Shopping Bag
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-start lg:grid-cols-[minmax(0,783px)_553px] lg:gap-6">
            <div className="flex min-w-0 flex-col gap-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onUpdateOptions={updateLineItemOptions}
                />
              ))}

              <div className="pt-4 md:hidden">
                <CartBenefitsSection />
              </div>
            </div>

            <aside className="hidden h-fit w-full min-w-0 flex-col gap-0 md:sticky md:top-12 md:flex">
              <CartPriceDetails />
              <CartBenefitsSection />
            </aside>
          </div>
        </div>
      </section>

      <CartMobileStickyFooter
        offersOpen={offersOpen}
        onOffersToggle={() => setOffersOpen((open) => !open)}
        breakupOpen={priceBreakupOpen}
        onBreakupToggle={() => setPriceBreakupOpen((open) => !open)}
      />
    </>
  );
};

export default CartPage;
