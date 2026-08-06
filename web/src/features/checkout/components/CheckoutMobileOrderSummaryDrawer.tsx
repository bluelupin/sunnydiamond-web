"use client";

import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { CheckoutSummaryDivider } from "./CheckoutUi";
import CheckoutOrderSummaryBody from "./CheckoutOrderSummaryBody";

type CheckoutMobileOrderSummaryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
};

const CheckoutMobileOrderSummaryDrawer = ({
  open,
  onOpenChange,
  ctaLabel,
  onCtaClick,
  ctaDisabled = false,
}: CheckoutMobileOrderSummaryDrawerProps) => {
  const handleCtaClick = () => {
    onOpenChange(false);
    onCtaClick?.();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="flex h-[90vh] max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">Order Summary</DrawerTitle>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          <div className="w-full shrink-0 px-4 pt-6">
            <div className="flex h-[26px] items-center justify-between">
              <h2 className="font-larken text-xl font-light leading-110 text-darkblack">
                Order Summary
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close order summary"
                className="inline-flex size-8 shrink-0 items-center justify-center"
              >
                <Image
                  src="/images/icons/menu-close.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
              </button>
            </div>
            <div className="mt-6">
              <CheckoutSummaryDivider />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            <div className="flex flex-col gap-6">
              <CheckoutOrderSummaryBody />
            </div>
          </div>

          <div className="relative shrink-0 border-t border-neutral300 bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-full h-[71px] bg-gradient-to-b from-transparent to-white"
              aria-hidden
            />
            <hr className="mb-6 border-neutral300" />
            <div className="w-full px-4">
              <CartPrimaryButton
                type="button"
                className="w-full uppercase"
                onClick={handleCtaClick}
                disabled={ctaDisabled}
              >
                {ctaLabel}
              </CartPrimaryButton>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutMobileOrderSummaryDrawer;
