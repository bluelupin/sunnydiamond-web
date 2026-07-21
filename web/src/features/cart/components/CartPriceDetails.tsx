"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import OffersAndDealsSection from "@/shared/ui/OffersAndDealsSection";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { formatCartPrice } from "../utils/formatCartLine";
import {
  CartDivider,
  CartOutlineButton,
  CartPriceRow,
  CartPrimaryLink,
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
  const { subtotal, taxes, shipping, totalPrice, selectedShippingMethod } = useCart();
  const { openGiftingPanel } = useCartUI();
  const [offersOpen, setOffersOpen] = useState(false);

  const shippingLabel =
    shipping === 0 && !selectedShippingMethod
      ? "Calculated at checkout"
      : shipping === 0
        ? "Free"
        : formatCartPrice(shipping);

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
        <div className="flex flex-col gap-4">
          <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
            Price Details
          </h2>
          <CartDivider weight={1} />

          <div className="flex flex-col gap-3">
            <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
            <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
            <CartPriceRow label="Shipping" value={shippingLabel} />
          </div>

          <CartDivider weight={1} />
          <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
        </div>
      ) : (
        <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
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
            <CartPrimaryLink href="/checkout" className="uppercase">
              Checkout
            </CartPrimaryLink>
          ) : null}

          {showGiftingCta ? (
            <CartOutlineButton
              type="button"
              className="w-full uppercase"
              onClick={() => openGiftingPanel("intro")}
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
