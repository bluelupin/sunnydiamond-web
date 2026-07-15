"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import CartBenefitsSection from "@/features/cart/components/CartBenefitsSection";
import CartItem from "@/features/cart/components/CartItem";
import CartMobileStickyFooter from "@/features/cart/components/CartMobileStickyFooter";
import CartPriceDetails from "@/features/cart/components/CartPriceDetails";
import { useCart } from "@/features/cart/context/CartContext";
import { CartPrimaryLink } from "./CartFlowUi";

const CartPage = () => {
  const { items, updateQuantity, removeItem, updateLineItemOptions } = useCart();
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-32">
          Your bag is empty
        </h1>
        <p className="max-w-md font-gill text-base font-light leading-110 text-neutral500">
          Discover our exquisite diamond collection and find something that speaks to you.
        </p>
        <CartPrimaryLink href="/jewellery-product" className="mt-2 w-full max-w-xs">
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
          priceBreakupOpen
            ? "pb-[calc(20rem+env(safe-area-inset-bottom,0px))]"
            : "pb-[calc(13rem+env(safe-area-inset-bottom,0px))]",
        )}
      >
        <div className="mx-auto w-full px-5 md:px-8 lg:px-10 lg:py-6 2xl:max-w-1920 2xl:px-[60px]">
          <h1 className="mb-6 mt-6 font-larken text-32 font-light leading-110 text-darkblack lg:mb-10 lg:text-32">
            Your Shopping Bag
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,783px)_553px] lg:gap-6">
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onUpdateOptions={updateLineItemOptions}
                />
              ))}

              <div className="lg:hidden">
                <CartBenefitsSection />
              </div>
            </div>

            <aside className="hidden h-fit w-full flex-col lg:sticky lg:top-12 lg:flex">
              <CartPriceDetails />
              <CartBenefitsSection />
            </aside>
          </div>
        </div>
      </section>

      <CartMobileStickyFooter
        breakupOpen={priceBreakupOpen}
        onBreakupToggle={() => setPriceBreakupOpen((open) => !open)}
      />
    </>
  );
};

export default CartPage;
