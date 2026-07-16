"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { useCart } from "@/features/cart/context/CartContext";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  CartDivider,
  CartGiftBadge,
  CartMetaRow,
  CartPriceRow,
  CartPrimaryButton,
} from "@/features/cart/components/CartFlowUi";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";

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
  const { items, subtotal, taxes, totalPrice } = useCart();
  const [offersOpen, setOffersOpen] = useState(false);

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
              >
                <X className="size-6 text-darkblack" />
              </button>
            </div>
            <div className="mt-6">
              <CartDivider weight={1} />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-4 border border-aboutInactive bg-gray300 px-4 py-6 [border-width:0.5px]"
                  >
                    {item.gifting || item.options.isGift ? (
                      <CartGiftBadge variant="cart" className="absolute left-0 top-0 z-10" />
                    ) : null}

                    <div className="relative h-[71px] w-20 shrink-0 overflow-hidden bg-gray200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="font-gill text-base font-normal leading-110 text-darkblack">
                        {item.product.name}
                      </p>
                      <CartMetaRow parts={formatCartLineMeta(item)} />
                      <p className="font-gill text-base font-normal leading-110 text-darkblack">
                        {formatCartPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
                    Price Details
                  </h3>
                  <CartDivider weight={1} />
                </div>

                <div className="flex flex-col gap-3">
                  <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
                  <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
                  <CartPriceRow label="Shipping" value="Free" />
                </div>

                <CartDivider weight={1} />
                <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />

                <button
                  type="button"
                  onClick={() => setOffersOpen((current) => !current)}
                  aria-expanded={offersOpen}
                  className="flex w-full items-center justify-between bg-gray300 p-4 text-left"
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
                  <p className="text-center font-gill text-sm font-light leading-110 text-neutral500">
                    No offers applied yet. Check back for seasonal promotions.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-neutral300 bg-white px-4 py-6 pb-[env(safe-area-inset-bottom,0px)] [border-top-width:0.5px]">
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
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutMobileOrderSummaryDrawer;
