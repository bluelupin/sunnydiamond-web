"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { CartOutlineLink } from "@/features/cart/components/CartFlowUi";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutOtpModal from "./CheckoutOtpModal";
import { CheckoutFormStep, CheckoutPaymentStep } from "./CheckoutSteps";
import CheckoutSuccessView from "./CheckoutSuccessView";
import {
  createEmptyCheckoutForm,
  createEmptyPaymentForm,
  type CheckoutFormData,
  type CheckoutPaymentData,
  type CheckoutStep,
} from "../types/checkout.types";

const isShippingAddressComplete = (form: CheckoutFormData) =>
  Boolean(
    form.shippingName.trim() &&
      form.addressLine1.trim() &&
      form.pincode.trim() &&
      form.city.trim() &&
      form.state.trim(),
  );

const isBillingAddressComplete = (form: CheckoutFormData) =>
  Boolean(
    form.billingName.trim() &&
      form.billingAddressLine1.trim() &&
      form.billingPincode.trim() &&
      form.billingCity.trim() &&
      form.billingState.trim(),
  );

const isFormComplete = (form: CheckoutFormData) =>
  Boolean(
    form.name.trim() &&
      form.phoneOrEmail.trim() &&
      isShippingAddressComplete(form) &&
      (form.billingSameAsShipping || isBillingAddressComplete(form)),
  );

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("form");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedItems, setPlacedItems] = useState<CartLineItem[]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);

  const [form, setForm] = useState<CheckoutFormData>(createEmptyCheckoutForm);
  const [payment, setPayment] = useState<CheckoutPaymentData>(createEmptyPaymentForm);

  const updateForm = (field: keyof CheckoutFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayment = (field: keyof CheckoutPaymentData, value: string) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (items.length > 0 && step === "form") {
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
  }, [items, totalPrice, step]);

  const canContinueToPayment = useMemo(
    () => isFormComplete(form) && phoneVerified,
    [form, phoneVerified],
  );

  if (items.length === 0 && step !== "success") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
          No items to checkout
        </h1>
        <CartOutlineLink href="/jewellery-product">Continue Shopping</CartOutlineLink>
      </section>
    );
  }

  if (step === "success") {
    return <CheckoutSuccessView contact={form.phoneOrEmail} items={placedItems} totalPrice={placedTotal} />;
  }

  const handleVerifyPhone = () => {
    if (!form.phoneOrEmail.trim()) {
      toast({ title: "Phone required", description: "Enter your phone number before verifying." });
      return;
    }
    setShowOtpModal(true);
  };

  const handleOtpVerified = () => {
    setPhoneVerified(true);
    setShowOtpModal(false);
    toast({ title: "Phone verified", description: "Your phone number has been verified." });
  };

  const handleContinueToPayment = () => {
    if (!isFormComplete(form)) {
      toast({ title: "Incomplete form", description: "Please fill in all required fields." });
      return;
    }
    if (!phoneVerified) {
      setShowOtpModal(true);
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = () => {
    setSubmitting(true);
    window.setTimeout(() => {
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
      setPlacedItems([...items]);
      setPlacedTotal(totalPrice);
      clearCart();
      setSubmitting(false);
      setStep("success");
      toast({ title: "Order placed!", description: "Your order has been placed successfully." });
    }, 1200);
  };

  const sidebarCtaLabel = step === "payment" ? "Pay Now" : "Continue to Payment";

  return (
    <section className="bg-gray300 pb-16">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 lg:px-10 lg:py-16">
        <h1 className="mb-6 font-larken text-[48px] font-light leading-110 text-darkblack">
          Complete Checkout
        </h1>

        <div
          className={cn(
            "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,783px)_553px]",
            showOtpModal && "lg:grid-cols-[minmax(0,899px)_437px]",
          )}
        >
          <div className="flex flex-col gap-6">
            {step === "form" ? (
              <CheckoutFormStep
                form={form}
                onChange={updateForm}
                phoneVerified={phoneVerified}
                onVerifyPhone={handleVerifyPhone}
              />
            ) : (
              <CheckoutPaymentStep
                form={form}
                payment={payment}
                onPaymentChange={updatePayment}
                onEditPersonal={() => setStep("form")}
                onEditDelivery={() => setStep("form")}
              />
            )}
          </div>

          <CheckoutOrderSummary
            ctaLabel={sidebarCtaLabel}
            ctaDisabled={submitting || (step === "form" && !canContinueToPayment)}
            onCtaClick={step === "payment" ? placeOrder : handleContinueToPayment}
          />
        </div>
      </div>

      <CheckoutOtpModal
        open={showOtpModal}
        phone={form.phoneOrEmail}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerified}
      />
    </section>
  );
};

export default CheckoutPage;
