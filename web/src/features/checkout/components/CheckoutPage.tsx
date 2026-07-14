"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FormInput } from "@/shared/ui/FormInput";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { cartFlowSpec } from "@/features/cart/data/cartFlowSpec";
import { formatCartLineMeta, formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  CartDivider,
  CartMetaRow,
  CartOutlineLink,
  CartPriceRow,
  CartPrimaryButton,
  CartPrimaryLink,
  CartSuccessCheck,
} from "@/features/cart/components/CartFlowUi";

const CheckoutPage = () => {
  const { items, totalPrice, subtotal, taxes, clearCart } = useCart();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    verifyCode: "",
  });

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    if (items.length > 0) {
      trackEvent("begin_checkout", {
        currency: "INR",
        value: totalPrice,
        items: items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [items, totalPrice]);

  if (items.length === 0 && !orderPlaced) {
    return (
      <section
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center"
        style={{ backgroundColor: cartFlowSpec.colors.pageBackground }}
      >
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
          No items to checkout
        </h1>
        <CartOutlineLink href="/jewellery-product">Continue Shopping</CartOutlineLink>
      </section>
    );
  }

  if (orderPlaced) {
    return (
      <section
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center"
        style={{ backgroundColor: cartFlowSpec.colors.pageBackground }}
      >
        <CartSuccessCheck />
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-[48px]">
          Order Successfully Placed
        </h1>
        <p className="max-w-md font-gill text-base font-light leading-110 text-neutral500">
          We&apos;ll send you a confirmation email shortly with your order details.
        </p>
        <CartPrimaryLink href="/jewellery-product" className="mt-2 w-full max-w-xs">
          Continue Shopping
        </CartPrimaryLink>
      </section>
    );
  }

  const placeOrder = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      trackEvent("purchase", {
        currency: "INR",
        value: totalPrice,
        items: items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setOrderPlaced(true);
      toast({ title: "Order placed!", description: "Your order has been placed successfully." });
    }, 1200);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!needsVerify) {
      setNeedsVerify(true);
      return;
    }
    placeOrder();
  };

  return (
    <section className="pb-16" style={{ backgroundColor: cartFlowSpec.colors.pageBackground }}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-10 lg:py-16">
        <h1 className="mb-10 font-larken text-2xl font-light leading-110 text-darkblack lg:text-[48px]">
          Complete Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_553px]"
          style={{ gap: cartFlowSpec.page.sectionGap }}
        >
          <div className="flex flex-col" style={{ gap: cartFlowSpec.page.sectionGap }}>
            <fieldset className="flex flex-col gap-4">
              <legend className="font-larken text-2xl font-light leading-110 text-darkblack">
                Contact Information
              </legend>
              <FormInput
                type="email"
                placeholder="Email address"
                label="Email Address"
                required
                value={form.email}
                onChange={updateField("email")}
              />
            </fieldset>

            <fieldset className="flex flex-col gap-4">
              <legend className="font-larken text-2xl font-light leading-110 text-darkblack">
                Shipping Address
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  type="text"
                  placeholder="First name"
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={updateField("firstName")}
                />
                <FormInput
                  type="text"
                  placeholder="Last name"
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={updateField("lastName")}
                />
              </div>
              <FormInput
                type="text"
                placeholder="Address"
                label="Address"
                required
                value={form.address}
                onChange={updateField("address")}
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <FormInput
                  type="text"
                  placeholder="City"
                  label="City"
                  required
                  value={form.city}
                  onChange={updateField("city")}
                />
                <FormInput
                  type="text"
                  placeholder="State"
                  label="State"
                  required
                  value={form.state}
                  onChange={updateField("state")}
                />
                <FormInput
                  type="text"
                  placeholder="ZIP Code"
                  label="ZIP Code"
                  required
                  value={form.zip}
                  onChange={updateField("zip")}
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </fieldset>

            {needsVerify ? (
              <fieldset
                className="flex flex-col gap-4 border border-neutral200 bg-white"
                style={{ padding: cartFlowSpec.priceDetails.padding }}
              >
                <legend className="font-larken text-2xl font-light leading-110 text-darkblack">
                  Verify your email
                </legend>
                <p className="font-gill text-sm font-light leading-110 text-neutral500">
                  Complete your checkout. We&apos;ll take care of setting up your account for
                  effortless order tracking and quicker future purchases.
                </p>
                <FormInput
                  type="text"
                  placeholder="Enter verification code"
                  label="Verification Code"
                  required
                  value={form.verifyCode}
                  onChange={updateField("verifyCode")}
                />
              </fieldset>
            ) : null}
          </div>

          <aside className="flex h-fit flex-col bg-white lg:sticky lg:top-24" style={{ padding: cartFlowSpec.priceDetails.padding }}>
            <div className="flex flex-col" style={{ gap: cartFlowSpec.priceDetails.titleGap }}>
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                Order Summary
              </h2>

              <div className="flex flex-col" style={{ gap: cartFlowSpec.page.columnGap }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border border-neutral200"
                    style={{
                      gap: cartFlowSpec.card.imageGap,
                      padding: `${cartFlowSpec.drawer.previewPaddingY}px ${cartFlowSpec.drawer.previewPaddingX}px`,
                      backgroundColor: cartFlowSpec.colors.previewBackground,
                    }}
                  >
                    <div
                      className="relative shrink-0 overflow-hidden bg-neutral200"
                      style={{
                        width: cartFlowSpec.drawer.previewImage.width,
                        height: cartFlowSpec.drawer.previewImage.height,
                      }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="min-w-0 flex flex-1 flex-col"
                      style={{ gap: cartFlowSpec.drawer.previewInfoGap }}
                    >
                      <p className="font-gill text-base leading-110 text-darkblack">
                        {item.product.name}
                      </p>
                      <CartMetaRow parts={formatCartLineMeta(item)} />
                      <p className="font-gill text-base leading-110 text-darkblack">
                        {formatCartPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <CartDivider weight={1} />

              <div className="flex flex-col" style={{ gap: cartFlowSpec.priceDetails.rowGap }}>
                <CartPriceRow label="Subtotal" value={formatCartPrice(subtotal)} />
                <CartPriceRow label="Taxes" value={formatCartPrice(taxes)} />
                <CartPriceRow label="Shipping" value="Free" />
                <CartPriceRow label="Total" value={formatCartPrice(totalPrice)} emphasis />
              </div>
            </div>

            <CartPrimaryButton
              type="submit"
              className="mt-6 w-full uppercase"
              disabled={submitting}
            >
              {submitting ? "Processing..." : needsVerify ? "Verify & Place Order" : "Verify"}
            </CartPrimaryButton>
          </aside>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
