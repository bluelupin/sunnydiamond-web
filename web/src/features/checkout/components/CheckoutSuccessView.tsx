"use client";

import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  CartDivider,
  CartMetaRow,
  CartPriceRow,
  CartPrimaryLink,
  CartSuccessCheck,
} from "@/features/cart/components/CartFlowUi";
import { getExpectedDeliveryDate } from "../types/checkout.types";

type CheckoutSuccessViewProps = {
  contact: string;
  items: CartLineItem[];
  totalPrice: number;
};

const CheckoutSuccessView = ({ contact, items, totalPrice }: CheckoutSuccessViewProps) => (
  <section className="bg-gray300 pb-16">
    <div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 py-10 lg:px-10 lg:py-16">
      <div className="flex w-full max-w-[560px] flex-col gap-6 bg-white p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <CartSuccessCheck />
          <h1 className="font-larken text-[32px] font-light leading-110 text-darkblack">
            Order Successfully Placed
          </h1>
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            Your order is expected to be delivered by {getExpectedDeliveryDate()}.
          </p>
        </div>

        <div className="flex flex-col gap-6 bg-gray100 px-4 py-6">
          <h2 className="font-larken text-xl font-light leading-110 text-darkblack">Order Summary</h2>
          <CartDivider weight={1} />

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex h-[68px] items-center gap-6">
                <div className="relative h-[53px] w-[60px] shrink-0 overflow-hidden bg-gray200">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {item.product.name}
                  </p>
                  <CartMetaRow parts={formatCartLineMeta(item)} />
                </div>
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  {formatCartPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <CartDivider weight={1} />
          <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
        </div>

        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-darkblack" aria-hidden />
          <p className="font-gill text-base font-light leading-110 text-[#121212]">
            We have also initiated your account setup, please check your email{" "}
            <strong className="font-normal">{contact || "on file"}</strong> to complete setup.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral300 pt-6 [border-top-width:0.5px]">
          <CartPrimaryLink href="/order-tracking" className="w-full uppercase">
            Track Order
          </CartPrimaryLink>
          <div className="flex justify-center">
            <Link
              href="/jewellery-product"
              className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              Go Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CheckoutSuccessView;
