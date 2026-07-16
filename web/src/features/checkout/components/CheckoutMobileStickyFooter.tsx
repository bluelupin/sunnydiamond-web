"use client";

import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";
import { CartPrimaryButton, CartTextLink } from "@/features/cart/components/CartFlowUi";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";

type CheckoutMobileStickyFooterProps = {
  offersOpen: boolean;
  onOffersToggle: () => void;
  onOrderSummaryOpen: () => void;
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
};

const CheckoutMobileStickyFooter = ({
  offersOpen,
  onOffersToggle,
  onOrderSummaryOpen,
  ctaLabel,
  onCtaClick,
  ctaDisabled = false,
}: CheckoutMobileStickyFooterProps) => {
  const { totalPrice } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div
        className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white"
        aria-hidden
      />

      <aside className="flex flex-col" aria-label="Checkout order summary">
        <button
          type="button"
          onClick={onOffersToggle}
          aria-expanded={offersOpen}
          className="flex w-full items-center justify-between bg-gray300 px-4 py-3 text-left"
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
          <div className="flex items-end justify-between gap-4">
            <p className="font-gill text-xl font-normal leading-110 text-darkblack">
              {formatCartPrice(totalPrice)}
            </p>
            <CartTextLink onClick={onOrderSummaryOpen}>View order Summary</CartTextLink>
          </div>

          <CartPrimaryButton
            type="button"
            className="w-full uppercase"
            onClick={onCtaClick}
            disabled={ctaDisabled}
          >
            {ctaLabel}
          </CartPrimaryButton>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutMobileStickyFooter;
