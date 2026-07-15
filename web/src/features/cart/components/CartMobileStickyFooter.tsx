"use client";

import { cn } from "@/shared/utils/cn";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { formatCartPrice } from "../utils/formatCartLine";
import {
  CartDivider,
  CartOutlineButton,
  CartPriceRow,
  CartPrimaryLink,
  CartTextLink,
} from "./CartFlowUi";

type CartMobileStickyFooterProps = {
  breakupOpen: boolean;
  onBreakupToggle: () => void;
};

const CartMobileStickyFooter = ({ breakupOpen, onBreakupToggle }: CartMobileStickyFooterProps) => {
  const { subtotal, taxes, totalPrice } = useCart();
  const { openGiftingPanel } = useCartUI();

  return (
    <aside
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex flex-col gap-4 border-t border-aboutInactive bg-white p-4",
        "pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden",
      )}
      aria-label="Cart checkout summary"
    >
      {breakupOpen ? (
        <div className="flex flex-col gap-3">
          <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
          <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
          <CartPriceRow label="Shipping" value="Free" />
          <CartDivider weight={1} />
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-4">
        <p className="font-gill text-2xl font-normal leading-110 text-darkblack">
          {formatCartPrice(totalPrice)}
        </p>
        <CartTextLink onClick={onBreakupToggle} aria-expanded={breakupOpen}>
          View Price Breakup
        </CartTextLink>
      </div>

      <div className="flex flex-col gap-4">
        <CartPrimaryLink href="/checkout" className="uppercase">
          Checkout
        </CartPrimaryLink>
        <CartOutlineButton
          type="button"
          className="w-full uppercase"
          onClick={() => openGiftingPanel("intro")}
        >
          View Gifting Options
        </CartOutlineButton>
      </div>
    </aside>
  );
};

export default CartMobileStickyFooter;
