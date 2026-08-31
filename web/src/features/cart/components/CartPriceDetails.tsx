"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import OffersAndDealsSection from "@/shared/ui/OffersAndDealsSection";
import { useCart } from "../context/CartContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { formatCartPrice, getCartShippingDisplay, resolveCartDisplayTotal } from "../utils/formatCartLine";
import PriceDetailsBreakdown from "./PriceDetailsBreakdown";
import {
  CartOutlineButton,
  CartPriceRow,
  CartPrimaryButton,
} from "./CartFlowUi";

type CartPriceDetailsProps = {
  className?: string;
  showCheckoutCta?: boolean;
  showGiftingCta?: boolean;
  compact?: boolean;
  stickyOnMobile?: boolean;
  children?: ReactNode;
};

const CartPriceDetails = ({
  className,
  showCheckoutCta = true,
  showGiftingCta = true,
  compact = false,
  stickyOnMobile = false,
  children,
}: CartPriceDetailsProps) => {
  const {
    subtotal,
    taxes,
    shipping,
    totalPrice,
    offerDiscount,
    giftCardDiscount,
    selectedShippingMethod,
    shippingMethods,
    estimatedShippingMethods,
    localGiftCardDiscount,
    localOfferDiscount,
  } = useCart();
  const { proceedToCheckout, openGiftingOptions, isNavigatingToCheckout } = useCartCheckout();
  const [offersOpen, setOffersOpen] = useState(false);

  const shippingDisplay = getCartShippingDisplay(
    shipping,
    selectedShippingMethod,
    shippingMethods,
    estimatedShippingMethods,
  );
  const displayOfferDiscount = offerDiscount + localOfferDiscount;
  const displayTotal = resolveCartDisplayTotal(
    subtotal,
    taxes,
    totalPrice,
    shippingDisplay,
    offerDiscount,
    giftCardDiscount,
    localGiftCardDiscount,
    localOfferDiscount,
  );

  const showBreakdown = !compact;
  const showOffers = !compact;
  const showCtas = showCheckoutCta || showGiftingCta;

  return (
    <aside
      className={cn(
        "flex flex-col bg-white",
        compact ? "gap-4 p-4" : "gap-6 p-6",
        stickyOnMobile &&
          "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:border-t max-lg:border-aboutInactive max-lg:pb-[env(safe-area-inset-bottom,0px)] max-lg:shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {showBreakdown ? (
        <PriceDetailsBreakdown
          variant="cart"
          subtotal={subtotal}
          offerDiscount={displayOfferDiscount}
          giftCardDiscount={giftCardDiscount}
          taxes={taxes}
          shippingLabel={shippingDisplay.label}
          total={displayTotal}
        />
      ) : (
        <CartPriceRow label="Total" value={formatCartPrice(displayTotal)} emphasis />
      )}

      {showOffers ? (
        <OffersAndDealsSection
          variant="panel-gray300"
          labelRegular={false}
          open={offersOpen}
          onToggle={() => setOffersOpen((open) => !open)}
        />
      ) : null}

      {children}

      {showCtas ? (
        <div
          className={cn(
            "flex flex-col gap-4",
            !compact && "border-t border-neutral300 pt-6 [border-top-width:0.5px]",
          )}
        >
          {showCheckoutCta ? (
            <CartPrimaryButton
              type="button"
              className="uppercase"
              onClick={proceedToCheckout}
              disabled={isNavigatingToCheckout}
            >
              {isNavigatingToCheckout ? "Continuing..." : "Checkout"}
            </CartPrimaryButton>
          ) : null}

          {showGiftingCta ? (
            <CartOutlineButton
              type="button"
              className="w-full uppercase"
              onClick={openGiftingOptions}
              disabled={isNavigatingToCheckout}
            >
              View Gifting Options
            </CartOutlineButton>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
};

export default CartPriceDetails;
