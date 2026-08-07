"use client";

import { forwardRef } from "react";
import OffersAndDealsSection from "@/shared/ui/OffersAndDealsSection";
import { useCart } from "../context/CartContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { formatCartPrice, getCartShippingLabel } from "../utils/formatCartLine";
import {
  CartDivider,
  CartOutlineButton,
  CartPriceRow,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";

type CartMobileStickyFooterProps = {
  offersOpen: boolean;
  onOffersToggle: () => void;
  breakupOpen: boolean;
  onBreakupToggle: () => void;
};

const CartMobileStickyFooter = forwardRef<HTMLDivElement, CartMobileStickyFooterProps>(function CartMobileStickyFooter(
  {
    offersOpen,
    onOffersToggle,
    breakupOpen,
    onBreakupToggle,
  },
  ref,
) {
  const { subtotal, taxes, shipping, totalPrice, selectedShippingMethod, shippingMethods, estimatedShippingMethods } = useCart();
  const { proceedToCheckout, openGiftingOptions } = useCartCheckout();
  const shippingLabel = getCartShippingLabel(
    shipping,
    selectedShippingMethod,
    shippingMethods,
    estimatedShippingMethods,
  );

  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white"
        aria-hidden
      />

      <aside className="flex flex-col" aria-label="Cart checkout summary">
        <OffersAndDealsSection
          variant="sticky-gray200"
          open={offersOpen}
          onToggle={onOffersToggle}
        />

        <div className="flex flex-col gap-4 border-t border-neutral300 bg-white px-4 py-6 pb-[env(safe-area-inset-bottom,0px)] [border-top-width:0.5px]">
          {breakupOpen ? (
            <div className="flex flex-col gap-3">
              <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
              <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
              <CartPriceRow label="Shipping" value={shippingLabel} />
              <CartDivider weight={1} />
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-4">
            <p className="font-gill text-xl font-normal leading-110 text-darkblack">
              {formatCartPrice(totalPrice)}
            </p>
            <CartTextLink onClick={onBreakupToggle} aria-expanded={breakupOpen} className="uppercase">
              View Price Breakup
            </CartTextLink>
          </div>

          <div className="flex flex-col gap-4">
            <CartPrimaryButton type="button" className="uppercase" onClick={proceedToCheckout}>
              Checkout
            </CartPrimaryButton>
            <CartOutlineButton
              type="button"
              className="w-full uppercase"
              onClick={openGiftingOptions}
            >
              Gifting Options
            </CartOutlineButton>
          </div>
        </div>
      </aside>
    </div>
  );
});

export default CartMobileStickyFooter;
