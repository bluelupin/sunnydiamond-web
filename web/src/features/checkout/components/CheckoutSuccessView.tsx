"use client";

import Image from "next/image";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  CartPriceRow,
  CartPrimaryLink,
  CartSuccessCheck,
  CartTextLink,
} from "@/features/cart/components/CartFlowUi";
import { cn } from "@/shared/utils/cn";
import { getExpectedDeliveryDate } from "../types/checkout.types";

type CheckoutSuccessViewProps = {
  contact: string;
  items: CartLineItem[];
  totalPrice: number;
  orderNumber?: string | null;
  isAuthenticated?: boolean;
};

const CheckoutSummaryDivider = () => (
  <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />
);

const SuccessItemMeta = ({ parts }: { parts: string[] }) => {
  if (parts.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {parts.map((part, index) => (
        <span key={part} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="h-4 w-[0.5px] shrink-0 bg-neutral500" aria-hidden />
          ) : null}
          <span className="font-gill text-sm font-light leading-110 tracking-[0.01em] text-darkblack">
            {part}
          </span>
        </span>
      ))}
    </div>
  );
};

const SuccessOrderItem = ({ item }: { item: CartLineItem }) => (
  <div className="flex min-h-[68px] items-center gap-6">
    <div className="relative h-[53px] w-[60px] shrink-0 overflow-hidden bg-gray200">
      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="60px" />
    </div>
    <div className="flex w-full min-w-0 flex-1 flex-col gap-2">
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {item.product.name}
      </p>
      <SuccessItemMeta parts={formatCartLineMeta(item)} />
      {item.options.engraving?.trim() ? (
        <p className="font-gill text-sm font-light leading-110 tracking-[0.01em] text-darkblack">
          Engraving: “{item.options.engraving.trim()}”
          {item.options.engravingFont ? ` (${item.options.engravingFont})` : null}
        </p>
      ) : null}
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {formatCartPrice(item.product.price * item.quantity)}
      </p>
    </div>
  </div>
);

const SuccessCtaSection = ({
  className,
  isAuthenticated,
  orderNumber,
}: {
  className?: string;
  isAuthenticated?: boolean;
  orderNumber?: string | null;
}) => {
  const trackingHref = orderNumber
    ? `/order-tracking?order=${encodeURIComponent(orderNumber)}`
    : "/order-tracking";

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* {isAuthenticated ? (
        <CartPrimaryLink href="/profile?section=orders" className="w-full uppercase">
          View My Orders
        </CartPrimaryLink>
      ) : (
        <CartPrimaryLink href={trackingHref} className="w-full uppercase">
          Track Order
        </CartPrimaryLink>
      )} */}
      {isAuthenticated && orderNumber &&
        <CartPrimaryLink href={trackingHref} className="w-full uppercase">
          Track Order
        </CartPrimaryLink>
      }
      {/* {isAuthenticated && orderNumber ? (
        <CartTextLink
          href={`/profile/orders/${encodeURIComponent(orderNumber)}`}
          className="mx-auto uppercase"
        >
          View Order Details
        </CartTextLink>
      ) : null} */}
      {/* {isAuthenticated && orderNumber ? (
        <CartTextLink href={trackingHref} className="mx-auto uppercase">
          Track This Order
        </CartTextLink>
      ) : null} */}
      <div className="flex justify-center">
        <CartTextLink href="/jewellery" className="uppercase">
          Go Back to Shopping
        </CartTextLink>
      </div>
    </div>
  );
};

const CheckoutSuccessView = ({
  contact,
  items,
  totalPrice,
  orderNumber,
  isAuthenticated = false,
}: CheckoutSuccessViewProps) => (
  <section className="bg-gray300 max-lg:min-h-[100dvh] max-lg:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
    <div className="mx-auto flex w-full max-w-[1440px] justify-center px-5 py-6 md:px-8 lg:px-10 lg:py-16">
      <div className="flex w-full max-w-[560px] flex-col gap-6 max-lg:max-w-none max-lg:gap-6 lg:p-6">
        <div className="flex flex-col items-center gap-6">
          <span className="text-[#69B353]" aria-hidden>
            <CartSuccessCheck />
          </span>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
              Order Successfully Placed
            </h1>
            {orderNumber ? (
              <p className="font-gill text-base font-normal leading-110 text-darkblack">
                Order number: {orderNumber}
              </p>
            ) : null}
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Your order is expected to be delivered by {getExpectedDeliveryDate()}.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-gray200 px-4 py-6">
          <h2 className="font-larken text-xl font-light leading-110 text-darkblack">Order Summary</h2>
          <CheckoutSummaryDivider />

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <SuccessOrderItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <CheckoutSummaryDivider />
            <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShoppingBagIcon className="size-6 shrink-0 text-darkblack" aria-hidden />
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            {isAuthenticated ? (
              <>
                A confirmation has been sent to{" "}
                <span className="font-normal">{contact || "your email"}</span>. You can view this
                order anytime in My Profile.
              </>
            ) : (
              <>
                We have also initiated your account setup, please check your email{" "}
                <span className="font-normal">{contact || "on file"}</span> to complete setup.
              </>
            )}
          </p>
        </div>

        <div className="hidden border-t border-neutral300 pt-6 lg:flex lg:flex-col lg:gap-4 [border-top-width:0.5px]">
          <SuccessCtaSection isAuthenticated={isAuthenticated} orderNumber={orderNumber} />
        </div>
      </div>
    </div>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral300 bg-white px-5 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] lg:hidden [border-top-width:0.5px]">
      <SuccessCtaSection isAuthenticated={isAuthenticated} orderNumber={orderNumber} />
    </div>
  </section>
);

export default CheckoutSuccessView;
