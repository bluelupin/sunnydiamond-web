"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { CartOutlineLink } from "@/features/cart/components/CartFlowUi";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutMobileOrderSummaryDrawer from "./CheckoutMobileOrderSummaryDrawer";
import CheckoutMobileStickyFooter from "./CheckoutMobileStickyFooter";
import CheckoutOtpModal from "./CheckoutOtpModal";
import { checkoutFlowSpec } from "../data/checkoutFlowSpec";
import { CheckoutFormStep, CheckoutPaymentStep } from "./CheckoutSteps";
import CheckoutSuccessView from "./CheckoutSuccessView";
import {
  useCheckoutFormValidation,
  useCheckoutPaymentValidation,
} from "@/features/checkout/hooks/use-checkout-validation";
import {
  sanitizeCardCvvInput,
  sanitizeCardExpiryInput,
  sanitizeCardNumberInput,
  sanitizePhoneInput,
  sanitizePincodeInput,
} from "@/shared/utils/formValidation";
import {
  createEmptyCheckoutForm,
  createEmptyPaymentForm,
  type CheckoutFormData,
  type CheckoutPaymentData,
  type CheckoutStep,
} from "../types/checkout.types";

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
  const [offersOpen, setOffersOpen] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const formValidation = useCheckoutFormValidation(form);
  const paymentValidation = useCheckoutPaymentValidation(payment, totalPrice);

  const mobileScrollPadding = (() => {
    const { mobile } = checkoutFlowSpec;
    const clearance = offersOpen
      ? mobile.stickyFooterOffersExpandedClearance
      : mobile.stickyFooterCollapsedClearance;
    return `max-lg:pb-[calc(${clearance}px+env(safe-area-inset-bottom,0px))]`;
  })();

  const updateForm = (field: keyof CheckoutFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayment = (field: keyof CheckoutPaymentData, value: string) => {
    if (field === "cardNumber") {
      setPayment((prev) => ({ ...prev, cardNumber: sanitizeCardNumberInput(value) }));
      return;
    }

    if (field === "cvv") {
      setPayment((prev) => ({ ...prev, cvv: sanitizeCardCvvInput(value) }));
      return;
    }

    if (field === "expiry") {
      setPayment((prev) => ({ ...prev, expiry: sanitizeCardExpiryInput(value) }));
      return;
    }

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

  if (items.length === 0 && step !== "success") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
          No items to checkout
        </h1>
        <CartOutlineLink href="/jewellery-product" className="w-fit">Continue Shopping</CartOutlineLink>
      </section>
    );
  }

  if (step === "success") {
    return <CheckoutSuccessView contact={form.phoneOrEmail} items={placedItems} totalPrice={placedTotal} />;
  }

  const handleVerifyPhone = () => {
    formValidation.markTouched("phoneOrEmail");
    formValidation.markSubmitted();

    if (formValidation.errors.phoneOrEmail) {
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
    formValidation.validateSubmit(() => {
      if (!phoneVerified) {
        setShowOtpModal(true);
        toast({
          title: "Verification required",
          description: "Please verify your phone number before continuing.",
        });
        return;
      }

      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const placeOrder = () => {
    paymentValidation.validateSubmit(() => {
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
    });
  };

  const sidebarCtaLabel = step === "payment" ? "Pay Now" : "Continue to Payment";
  const ctaDisabled = submitting;
  const handleSidebarCta = step === "payment" ? placeOrder : handleContinueToPayment;

  const handleFormChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    if (field === "pincode" || field === "billingPincode") {
      updateForm(field, sanitizePincodeInput(String(value)));
      return;
    }

    if (field === "shippingPhone" || field === "billingPhone") {
      updateForm(field, sanitizePhoneInput(String(value), "+91"));
      return;
    }

    if (field === "phoneOrEmail" && !String(value).includes("@")) {
      updateForm(field, sanitizePhoneInput(String(value), "+91"));
      return;
    }

    updateForm(field, value);
  };

  return (
    <section className={cn("bg-gray300", mobileScrollPadding)}>
      <div className="mx-auto w-full 2xl:max-w-1920 px-4 py-6 md:px-8 lg:px-10 lg:py-10 2xl:px-[60px]">
        <h1
          className={cn(
            "font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl",
            "max-lg:border-b max-lg:border-neutral300 max-lg:pb-6",
            step === "payment" ? "mb-6 lg:mb-10" : "mb-6",
          )}
        >
          Complete Checkout
        </h1>

        <div
          className={cn(
            "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,783px)_553px]",
            showOtpModal && "lg:grid-cols-[minmax(0,899px)_437px]",
          )}
        >
          <div className={cn("flex flex-col", step === "payment" ? "gap-[33px]" : "gap-6")}>
            {step === "form" ? (
              <CheckoutFormStep
                form={form}
                onChange={handleFormChange}
                phoneVerified={phoneVerified}
                onVerifyPhone={handleVerifyPhone}
                validation={formValidation}
              />
            ) : (
              <CheckoutPaymentStep
                form={form}
                payment={payment}
                onPaymentChange={updatePayment}
                onEditPersonal={() => setStep("form")}
                onEditDelivery={() => setStep("form")}
                onEditPayment={() => setStep("form")}
                validation={paymentValidation}
              />
            )}
          </div>

          <CheckoutOrderSummary
            className="hidden lg:block"
            ctaLabel={sidebarCtaLabel}
            ctaDisabled={ctaDisabled}
            onCtaClick={handleSidebarCta}
          />
        </div>
      </div>

      <CheckoutMobileStickyFooter
        offersOpen={offersOpen}
        onOffersToggle={() => setOffersOpen((open) => !open)}
        onOrderSummaryOpen={() => setOrderSummaryOpen(true)}
        ctaLabel={sidebarCtaLabel}
        onCtaClick={handleSidebarCta}
        ctaDisabled={ctaDisabled}
      />

      <CheckoutMobileOrderSummaryDrawer
        open={orderSummaryOpen}
        onOpenChange={setOrderSummaryOpen}
        ctaLabel={sidebarCtaLabel}
        onCtaClick={handleSidebarCta}
        ctaDisabled={ctaDisabled}
      />

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
