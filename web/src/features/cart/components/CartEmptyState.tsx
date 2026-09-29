"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import { cartEmptyContent } from "@/features/cart/data/cartEmptyContent";
import { CartPrimaryLink } from "./CartFlowUi";

/** Figma 4903:78154 desktop / 4903:75978 mobile — cart empty state */
const CartEmptyState = () => (
  <section className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-gray200 px-4 pb-16 pt-10 md:py-20">
    <div className="flex w-full max-w-[386px] flex-col items-center gap-6 md:gap-10">
      <div className="flex w-full flex-col items-center gap-6">
        <DiamondIcon className="size-10 text-gold500 md:size-16" aria-hidden />

        <div className="flex w-full flex-col items-center gap-6 text-center md:gap-4">
          <h1 className="w-full font-larken text-2xl font-light leading-110 text-darkblack md:text-32 md:max-w-[300px] max-w-[200px]">
            {cartEmptyContent.title}
          </h1>
          <p className="w-full font-gill text-base font-light leading-110 text-neutral500">
            {cartEmptyContent.description}
          </p>
        </div>
      </div>

      <CartPrimaryLink href={cartEmptyContent.ctaHref} className="w-auto shrink-0">
        {cartEmptyContent.ctaLabel}
      </CartPrimaryLink>
    </div>
  </section>
);

export default CartEmptyState;
