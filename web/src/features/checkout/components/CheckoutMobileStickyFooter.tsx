"use client";

import { useCart } from "@/features/cart/context/CartContext";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";
import { CartPrimaryButton, CartTextLink } from "@/features/cart/components/CartFlowUi";
import OffersAndDealsSection from "@/shared/ui/OffersAndDealsSection";

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
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white"
        aria-hidden
      />

      <aside className="flex flex-col" aria-label="Checkout order summary">
        <OffersAndDealsSection
          variant="sticky-gray300"
          open={offersOpen}
          onToggle={onOffersToggle}
        />

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
