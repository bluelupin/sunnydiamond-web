"use client";

import InformationIcon from "@/assets/Icons/InformationIcon";
import {
  CartDivider,
  CartMetaRow,
  CartPrimaryLink,
  CartSuccessCheck,
  CartTextLink,
} from "@/features/cart/components/CartFlowUi";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import {
  formatCartLineMeta,
  formatCartPrice,
  getCartLineDisplayTotal,
} from "@/features/cart/utils/formatCartLine";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { buildProfileOrderDetailHref } from "@/features/account/utils/profileOrderNavigation";
import { getExpectedDeliveryDate } from "../types/checkout.types";

type CheckoutSuccessViewProps = {
  contact: string;
  items: CartLineItem[];
  totalPrice: number;
  orderNumber?: string | null;
  isAuthenticated?: boolean;
};

const SuccessOrderItem = ({ item }: { item: CartLineItem }) => (
  <div className="flex min-h-[68px] items-center gap-6">
    <div className="relative h-[53px] w-[60px] shrink-0 overflow-hidden bg-gray200">
      <OptimizedImage
        src={item.product.image}
        alt={item.product.name}
        width={60}
        height={53}
        className="size-full object-cover"
        sizes="60px"
      />
    </div>
    <div className="flex w-full min-w-0 flex-1 flex-col gap-2">
      <p
        className={cn(
          "font-gill text-base font-normal leading-110 text-darkblack",
          productNameDisplayClassName,
        )}
      >
        {item.product.name}
      </p>
      <CartMetaRow parts={formatCartLineMeta(item)} variant="checkout" />
      {item.options.engraving?.trim() ? (
        <p className="font-gill text-sm font-light leading-110 tracking-[0.01em] text-darkblack">
          Engraving: “{item.options.engraving.trim()}”
          {item.options.engravingFont ? ` (${item.options.engravingFont})` : null}
        </p>
      ) : null}
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {formatCartPrice(getCartLineDisplayTotal(item))}
      </p>
    </div>
  </div>
);

const SuccessCtaSection = ({
  className,
  orderNumber,
  mobile = false,
}: {
  className?: string;
  orderNumber?: string | null;
  mobile?: boolean;
}) => {
  const trackingHref = orderNumber?.trim()
    ? buildProfileOrderDetailHref(orderNumber)
    : "/profile?section=orders";

  return (
    <div className={cn("flex w-full flex-col items-center gap-4", className)}>
      {orderNumber ? (
        <CartPrimaryLink href={trackingHref} className="w-full uppercase">
          {mobile ? "Track Your Order" : "Track Order"}
        </CartPrimaryLink>
      ) : null}
      <CartTextLink href="/jewellery" className="uppercase">
        Continue Shopping
      </CartTextLink>
    </div>
  );
};

const SuccessInfoMessage = ({
  contact,
  isAuthenticated,
}: {
  contact: string;
  isAuthenticated: boolean;
}) => {
  const email = contact.trim() || "your email";

  if (isAuthenticated) {
    return (
      <>
        A confirmation has been sent to{" "}
        <span className="font-semibold text-darkblack">{email}</span>. You can view this order
        anytime in My Profile.
      </>
    );
  }

  return (
    <>
      Complete your account setup via the email we&apos;ve sent to{" "}
      <span className="font-semibold text-darkblack">{email}</span> to enjoy order tracking and a
      faster checkout experience.
    </>
  );
};

const CheckoutSuccessView = ({
  contact,
  items,
  totalPrice,
  orderNumber,
  isAuthenticated = false,
}: CheckoutSuccessViewProps) => {
  const displayOrderNumber = orderNumber?.trim() || null;

  return (
    <section className="bg-white lg:bg-gray300 max-lg:min-h-[100dvh] max-lg:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 py-6 lg:px-10 lg:py-16">
        <div className="flex w-full max-w-[560px] flex-col gap-6 lg:gap-6 lg:p-6">
          <div className="flex flex-col items-center gap-4 lg:gap-6">
            <span className="lg:hidden">
              <CartSuccessCheck size="sm" />
            </span>
            <span className="hidden lg:inline-flex">
              <CartSuccessCheck size="lg" />
            </span>
            <div className="flex w-full flex-col items-center gap-2 text-center lg:gap-3">
              <h1 className="font-larken text-[32px] font-light leading-110 text-darkblack">
                Order Successfully Placed
              </h1>
              {/* {displayOrderNumber ? (
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  Order number: {displayOrderNumber}
                </p>
              ) : null} */}
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                Your order is expected to arrive by {getExpectedDeliveryDate()}.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:bg-gray200 bg-gray300 px-4 py-6 lg:bg-white lg:px-4 lg:py-6">
            <h2 className="font-gill text-xl font-normal leading-110 text-darkblack">
              Order Summary
            </h2>
            <CartDivider weight={0.5} />

            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <SuccessOrderItem key={item.id} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <CartDivider weight={0.5} />
              <div className="h-[38px] flex items-center justify-between font-gill text-base font-normal leading-110 text-darkblack">
                <span>Total</span>
                <span className="text-sm lg:text-base">{formatCartPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 lg:items-center lg:gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0 text-darkblack" aria-hidden >
              <path d="M11.25 11.25C11.4489 11.25 11.6397 11.329 11.7803 11.4697C11.921 11.6103 12 11.8011 12 12V15.75C12 15.9489 12.079 16.1397 12.2197 16.2803C12.3603 16.421 12.5511 16.5 12.75 16.5" stroke="#0A0A0A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.625 8.8125C12.1428 8.8125 12.5625 8.39277 12.5625 7.875C12.5625 7.35723 12.1428 6.9375 11.625 6.9375C11.1072 6.9375 10.6875 7.35723 10.6875 7.875C10.6875 8.39277 11.1072 8.8125 11.625 8.8125Z" fill="#0A0A0A" />
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#0A0A0A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-gill text-base font-light leading-110 text-[#121212]">
              <SuccessInfoMessage contact={contact} isAuthenticated={isAuthenticated} />
            </p>
          </div>

          <div className="hidden border-t border-neutral300 pt-6 lg:flex lg:flex-col [border-top-width:0.5px]">
            <SuccessCtaSection orderNumber={displayOrderNumber} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div
          className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white"
          aria-hidden
        />
        <div className="border-t border-neutral300 bg-white px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] [border-top-width:0.5px]">
          <SuccessCtaSection orderNumber={displayOrderNumber} mobile />
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccessView;
