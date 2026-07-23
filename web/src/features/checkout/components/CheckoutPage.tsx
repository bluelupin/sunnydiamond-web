"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
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
import {
  completeGuestCheckout,
  ensureGuestCartId,
  prepareGuestCheckoutForPayment,
} from "@/services/magento/cart/cart.service";
import { readCartLineMetadata } from "@/services/magento/cart/cartSession";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";

const CheckoutPage = () => {
  const {
    items,
    totalPrice,
    clearCart,
    applyMagentoCartState,
    refreshCart,
    selectShippingMethod,
    shippingMethods,
    selectedShippingMethod,
    isHydrating,
    isUpdating,
  } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("form");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSavingAddresses, setIsSavingAddresses] = useState(false);
  const [placedItems, setPlacedItems] = useState<CartLineItem[]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isHydrating) {
      void refreshCart();
    }
  }, [isHydrating, refreshCart]);

  useEffect(() => {
    if (step === "payment") {
      void refreshCart();
    }
  }, [refreshCart, step]);

  if (isHydrating) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-gray300 px-4 py-20 text-center">
        <p className="sr-only" aria-live="polite">
          Loading checkout
        </p>
      </section>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
          No items to checkout
        </h1>
        <CartPrimaryLink href="/jewellery" className="w-fit">Continue Shopping</CartPrimaryLink>
      </section>
    );
  }

  if (step === "success") {
    return (
      <CheckoutSuccessView
        contact={form.phoneOrEmail}
        items={placedItems}
        totalPrice={placedTotal}
        orderNumber={placedOrderNumber}
      />
    );
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

      void (async () => {
        setIsSavingAddresses(true);

        try {
          const cartId = await ensureGuestCartId();
          const state = await prepareGuestCheckoutForPayment(
            cartId,
            form,
            readCartLineMetadata(),
          );
          applyMagentoCartState(state);
          setStep("payment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          const description =
            error instanceof MagentoGraphqlError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Please check your address details and try again.";

          toast({
            title: "Could not save delivery address",
            description,
          });
        } finally {
          setIsSavingAddresses(false);
        }
      })();
    });
  };

  const placeOrder = () => {
    paymentValidation.validateSubmit(() => {
      void (async () => {
        setSubmitting(true);

        try {
          const cartId = await ensureGuestCartId();

          if (!cartId) {
            throw new Error("Your shopping bag could not be found. Please try again.");
          }

          if (requiresShippingSelection) {
            toast({
              title: "Shipping required",
              description: "Please select a shipping method before placing your order.",
            });
            return;
          }

          const order = await completeGuestCheckout(
            cartId,
            payment.method,
            readCartLineMetadata(),
          );

          void fetch("/api/magento/orders/line-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: order.orderNumber,
              items,
            }),
          }).catch(() => {
            // Order placement already succeeded; metadata attachment is best-effort.
          });

          trackEvent("purchase", {
            currency: "INR",
            value: totalPrice,
            transaction_id: order.orderNumber,
            items: items.map((item) => ({
              item_id: item.product.id,
              item_name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          });

          setPlacedItems([...items]);
          setPlacedTotal(totalPrice);
          setPlacedOrderNumber(order.orderNumber);
          clearCart();
          setStep("success");
          toast({
            title: "Order placed!",
            description: `Order #${order.orderNumber} has been placed successfully.`,
          });
        } catch (error) {
          const description =
            error instanceof MagentoGraphqlError
              ? error.message
              : error instanceof Error
                ? error.message
                : "We could not place your order. Please try again.";

          toast({
            title: "Order could not be placed",
            description,
          });
        } finally {
          setSubmitting(false);
        }
      })();
    });
  };

  const requiresShippingSelection = shippingMethods.length > 0 && !selectedShippingMethod;
  const sidebarCtaLabel =
    step === "payment"
      ? submitting
        ? "Placing order..."
        : isUpdating
          ? "Updating..."
          : "Pay Now"
      : isSavingAddresses
        ? "Saving address..."
        : "Continue to Payment";
  const ctaDisabled = submitting || isSavingAddresses || isUpdating || requiresShippingSelection;
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
                shippingMethods={shippingMethods}
                selectedShippingMethod={selectedShippingMethod}
                onShippingMethodChange={(carrierCode, methodCode) => {
                  void selectShippingMethod(carrierCode, methodCode);
                }}
                shippingSelectionDisabled={isUpdating}
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
