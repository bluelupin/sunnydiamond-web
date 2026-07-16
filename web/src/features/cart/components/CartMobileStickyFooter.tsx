"use client";

import { cn } from "@/shared/utils/cn";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";
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
  offersOpen: boolean;
  onOffersToggle: () => void;
  breakupOpen: boolean;
  onBreakupToggle: () => void;
};

const CartMobileStickyFooter = ({
  offersOpen,
  onOffersToggle,
  breakupOpen,
  onBreakupToggle,
}: CartMobileStickyFooterProps) => {
  const { subtotal, taxes, totalPrice } = useCart();
  const { openGiftingPanel } = useCartUI();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div
        className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white"
        aria-hidden
      />

      <aside className="flex flex-col" aria-label="Cart checkout summary">
        <button
          type="button"
          onClick={onOffersToggle}
          aria-expanded={offersOpen}
          className="flex w-full items-center justify-between bg-gray200 px-4 py-3 text-left"
        >
          <span className="font-gill text-base font-normal leading-110 text-darkblack">
            Offers and Deals
          </span>
          <ChevronDownIcon
            aria-hidden
            className={cn(
              "size-6 text-darkblack transition-transform",
              offersOpen && "rotate-180",
            )}
          />
        </button>

        {offersOpen ? (
          <div className="bg-gray200 px-4 pb-3">
            <p className="text-center font-gill text-sm font-light leading-110 text-neutral500">
              No offers applied yet. Check back for seasonal promotions.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-neutral300 bg-white px-4 py-6 pb-[env(safe-area-inset-bottom,0px)] [border-top-width:0.5px]">
          {breakupOpen ? (
            <div className="flex flex-col gap-3">
              <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
              <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
              <CartPriceRow label="Shipping" value="Free" />
              <CartDivider weight={1} />
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-4">
            <p className="font-gill text-xl font-normal leading-110 text-darkblack">
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
              Gifting Options
            </CartOutlineButton>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CartMobileStickyFooter;
