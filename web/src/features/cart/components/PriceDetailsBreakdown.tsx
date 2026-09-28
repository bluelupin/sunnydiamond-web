"use client";

import {
  formatCartDiscountPrice,
  formatCartPrice,
} from "@/features/cart/utils/formatCartLine";
import { CheckoutPriceRow, CheckoutSummaryDivider } from "@/features/checkout/components/CheckoutUi";
import { useCart } from "@/features/cart/context/CartContext";
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

/** A card Magento kept on the cart but cannot use: named, with the reason, and no amount. */
export const GiftCardProblemRow = () => {
  const { appliedGiftCardCode, giftCardProblem } = useCart();
  if (!appliedGiftCardCode || !giftCardProblem) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-gill text-base font-light leading-110 text-darkblack">
        Gift card {appliedGiftCardCode} not applied
      </span>
      <p className="font-gill text-sm font-light leading-110 text-neutral500">{giftCardProblem}</p>
    </div>
  );
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
          <GiftCardProblemRow />
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
