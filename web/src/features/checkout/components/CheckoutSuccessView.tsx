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
import { getExpectedDeliveryDate } from "../types/checkout.types";

type CheckoutSuccessViewProps = {
  contact: string;
  items: CartLineItem[];
  totalPrice: number;
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

const CheckoutSuccessView = ({ contact, items, totalPrice }: CheckoutSuccessViewProps) => (
  <section className="bg-gray300 pb-16">
    <div className="mx-auto flex w-full max-w-[1440px] justify-center px-5 py-10 md:px-8 lg:px-10 lg:py-16">
      <div className="flex w-full max-w-[560px] flex-col gap-6 bg-transparent p-6">
        <div className="flex flex-col items-center gap-6">
          <span className="text-[#69B353]" aria-hidden>
            <CartSuccessCheck />
          </span>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 className="font-larken text-32 font-light leading-110 text-darkblack">
              Order Successfully Placed
            </h1>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Your order is expected to be delivered by {getExpectedDeliveryDate()}.
            </p>
          </div>
        </div>

        <div className="flex min-h-[340px] flex-col gap-6 bg-gray200 px-4 py-6">
          <h2 className="font-larken text-xl font-light leading-110 text-darkblack">Order Summary</h2>
          <CheckoutSummaryDivider />

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex h-[68px] items-center gap-6">
                <div className="relative h-[53px] w-[60px] shrink-0 overflow-hidden bg-gray200">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex w-full max-w-[214px] min-w-0 flex-1 flex-col gap-2">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {item.product.name}
                  </p>
                  <SuccessItemMeta parts={formatCartLineMeta(item)} />
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {formatCartPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
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
            We have also initiated your account setup, please check you email{" "}
            <span className="font-normal">{contact || "on file"}</span> to complete setup.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t-[0.5px] border-neutral300 pt-6">
          <CartPrimaryLink href="/order-tracking" className="w-full uppercase">
            Track Order
          </CartPrimaryLink>
          <div className="flex justify-center">
            <CartTextLink href="/jewellery-product" className="uppercase">
              Go Back to Shopping
            </CartTextLink>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CheckoutSuccessView;
