"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import { CartGiftBadge, CartMetaRow } from "@/features/cart/components/CartFlowUi";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";
import { CheckoutPriceRow, CheckoutSummaryDivider } from "./CheckoutUi";

type CheckoutOrderSummaryBodyProps = {
  compact?: boolean;
};

const CheckoutOrderSummaryBody = ({ compact = false }: CheckoutOrderSummaryBodyProps) => {
  const { items, subtotal, taxes, totalPrice } = useCart();
  const [offersOpen, setOffersOpen] = useState(false);

  return (
    <>
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
          <div className="lg:flex hidden flex-col gap-6">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
              Price Details
            </h3>
            <CheckoutSummaryDivider />
          </div>
          <button
            type="button"
            onClick={() => setOffersOpen((open) => !open)}
            aria-expanded={offersOpen}
            className="lg:hidden flex w-full items-center justify-between bg-gray300 p-4 text-left"
          >
            <span className="font-gill text-base font-normal leading-110 text-darkblack">
              Offers and Deals
            </span>
            <ChevronDownIcon
              className={cn(
                "size-6 text-darkblack transition-transform",
                offersOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>

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
            aria-expanded={offersOpen}
            className="lg:flex hidden w-full items-center justify-between bg-gray300 p-4 text-left"
          >
            <span className="font-gill text-base font-normal leading-110 text-darkblack">
              Offers and Deals
            </span>
            <ChevronDownIcon
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
    </>
  );
};

export default CheckoutOrderSummaryBody;
