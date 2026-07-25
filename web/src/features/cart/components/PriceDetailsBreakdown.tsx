"use client";

import {
  formatCartDiscountPrice,
  formatCartPrice,
} from "@/features/cart/utils/formatCartLine";
import { CheckoutPriceRow, CheckoutSummaryDivider } from "@/features/checkout/components/CheckoutUi";
import { CartDivider, CartPriceRow } from "./CartFlowUi";

type PriceDetailsBreakdownProps = {
  variant: "cart" | "checkout";
  subtotal: number;
  offerDiscount: number;
  giftCardDiscount: number;
  taxes: number;
  shippingLabel: string;
  total: number;
  showTitle?: boolean;
};

const PriceDetailsBreakdown = ({
  variant,
  subtotal,
  offerDiscount,
  giftCardDiscount,
  taxes,
  shippingLabel,
  total,
  showTitle = true,
}: PriceDetailsBreakdownProps) => {
  const PriceRow = variant === "checkout" ? CheckoutPriceRow : CartPriceRow;
  const Divider = variant === "checkout" ? CheckoutSummaryDivider : () => <CartDivider weight={1} />;

  return (
    <div className="flex flex-col gap-6">
      {showTitle ? (
        <div className="flex flex-col gap-6">
          <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
            Price Details
          </h2>
          <Divider />
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <PriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
          {offerDiscount > 0 ? (
            <PriceRow label="Offer Discount" value={formatCartDiscountPrice(offerDiscount)} />
          ) : null}
          {giftCardDiscount > 0 ? (
            <PriceRow label="Gift Card Applied" value={formatCartDiscountPrice(giftCardDiscount)} />
          ) : null}
        </div>

        <Divider />

        <div className="flex flex-col gap-3">
          <PriceRow label="Taxes" value={formatCartPrice(taxes)} />
          <PriceRow label="Shipping" value={shippingLabel} />
        </div>

        <Divider />
        <PriceRow label="Total" value={formatCartPrice(total)} emphasis />
      </div>
    </div>
  );
};

export default PriceDetailsBreakdown;
