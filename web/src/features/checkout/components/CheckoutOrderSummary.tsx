"use client";

import { cn } from "@/shared/utils/cn";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { CheckoutSummaryDivider } from "./CheckoutUi";
import CheckoutOrderSummaryBody from "./CheckoutOrderSummaryBody";

type CheckoutOrderSummaryProps = {
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaType?: "button" | "submit";
  ctaDisabled?: boolean;
  compact?: boolean;
  stickyOnMobile?: boolean;
  className?: string;
};

const CheckoutOrderSummary = ({
  ctaLabel,
  onCtaClick,
  ctaType = "button",
  ctaDisabled = false,
  compact = false,
  stickyOnMobile = false,
  className,
}: CheckoutOrderSummaryProps) => {
  return (
    <aside
      className={cn(
        "h-fit w-full min-w-0 md:sticky md:top-12",
        stickyOnMobile &&
          "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:border-t max-lg:border-aboutInactive max-lg:pb-[env(safe-area-inset-bottom,0px)] max-lg:shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="flex flex-col gap-6 bg-white p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
              Order Summary
            </h2>
            <CheckoutSummaryDivider />
          </div>

          <CheckoutOrderSummaryBody compact={compact} />
        </div>

        <hr className="border-neutral300" />
        <div className="flex flex-col gap-4">
          <CartPrimaryButton
            type={ctaType}
            className="w-full uppercase"
            onClick={onCtaClick}
            disabled={ctaDisabled}
          >
            {ctaLabel}
          </CartPrimaryButton>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutOrderSummary;
