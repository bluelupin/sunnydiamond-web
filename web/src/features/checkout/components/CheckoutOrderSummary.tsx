"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  CartGiftBadge,
  CartMetaRow,
  CartPrimaryButton,
} from "@/features/cart/components/CartFlowUi";

type CheckoutOrderSummaryProps = {
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaType?: "button" | "submit";
  ctaDisabled?: boolean;
  compact?: boolean;
  stickyOnMobile?: boolean;
  className?: string;
};

const CheckoutSummaryDivider = () => (
  <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />
);

const CheckoutPriceRow = ({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span
      className={cn(
        "font-gill text-base leading-110 text-darkblack",
        !emphasis && "font-light",
      )}
    >
      {label}
    </span>
    <span className="font-gill text-base font-normal leading-110 text-darkblack">{value}</span>
  </div>
);

const CheckoutOrderSummary = ({
  ctaLabel,
  onCtaClick,
  ctaType = "button",
  ctaDisabled = false,
  compact = false,
  stickyOnMobile = false,
  className,
}: CheckoutOrderSummaryProps) => {
  const { items, subtotal, taxes, totalPrice } = useCart();
  const [offersOpen, setOffersOpen] = useState(false);

  return (
    <aside
      className={cn(
        "h-fit w-full lg:sticky lg:top-12",
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

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative flex items-center gap-6 border border-aboutInactive bg-gray300 py-6 pl-4 pr-4",
                  compact && "h-[68px] py-0",
                )}
              >
                {item.gifting || item.options.isGift ? (
                  <CartGiftBadge variant="cart" className="absolute left-0 top-0 z-10" />
                ) : null}

                <div
                  className={cn(
                    "relative shrink-0 overflow-hidden bg-gray200",
                    compact ? "h-[53px] w-[60px]" : "h-[71px] w-20",
                  )}
                >
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>

                <div className="flex w-full max-w-[214px] min-w-0 flex-1 flex-col gap-2">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {item.product.name}
                  </p>
                  {!compact ? <CartMetaRow parts={formatCartLineMeta(item)} /> : null}
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {formatCartPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!compact ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                <h3 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
                  Price Details
                </h3>
                <CheckoutSummaryDivider />
              </div>

              <div className="flex flex-col gap-3">
                <CheckoutPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
                <CheckoutPriceRow label="Taxes" value={formatCartPrice(taxes)} />
                <CheckoutPriceRow label="Shipping" value="Free" />
              </div>

              <CheckoutSummaryDivider />
              <CheckoutPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />

              <button
                type="button"
                onClick={() => setOffersOpen((open) => !open)}
                className="flex w-full items-center justify-between bg-gray300 p-4 text-left"
              >
                <span className="font-gill text-base font-normal leading-110 text-darkblack">
                  Offers and Deals
                </span>
                <ChevronDown
                  className={cn(
                    "size-6 text-darkblack transition-transform",
                    offersOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              {offersOpen ? (
                <p className="text-center font-gill text-sm font-light leading-110 text-neutral500">
                  No offers applied yet. Check back for seasonal promotions.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <CheckoutSummaryDivider />
              <CheckoutPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
            </div>
          )}
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
