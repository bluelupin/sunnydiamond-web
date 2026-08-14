"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/shared/hooks/use-toast";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { MobileStickyFooterSpacer } from "@/shared/ui/layout/MobileStickyFooterSpacer";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutMobileOrderSummaryDrawer from "./CheckoutMobileOrderSummaryDrawer";
import CheckoutMobileStickyFooter from "./CheckoutMobileStickyFooter";
import CheckoutOtpModal, { type CheckoutOtpVerifyResult } from "./CheckoutOtpModal";
import { CheckoutFormStep, CheckoutPaymentStep } from "./CheckoutSteps";
import CheckoutSuccessView from "./CheckoutSuccessView";
import CheckoutPageSkeleton from "./skeletons/CheckoutPageSkeleton";
import { registerGuestCustomerAfterOrder } from "../services/guestCustomerRegistration";
import {
  useCheckoutFormValidation,
  useCheckoutPaymentValidation,
} from "@/features/checkout/hooks/use-checkout-validation";
import { useCheckoutCustomerPrefill } from "@/features/checkout/hooks/use-checkout-customer-prefill";
import { sanitizePhoneInput, sanitizePincodeInput, isCheckoutEmailContact, isCodAvailableForOrderTotal, validateRequiredEmail } from "@/shared/utils/formValidation";
import {
  createEmptyCheckoutForm,
  createEmptyPaymentForm,
  type CheckoutFormData,
  type CheckoutPaymentData,
  type CheckoutStep,
} from "../types/checkout.types";
import {
  applyCustomerAddressToCheckoutForm,
  sanitizeCheckoutFormNames,
} from "../utils/checkoutCustomer.utils";
import {
  completeGuestCheckout,
  ensureGuestCartId,
  fetchActiveCartState,
  prepareCheckoutForPayment,
  selectFirstAvailableGuestShippingMethod,
  setCartGiftOptions,
} from "@/services/magento/cart/cart.service";
import { readCartLineMetadata } from "@/services/magento/cart/cartSession";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  collectRazorpayPayment,
  resetRazorpayCart,
  verifyRazorpayPayment,
} from "../services/razorpayCheckout";
import {
  clearPendingCheckoutPayment,
  getPaidPendingCheckoutPayment,
  readPendingCheckoutPayment,
  savePendingCheckoutPayment,
} from "../services/checkoutPendingPayment";
import { isCustomerEmailAvailable } from "@/services/magento/customer/customerEmailAvailability.service";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";

const CheckoutPage = () => {
  const {
    items,
    totalPrice,
    clearCart,
    applyMagentoCartState,
    refreshCart,
    isHydrating,
    isUpdating,
  } = useCart();
  const { refresh: refreshAuth } = useAuth();
  const { toast } = useToast();
  const { openLoginModal } = useLoginModal();
  const searchParams = useSearchParams();
  const paymentReturnHandledRef = useRef(false);
  const {
    isAuthenticated,
    isLoading: isAuthPrefillLoading,
    addressesLoading,
    customer,
    defaultFormPatch,
    defaultShippingAddress,
    refreshAddresses,
  } = useCheckoutCustomerPrefill();
  const contactPrefillAppliedRef = useRef(false);
  const shippingPrefillAppliedRef = useRef(false);
  const verifiedCheckoutOtpRef = useRef<string | null>(null);
  const lastCheckedGuestEmailRef = useRef("");
  const checkoutStatusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [step, setStep] = useState<CheckoutStep>("form");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [orderSuccessAuthenticated, setOrderSuccessAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const paymentInFlightRef = useRef(false);
  const checkoutLockedRef = useRef(false);
  const [isSavingAddresses, setIsSavingAddresses] = useState(false);
  const [placedItems, setPlacedItems] = useState<CartLineItem[]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutFormData>(createEmptyCheckoutForm);
  const [payment, setPayment] = useState<CheckoutPaymentData>(createEmptyPaymentForm);
  const [offersOpen, setOffersOpen] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [checkoutStatusToastMessage, setCheckoutStatusToastMessage] = useState<string | null>(null);
  const { footerRef, clearancePx } = useMobileStickyFooterClearance();

  // Backend strips cod-family payment methods from carts holding engraved items.
  const hasEngravedItems = items.some((item) => Boolean(item.options.engraving?.trim()));

  const formValidation = useCheckoutFormValidation(form);
  const paymentValidation = useCheckoutPaymentValidation(payment, totalPrice, hasEngravedItems);

  // Signed-in checkout requires a Magento saved address (fields are hidden otherwise).
  const hasDeliveryAddressAvailable = Boolean(defaultShippingAddress);

  const showDeliveryAddressRequiredFeedback = () => {
    document
      .getElementById("checkout-delivery-address-required")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast({
      title: "Delivery address required",
      description:
        "Add a delivery address in My Addresses on your profile, then return here to continue.",
    });
  };

  const dismissCheckoutStatusToast = useCallback(() => {
    if (checkoutStatusToastTimeoutRef.current) {
      clearTimeout(checkoutStatusToastTimeoutRef.current);
      checkoutStatusToastTimeoutRef.current = null;
    }
    setCheckoutStatusToastMessage(null);
  }, []);

  const showCheckoutStatusToast = useCallback(
    (message: string) => {
      dismissCheckoutStatusToast();
      setCheckoutStatusToastMessage(message);
      checkoutStatusToastTimeoutRef.current = setTimeout(() => {
        setCheckoutStatusToastMessage(null);
        checkoutStatusToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissCheckoutStatusToast],
  );

  const showOrderPlacedToast = useCallback(
    (orderNumber: string) => {
      showCheckoutStatusToast(`Order #${orderNumber} has been placed successfully.`);
    },
    [showCheckoutStatusToast],
  );

  useEffect(() => {
    return () => {
      if (checkoutStatusToastTimeoutRef.current) {
        clearTimeout(checkoutStatusToastTimeoutRef.current);
      }
    };
  }, []);

  const checkoutStatusToast = (
    <AppStatusToast
      open={Boolean(checkoutStatusToastMessage)}
      message={checkoutStatusToastMessage ?? ""}
    />
  );

  const updateForm = (field: keyof CheckoutFormData, value: string | boolean) => {
    if (checkoutLockedRef.current) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayment = (
    field: keyof CheckoutPaymentData,
    value: CheckoutPaymentData["method"],
  ) => {
    if (checkoutLockedRef.current) return;

    if (
      field === "method" &&
      value === "cod" &&
      (hasEngravedItems || !isCodAvailableForOrderTotal(totalPrice))
    ) {
      return;
    }

    setPayment((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (
      payment.method === "cod" &&
      (hasEngravedItems || !isCodAvailableForOrderTotal(totalPrice))
    ) {
      setPayment((prev) => ({ ...prev, method: "card" }));
    }
  }, [hasEngravedItems, payment.method, totalPrice]);

  const finalizeOrderSuccess = useCallback(
    async (input: {
      orderNumber: string;
      contact: string;
      orderItems: CartLineItem[];
      orderTotal: number;
      orderForm: CheckoutFormData;
      wasAuthenticated: boolean;
      guestOtp: string | null;
    }) => {
      setOrderSuccessAuthenticated(input.wasAuthenticated);
      setPlacedItems([...input.orderItems]);
      setPlacedTotal(input.orderTotal);
      setPlacedOrderNumber(input.orderNumber);
      setForm(input.orderForm);
      clearPendingCheckoutPayment();
      setStep("success");
      showOrderPlacedToast(input.orderNumber);
      window.history.replaceState({}, "", "/checkout");
      clearCart();

      try {
        await fetch("/api/magento/orders/line-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber: input.orderNumber,
            items: input.orderItems,
          }),
        });
      } catch {
        // Order placement already succeeded; metadata attachment is best-effort.
      }

      trackEvent("purchase", {
        currency: "INR",
        value: input.orderTotal,
        transaction_id: input.orderNumber,
        items: input.orderItems.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      if (!input.wasAuthenticated && input.guestOtp) {
        const registered = await registerGuestCustomerAfterOrder(input.orderForm, input.guestOtp);

        if (registered) {
          await refreshAuth();
          setOrderSuccessAuthenticated(true);
        }
      }
    },
    [clearCart, refreshAuth, showOrderPlacedToast],
  );

  const paymentStatus = searchParams?.get("payment");
  const paymentOrderNumber = searchParams?.get("order");
  const isPaymentReturn = paymentStatus === "success" && Boolean(paymentOrderNumber);

  useEffect(() => {
    if (paymentReturnHandledRef.current) {
      return;
    }

    if (paymentStatus === "failed") {
      paymentReturnHandledRef.current = true;
      clearPendingCheckoutPayment();
      showCheckoutStatusToast("Your payment could not be completed. Please try again.");
      window.history.replaceState({}, "", "/checkout");
      return;
    }

    if (!isPaymentReturn || !paymentOrderNumber) {
      return;
    }

    const pending = readPendingCheckoutPayment();
    if (!pending || pending.orderNumber !== paymentOrderNumber) {
      paymentReturnHandledRef.current = true;
      setPlacedOrderNumber(paymentOrderNumber);
      setPlacedTotal(totalPrice);
      setPlacedItems([...items]);
      setStep("success");
      clearPendingCheckoutPayment();
      window.history.replaceState({}, "", "/checkout");
      showOrderPlacedToast(paymentOrderNumber);
      return;
    }

    paymentReturnHandledRef.current = true;
    void finalizeOrderSuccess({
      orderNumber: pending.orderNumber,
      contact: pending.contact,
      orderItems: pending.placedItems,
      orderTotal: pending.totalPrice,
      orderForm: pending.form,
      wasAuthenticated: pending.isAuthenticated,
      guestOtp: pending.guestOtp,
    });
  }, [finalizeOrderSuccess, isPaymentReturn, paymentOrderNumber, paymentStatus, showCheckoutStatusToast, showOrderPlacedToast, items, totalPrice]);

  useEffect(() => {
    const handlePageShow = () => {
      if (isAuthenticated) {
        refreshAddresses();
        shippingPrefillAppliedRef.current = false;
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [isAuthenticated, refreshAddresses]);

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
    if (isAuthPrefillLoading || contactPrefillAppliedRef.current || !isAuthenticated || !defaultFormPatch) {
      return;
    }

    setForm((current) =>
      sanitizeCheckoutFormNames({
        ...current,
        ...defaultFormPatch,
      }),
    );
    setPhoneVerified(true);
    contactPrefillAppliedRef.current = true;
  }, [defaultFormPatch, isAuthPrefillLoading, isAuthenticated]);

  useEffect(() => {
    if (
      addressesLoading ||
      shippingPrefillAppliedRef.current ||
      !isAuthenticated ||
      !defaultShippingAddress
    ) {
      return;
    }

    setForm((current) => applyCustomerAddressToCheckoutForm(current, defaultShippingAddress));
    shippingPrefillAppliedRef.current = true;
  }, [addressesLoading, defaultShippingAddress, isAuthenticated]);

  if (isHydrating || isAuthPrefillLoading) {
    return <CheckoutPageSkeleton />;
  }

  if (items.length === 0 && step !== "success" && !isPaymentReturn) {
    return (
      <>
        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center">
          <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
            No items to checkout
          </h1>
          <CartPrimaryLink href="/jewellery" className="w-fit">Continue Shopping</CartPrimaryLink>
        </section>
        {checkoutStatusToast}
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <CheckoutSuccessView
          contact={form.phoneOrEmail}
          items={placedItems}
          totalPrice={placedTotal}
          orderNumber={placedOrderNumber}
          isAuthenticated={isAuthenticated || orderSuccessAuthenticated}
        />
        {checkoutStatusToast}
      </>
    );
  }

  const handleVerifyPhone = () => {
    if (checkoutLockedRef.current || isCheckoutEmailContact(form.phoneOrEmail)) {
      return;
    }

    formValidation.markTouched("phoneOrEmail");
    formValidation.markSubmitted();

    if (formValidation.errors.phoneOrEmail) {
      return;
    }

    setShowOtpModal(true);
  };

  const handleOtpVerified = (result: CheckoutOtpVerifyResult) => {
    verifiedCheckoutOtpRef.current = result.otp;
    setPhoneVerified(true);
    setShowOtpModal(false);

    if (result.loggedIn) {
      void refreshAuth();
      setOrderSuccessAuthenticated(true);
    }

    toast({ title: "Phone verified", description: "Your phone number has been verified." });
  };

  /**
   * Guest email only — runs when the contact field blurs.
   * Registered → toast + login modal (after login, saved details prefill).
   * New email → continue guest checkout (no modal).
   */
  const handleGuestContactBlur = () => {
    if (checkoutLockedRef.current || isAuthenticated) {
      return;
    }

    const value = form.phoneOrEmail.trim();
    if (!isCheckoutEmailContact(value) || validateRequiredEmail(value).error) {
      return;
    }

    const normalized = value.toLowerCase();
    if (lastCheckedGuestEmailRef.current === normalized) {
      return;
    }

    void (async () => {
      const emailAvailable = await isCustomerEmailAvailable(normalized);
      lastCheckedGuestEmailRef.current = normalized;

      if (emailAvailable) {
        return;
      }

      toast({
        title: "Email already registered",
        description: "This email is already registered. Please sign in to continue.",
      });
      openLoginModal({
        returnUrl: "/checkout",
        identifier: normalized,
      });
    })();
  };

  const handleContinueToPayment = () => {
    if (checkoutLockedRef.current) return;

    // Must run before form validation: with no saved address the shipping fields are
    // hidden/empty, so validateSubmit fails silently and never reaches this toast.
    if (isAuthenticated && !hasDeliveryAddressAvailable) {
      showDeliveryAddressRequiredFeedback();
      return;
    }

    formValidation.validateSubmit(() => {
      const submittedForm = { ...form };
      const contactIsEmail = isCheckoutEmailContact(submittedForm.phoneOrEmail);

      if (!isAuthenticated && !contactIsEmail && !phoneVerified) {
        setShowOtpModal(true);
        toast({
          title: "Verification required",
          description: "Please verify your phone number before continuing.",
        });
        return;
      }

      checkoutLockedRef.current = true;
      setIsSavingAddresses(true);

      void (async () => {
        try {
          // Guest email checkout only: registered account → message + login modal.
          if (!isAuthenticated && contactIsEmail) {
            const emailAvailable = await isCustomerEmailAvailable(submittedForm.phoneOrEmail);
            if (!emailAvailable) {
              toast({
                title: "Email already registered",
                description: "This email is already registered. Please sign in to continue.",
              });
              openLoginModal({
                returnUrl: "/checkout",
                identifier: submittedForm.phoneOrEmail.trim(),
              });
              return;
            }
          }

          const cartId = await ensureGuestCartId();
          const state = await prepareCheckoutForPayment(
            cartId,
            submittedForm,
            readCartLineMetadata(),
            {
              isAuthenticated,
              customerEmail: customer?.email,
            },
          );
          applyMagentoCartState(state);
          setForm(submittedForm);
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
            title: isAuthenticated ? "Could not continue to payment" : "Could not save delivery address",
            description,
          });
        } finally {
          checkoutLockedRef.current = false;
          setIsSavingAddresses(false);
        }
      })();
    });
  };

  const placeOrder = () => {
    if (checkoutLockedRef.current || paymentInFlightRef.current) return;

    paymentValidation.validateSubmit(() => {
      const submittedForm = { ...form };
      const submittedPayment = { ...payment };
      const submittedItems = [...items];
      const submittedTotal = totalPrice;

      checkoutLockedRef.current = true;
      paymentInFlightRef.current = true;
      setSubmitting(true);

      void (async () => {
        try {
          const cartId = await ensureGuestCartId();

          if (!cartId) {
            throw new Error("Your shopping bag could not be found. Please try again.");
          }

          const lineMetadata = readCartLineMetadata();
          const cartState = await fetchActiveCartState(lineMetadata);
          const cartWithShipping = await selectFirstAvailableGuestShippingMethod(
            cartId,
            cartState,
            lineMetadata,
          );
          applyMagentoCartState(cartWithShipping);

          // Re-sync the full gifting state onto the Magento cart so the order
          // carries it even when a mark was never saved through the panel.
          try {
            const giftMode = submittedItems.some((item) => item.gifting?.wrapMode === "separate")
              ? "separate"
              : "single";
            await setCartGiftOptions(
              cartId,
              {
                mode: giftMode,
                groupedNote:
                  giftMode === "single"
                    ? submittedItems.find((item) => item.gifting?.note)?.gifting?.note
                    : undefined,
                items: submittedItems.map((item) => ({
                  lineItemId: item.id,
                  isGift: Boolean(item.gifting || item.options.isGift),
                  note: giftMode === "separate" ? item.gifting?.note : undefined,
                })),
              },
              readCartLineMetadata(),
            );
          } catch {
            // Best-effort: the order comment below still records gifting for staff.
          }

          const order = await completeGuestCheckout(
            cartId,
            submittedPayment.method,
            readCartLineMetadata(),
          );

          if (order.awaitingOnlinePayment) {
            savePendingCheckoutPayment({
              orderNumber: order.orderNumber,
              contact: submittedForm.phoneOrEmail,
              totalPrice: submittedTotal,
              placedItems: submittedItems,
              guestOtp: verifiedCheckoutOtpRef.current,
              form: submittedForm,
              isAuthenticated,
            });

            const isEmailContact = submittedForm.phoneOrEmail.includes("@");
            let outcome = await collectRazorpayPayment({
              orderNumber: order.orderNumber,
              method: submittedPayment.method === "cod" ? undefined : submittedPayment.method,
              prefill: {
                name: submittedForm.name || undefined,
                email: isEmailContact ? submittedForm.phoneOrEmail : undefined,
                contact:
                  submittedForm.shippingPhone ||
                  (!isEmailContact ? submittedForm.phoneOrEmail : undefined),
              },
            });

            if (outcome.status === "dismissed") {
              const paidPending = getPaidPendingCheckoutPayment();
              if (!paidPending?.paymentId || !paidPending.signature) {
                clearPendingCheckoutPayment();
                await resetRazorpayCart(order.orderNumber);
                await refreshCart();
                showCheckoutStatusToast(
                  "Payment cancelled. Your bag has been kept as it was. You can try again anytime.",
                );
                return;
              }

              outcome = {
                status: "paid",
                paymentId: paidPending.paymentId,
                signature: paidPending.signature,
              };
            }

            try {
              await verifyRazorpayPayment({
                orderNumber: order.orderNumber,
                paymentId: outcome.paymentId,
                signature: outcome.signature,
              });
            } catch {
              // Payment is captured on Razorpay's side; Magento's webhook and
              // cron reconcile the order even if this confirmation call fails.
            }

            await finalizeOrderSuccess({
              orderNumber: order.orderNumber,
              contact: submittedForm.phoneOrEmail,
              orderItems: submittedItems,
              orderTotal: submittedTotal,
              orderForm: submittedForm,
              wasAuthenticated: isAuthenticated,
              guestOtp: verifiedCheckoutOtpRef.current,
            });

            return;
          }

          await finalizeOrderSuccess({
            orderNumber: order.orderNumber,
            contact: submittedForm.phoneOrEmail,
            orderItems: submittedItems,
            orderTotal: submittedTotal,
            orderForm: submittedForm,
            wasAuthenticated: isAuthenticated,
            guestOtp: verifiedCheckoutOtpRef.current,
          });
        } catch (error) {
          const description =
            error instanceof MagentoGraphqlError
              ? error.message
              : error instanceof Error
                ? error.message
                : "We could not place your order. Please try again.";

          showCheckoutStatusToast(description);
        } finally {
          checkoutLockedRef.current = false;
          paymentInFlightRef.current = false;
          setSubmitting(false);
        }
      })();
    });
  };

  const sidebarCtaLabel =
    step === "payment"
      ? submitting
        ? "Placing order..."
        : isUpdating
          ? "Updating..."
          : "Pay Now"
      : isSavingAddresses
        ? isAuthenticated
          ? "Continuing..."
          : "Saving address..."
        : "Continue to Payment";
  // Keep the CTA clickable when address is missing so the click can show a toast
  // (a disabled button gives no feedback and feels broken).
  const ctaDisabled = submitting || isSavingAddresses || isUpdating;
  const handleSidebarCta = step === "payment" ? placeOrder : handleContinueToPayment;

  const handleFormChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    if (checkoutLockedRef.current) return;

    if (field === "pincode" || field === "billingPincode") {
      updateForm(field, sanitizePincodeInput(String(value)));
      return;
    }

    if (field === "shippingPhone" || field === "billingPhone") {
      updateForm(field, sanitizePhoneInput(String(value), "+91"));
      return;
    }

    if (field === "phoneOrEmail") {
      const nextValue = String(value);

      if (isCheckoutEmailContact(nextValue)) {
        setPhoneVerified(false);
        verifiedCheckoutOtpRef.current = null;
        lastCheckedGuestEmailRef.current = "";
        updateForm(field, nextValue);
        return;
      }

      updateForm(field, sanitizePhoneInput(nextValue, "+91"));
      if (phoneVerified) {
        setPhoneVerified(false);
        verifiedCheckoutOtpRef.current = null;
      }
      return;
    }

    updateForm(field, value);
  };

  return (
    <section
      className={cn(
        "bg-gray300 lg:pb-16",
        "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
        "md:max-lg:pb-16",
      )}
    >
      <div className="mx-auto w-full px-5 max-md:pt-4 pt-6 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
        <h1 className="mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:mb-10 lg:text-32">
          Complete Checkout
        </h1>

        <div
          className={cn(
            "grid grid-cols-1 gap-6 md:max-lg:portrait:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:max-lg:landscape:grid-cols-2 md:max-lg:items-start lg:grid-cols-2 lg:gap-6",
          )}
        >
          <div className={cn("flex min-w-0 flex-col", step === "payment" ? "gap-[33px]" : "gap-6")}>
            {step === "form" ? (
              <CheckoutFormStep
                form={form}
                onChange={handleFormChange}
                phoneVerified={phoneVerified}
                onVerifyPhone={handleVerifyPhone}
                onContactBlur={handleGuestContactBlur}
                validation={formValidation}
                isAuthenticated={isAuthenticated}
                hasSavedDeliveryAddress={hasDeliveryAddressAvailable}
                fieldsDisabled={isSavingAddresses}
              />
            ) : (
              <CheckoutPaymentStep
                form={form}
                payment={payment}
                orderTotal={totalPrice}
                hasEngravedItems={hasEngravedItems}
                onPaymentChange={updatePayment}
                onEditPersonal={() => {
                  if (checkoutLockedRef.current || paymentInFlightRef.current) return;
                  setStep("form");
                }}
                onEditDelivery={() => {
                  if (checkoutLockedRef.current || paymentInFlightRef.current) return;
                  setStep("form");
                }}
                onEditPayment={() => {
                  if (checkoutLockedRef.current || paymentInFlightRef.current) return;
                  document
                    .getElementById("checkout-payment-methods")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                validation={paymentValidation}
                isAuthenticated={isAuthenticated}
                editDisabled={submitting}
                fieldsDisabled={submitting}
              />
            )}
            <MobileStickyFooterSpacer height={clearancePx} />
          </div>

          <CheckoutOrderSummary
            className="max-md:hidden"
            ctaLabel={sidebarCtaLabel}
            ctaDisabled={ctaDisabled}
            onCtaClick={handleSidebarCta}
          />
        </div>
      </div>

      <CheckoutMobileStickyFooter
        ref={footerRef}
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
      {checkoutStatusToast}
    </section>
  );
};

export default CheckoutPage;
