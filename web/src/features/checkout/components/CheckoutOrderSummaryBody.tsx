"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/features/cart/context/CartContext";
import {
  formatCartLineMeta,
  formatCartPrice,
  getCheckoutShippingDisplay,
  resolveCheckoutDisplayTotal,
} from "@/features/cart/utils/formatCartLine";
import { CartGiftBadge, CartMetaRow } from "@/features/cart/components/CartFlowUi";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import OffersAndDealsSection, {
  OffersAndDealsExpandedContent,
} from "@/shared/ui/OffersAndDealsSection";
import PriceDetailsBreakdown from "@/features/cart/components/PriceDetailsBreakdown";
import { CheckoutPriceRow, CheckoutSummaryDivider } from "./CheckoutUi";

type CheckoutOrderSummaryBodyProps = {
  compact?: boolean;
};

const CheckoutOrderSummaryItem = ({ item }: { item: CartLineItem }) => {
  const meta = formatCartLineMeta(item);
  const isGift = Boolean(item.gifting || item.options.isGift);

  return (
    <div className="relative flex items-start gap-6 border border-aboutInactive bg-gray300 px-4 py-6">
      {isGift ? (
        <CartGiftBadge variant="checkout" className="absolute -left-px -top-px z-10" />
      ) : null}

      <div className="relative h-[71px] w-20 shrink-0 overflow-hidden bg-gray200">
        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
      </div>

      <div className="flex w-[214px] max-w-[214px] shrink-0 flex-col gap-2">
        <p className="font-gill text-base font-normal leading-normal tracking-[0.16px] text-darkblack">
          {item.product.name}
        </p>
        <CartMetaRow parts={meta} variant="checkout" />
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {formatCartPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

const CheckoutOrderSummaryBody = ({ compact = false }: CheckoutOrderSummaryBodyProps) => {
  const {
    items,
    subtotal,
    taxes,
    shipping,
    totalPrice,
    offerDiscount,
    giftCardDiscount,
    localGiftCardDiscount,
    selectedShippingMethod,
    shippingMethods,
  } = useCart();
  const [offersOpen, setOffersOpen] = useState(false);

  const shippingDisplay = getCheckoutShippingDisplay(
    shipping,
    selectedShippingMethod,
    shippingMethods,
  );
  const displayTotal = resolveCheckoutDisplayTotal(
    subtotal,
    taxes,
    totalPrice,
    shippingDisplay,
    offerDiscount,
    giftCardDiscount,
    localGiftCardDiscount,
  );

  const toggleOffers = () => setOffersOpen((open) => !open);

  return (
    <>
      <div className="flex flex-col gap-4">
        {items.map((item) =>
          compact ? (
            <div
              key={item.id}
              className="relative flex h-[68px] items-center gap-6 border border-aboutInactive bg-gray300 px-4"
            >
              {item.gifting || item.options.isGift ? (
                <CartGiftBadge variant="checkout" className="absolute -left-px -top-px z-10" />
              ) : null}
              <div className="relative h-[53px] w-[60px] shrink-0 overflow-hidden bg-gray200">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="60px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="truncate font-gill text-base font-normal leading-normal tracking-[0.16px] text-darkblack">
                  {item.product.name}
                </p>
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  {formatCartPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ) : (
            <CheckoutOrderSummaryItem key={item.id} item={item} />
          ),
        )}
      </div>

      {!compact ? (
        <div className="flex flex-col gap-4">
          <div className="hidden flex-col gap-6 md:max-lg:flex lg:flex">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
              Price Details
            </h3>
            <CheckoutSummaryDivider />
          </div>

          <OffersAndDealsSection
            variant="panel-gray300"
            open={offersOpen}
            onToggle={toggleOffers}
            showExpandedContent={false}
            buttonClassName="flex lg:hidden"
          />
          {offersOpen ? (
            <OffersAndDealsExpandedContent variant="panel-gray300" className="lg:hidden" />
          ) : null}

          <PriceDetailsBreakdown
            variant="checkout"
            showTitle={false}
            subtotal={subtotal}
            offerDiscount={offerDiscount}
            giftCardDiscount={giftCardDiscount + localGiftCardDiscount}
            taxes={taxes}
            shippingLabel={shippingDisplay.label}
            total={displayTotal}
          />
          <div className="lg:bg-gray300">
            <OffersAndDealsSection
              variant="panel-gray300"
              open={offersOpen}
              onToggle={toggleOffers}
              showExpandedContent={false}
              buttonClassName="hidden lg:flex"
            />
            {offersOpen ? (
              <OffersAndDealsExpandedContent variant="panel-gray300" className="hidden lg:block lg:px-4 lg:pb-4" />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CheckoutSummaryDivider />
          <CheckoutPriceRow label="Total" value={formatCartPrice(displayTotal)} emphasis />
        </div>
      )}
    </>
  );
};

export default CheckoutOrderSummaryBody;
