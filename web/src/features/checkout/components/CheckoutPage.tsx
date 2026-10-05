"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
import CheckoutPaymentFailedToast from "./CheckoutPaymentFailedToast";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutMobileOrderSummaryDrawer from "./CheckoutMobileOrderSummaryDrawer";
import CheckoutMobileStickyFooter from "./CheckoutMobileStickyFooter";
import CheckoutOtpModal, { type CheckoutOtpVerifyResult } from "./CheckoutOtpModal";
import { CheckoutFormStep, CheckoutPaymentStep } from "./CheckoutSteps";
import CheckoutSuccessView from "./CheckoutSuccessView";
import CheckoutPageSkeleton from "./skeletons/CheckoutPageSkeleton";
import {
  resetCheckoutSuccessHeaderActive,
  setCheckoutSuccessHeaderActive,
} from "../context/checkoutHeaderBridge";
import {
  buildCheckoutOtpTarget,
  getCheckoutRegistrationName,
  registerGuestCustomerAfterOrder,
} from "../services/guestCustomerRegistration";
import { persistGuestCheckoutAddresses } from "../services/persistGuestCheckoutAddresses";
import {
  useCheckoutFormValidation,
  useCheckoutPaymentValidation,
} from "@/features/checkout/hooks/use-checkout-validation";
import { useCheckoutCustomerPrefill } from "@/features/checkout/hooks/use-checkout-customer-prefill";
import { useCheckoutPincodeAutofill } from "@/features/checkout/hooks/use-checkout-pincode-autofill";
import { sanitizePhoneInput, sanitizePincodeInput, isCheckoutEmailContact, validateRequiredEmail } from "@/shared/utils/formValidation";
import { cartCheckoutAsideLayout } from "@/features/cart/data/cartFlowSpec";
import {
  isCodAvailableForCheckout,
  isCodOfferedByBackend,
} from "@/services/magento/cart/checkoutPayment.mapper";
import {
  createEmptyCheckoutForm,
  createEmptyPaymentForm,
  type CheckoutFormData,
  type CheckoutPaymentData,
  type CheckoutStep,
} from "../types/checkout.types";
import {
  applyCustomerAddressToCheckoutForm,
  CHECKOUT_SHIPPING_ADDRESS_FIELDS,
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
} from "../services/razorpayCheckout";
import {
  clearPendingCheckoutPayment,
  getPaidPendingCheckoutPayment,
  readPendingCheckoutPayment,
  savePendingCheckoutPayment,
} from "../services/checkoutPendingPayment";
import {
  parseCheckoutSuccessOrderNumber,
  replaceCheckoutSuccessUrl,
} from "../utils/checkoutRoutes";
import { isCustomerEmailAvailable } from "@/services/magento/customer/customerEmailAvailability.service";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { useAuthFeatures } from "@/features/auth/context/AuthFeaturesContext";

/** The form a guest filled before the create-account step reloads the page. */
const CHECKOUT_FORM_RESUME_KEY = "sunny-checkout-form-resume";

const CheckoutPage = () => {
  const {
    items,
    totalPrice,
    clearCart,
    applyMagentoCartState,
    refreshCart,
    isHydrating,
    isUpdating,
    paymentMethods,
  } = useCart();
  // Magento is the only authority on whether this cart can be paid in cash: it
  // holds the order minimum and maximum and the engraved-item rule.
  const codOffered = isCodOfferedByBackend(paymentMethods);
  const codAvailable = isCodAvailableForCheckout(codOffered, totalPrice);
  // A gift card covering the whole order: Magento's grand total is 0 and the order is
  // placed with its `free` method whatever option is selected (resolveMagentoPaymentCode).
  const noPaymentNeeded = items.length > 0 && totalPrice === 0;
  const { refresh: refreshAuth } = useAuth();
  const { toast } = useToast();
  const {
    openLoginModal,
    closeLoginModal,
    registerCheckoutRegistrationSessionExpiredHandler,
  } = useLoginModal();
  const { otpLoginEnabled, emailOtpLoginEnabled, otpCountryCodes } = useAuthFeatures();
  /**
   * With SMS sign-in off there is no mobile identity to take, so the contact field is an
   * email address and nothing else — offering "PhoneNo / Email ID" would accept a number
   * we can neither verify nor mail an order to.
   */
  const contactEmailOnly = !otpLoginEnabled;
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get("payment");
  const paymentOrderNumber = searchParams?.get("order");
  const successOrderFromPath = parseCheckoutSuccessOrderNumber(pathname);
  const isSuccessRoute = Boolean(successOrderFromPath);
  const isPaymentReturn = paymentStatus === "success" && Boolean(paymentOrderNumber);
  const shouldShowSuccess = isSuccessRoute || isPaymentReturn;
  const resolvedSuccessOrderNumber =
    successOrderFromPath ?? (isPaymentReturn ? paymentOrderNumber ?? null : null);
  const paymentReturnHandledRef = useRef(false);
  const {
    isAuthenticated,
    isLoading: isAuthPrefillLoading,
    addressesLoading,
    customer,
    addresses,
    defaultFormPatch,
    defaultShippingAddress,
    refreshAddresses,
  } = useCheckoutCustomerPrefill();
  const contactPrefillAppliedRef = useRef(false);
  const shippingPrefillAppliedRef = useRef(false);
  const verifiedCheckoutOtpRef = useRef<string | null>(null);
  const lastCheckedGuestEmailRef = useRef("");
  const checkoutStatusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCheckoutScrollSectionRef = useRef<string | null>(null);

  const [step, setStep] = useState<CheckoutStep>(shouldShowSuccess ? "success" : "form");
  useLayoutEffect(() => {
    setCheckoutSuccessHeaderActive(step === "success" || isSuccessRoute);

    return () => {
      resetCheckoutSuccessHeaderActive();
    };
  }, [isSuccessRoute, step]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [orderSuccessAuthenticated, setOrderSuccessAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const paymentInFlightRef = useRef(false);
  const checkoutLockedRef = useRef(false);
  const [isSavingAddresses, setIsSavingAddresses] = useState(false);
  const [placedItems, setPlacedItems] = useState<CartLineItem[]>(() => {
    if (!resolvedSuccessOrderNumber) {
      return [];
    }
    const pending = readPendingCheckoutPayment();
    return pending?.orderNumber === resolvedSuccessOrderNumber ? pending.placedItems : [];
  });
  const [placedTotal, setPlacedTotal] = useState(() => {
    if (!resolvedSuccessOrderNumber) {
      return 0;
    }
    const pending = readPendingCheckoutPayment();
    return pending?.orderNumber === resolvedSuccessOrderNumber ? pending.totalPrice : 0;
  });
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(resolvedSuccessOrderNumber);

  const [form, setForm] = useState<CheckoutFormData>(() => {
    if (!resolvedSuccessOrderNumber) {
      return createEmptyCheckoutForm();
    }
    const pending = readPendingCheckoutPayment();
    if (!pending || pending.orderNumber !== resolvedSuccessOrderNumber) {
      return createEmptyCheckoutForm();
    }
    const defaults = createEmptyCheckoutForm();
    return {
      ...defaults,
      ...pending.form,
      contactCountryCode: pending.form.contactCountryCode || defaults.contactCountryCode,
      shippingCountryCode: pending.form.shippingCountryCode || defaults.shippingCountryCode,
      billingCountryCode: pending.form.billingCountryCode || defaults.billingCountryCode,
    };
  });
  const [payment, setPayment] = useState<CheckoutPaymentData>(createEmptyPaymentForm);
  const [offersOpen, setOffersOpen] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [checkoutStatusToastMessage, setCheckoutStatusToastMessage] = useState<string | null>(null);
  const [paymentFailedToastOpen, setPaymentFailedToastOpen] = useState(false);
  const { footerRef, clearancePx } = useMobileStickyFooterClearance();

  // Backend strips cod-family payment methods from carts holding engraved items.
  const hasEngravedItems = items.some((item) => Boolean(item.options.engraving?.trim()));

  const pincodeAutofillEnabled = step === "form" && !shouldShowSuccess;
  useCheckoutPincodeAutofill(form, setForm, pincodeAutofillEnabled);

  // A customer with no saved address types one here, exactly like a guest. That is
  // everyone who registers from the email-code step of this page.
  const hasDeliveryAddressAvailable = Boolean(defaultShippingAddress);

  const formValidation = useCheckoutFormValidation(form, {
    // A signed-in customer's contact field is the order email, never a number.
    emailOnly: contactEmailOnly || isAuthenticated,
    requireDeliveryPhone: contactEmailOnly && (!isAuthenticated || !hasDeliveryAddressAvailable),
  });
  const paymentValidation = useCheckoutPaymentValidation(
    payment,
    codOffered,
    hasEngravedItems,
    totalPrice,
  );

  const scrollToCheckoutSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const requestCheckoutSectionScroll = useCallback((sectionId: string) => {
    pendingCheckoutScrollSectionRef.current = sectionId;
  }, []);

  useEffect(() => {
    const sectionId = pendingCheckoutScrollSectionRef.current;
    if (!sectionId) {
      return;
    }

    pendingCheckoutScrollSectionRef.current = null;
    scrollToCheckoutSection(sectionId);
  }, [step, scrollToCheckoutSection]);

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

  const showPaymentFailedToast = useCallback(() => {
    setPaymentFailedToastOpen(true);
  }, []);

  const dismissPaymentFailedToast = useCallback(() => {
    setPaymentFailedToastOpen(false);
  }, []);

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

    if (field === "method" && value === "cod" && !codAvailable) {
      return;
    }

    setPayment((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Only act on a definite answer. An empty payment-method list means the cart
    // has not loaded yet, and switching the customer away from COD on that would
    // undo a choice they already made.
    if (!noPaymentNeeded && paymentMethods.length > 0 && payment.method === "cod" && !codAvailable) {
      setPayment((prev) => ({ ...prev, method: "card" }));
    }
  }, [codAvailable, noPaymentNeeded, payment.method, paymentMethods.length]);

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
      replaceCheckoutSuccessUrl(input.orderNumber);
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

      let accountReady = input.wasAuthenticated;

      if (!input.wasAuthenticated && input.guestOtp) {
        const registered = await registerGuestCustomerAfterOrder(input.orderForm, input.guestOtp);

        if (registered) {
          await refreshAuth();
          setOrderSuccessAuthenticated(true);
          accountReady = true;
        }
      }

      // Just-registered guests get their first address book entries; signed-in
      // customers only when they ticked "Save this address to my profile".
      if (accountReady && (!input.wasAuthenticated || input.orderForm.saveAddressToProfile)) {
        await persistGuestCheckoutAddresses(input.orderForm);
      }
    },
    [clearCart, refreshAuth, showOrderPlacedToast],
  );

  useEffect(() => {
    if (paymentReturnHandledRef.current) {
      return;
    }

    if (paymentStatus === "failed") {
      paymentReturnHandledRef.current = true;
      const pending = readPendingCheckoutPayment();
      const failedOrderNumber = paymentOrderNumber ?? pending?.orderNumber ?? null;

      if (pending && (!paymentOrderNumber || pending.orderNumber === paymentOrderNumber)) {
        setForm(pending.form);
        setStep("payment");
      }

      clearPendingCheckoutPayment();

      if (failedOrderNumber) {
        void resetRazorpayCart(failedOrderNumber).then(() => refreshCart());
      }

      showPaymentFailedToast();
      window.history.replaceState({}, "", "/checkout");
      return;
    }

    const successOrderNumber = paymentOrderNumber ?? successOrderFromPath;
    const isSuccessLanding =
      (paymentStatus === "success" && Boolean(paymentOrderNumber)) ||
      (isSuccessRoute && Boolean(successOrderFromPath));

    if (!isSuccessLanding || !successOrderNumber) {
      return;
    }

    const pending = readPendingCheckoutPayment();
    if (!pending || pending.orderNumber !== successOrderNumber) {
      paymentReturnHandledRef.current = true;
      setPlacedOrderNumber(successOrderNumber);
      setPlacedTotal(totalPrice);
      setPlacedItems([...items]);
      setStep("success");
      clearPendingCheckoutPayment();
      replaceCheckoutSuccessUrl(successOrderNumber);
      showOrderPlacedToast(successOrderNumber);
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
  }, [
    finalizeOrderSuccess,
    isSuccessRoute,
    paymentOrderNumber,
    paymentStatus,
    refreshCart,
    showPaymentFailedToast,
    showOrderPlacedToast,
    successOrderFromPath,
    items,
    totalPrice,
  ]);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(CHECKOUT_FORM_RESUME_KEY);
    if (!saved) {
      return;
    }
    window.sessionStorage.removeItem(CHECKOUT_FORM_RESUME_KEY);
    try {
      const resumed = JSON.parse(saved) as Partial<CheckoutFormData>;
      setForm((current) => ({ ...current, ...resumed }));
    } catch {
      // Unreadable copy: start from the empty form.
    }
  }, []);

  const handleCheckoutRegistrationSessionExpired = useCallback(() => {
    closeLoginModal();
    verifiedCheckoutOtpRef.current = null;
    setPhoneVerified(false);
    setShowOtpModal(true);
    toast({
      title: "Session expired",
      description: "Please verify your contact again to continue creating your account.",
    });
  }, [closeLoginModal, toast]);

  useEffect(() => {
    registerCheckoutRegistrationSessionExpiredHandler(handleCheckoutRegistrationSessionExpired);
    return () => registerCheckoutRegistrationSessionExpiredHandler(null);
  }, [
    handleCheckoutRegistrationSessionExpired,
    registerCheckoutRegistrationSessionExpiredHandler,
  ]);

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

  const handleSelectSavedShippingAddress = useCallback(
    (addressUid: string) => {
      if (checkoutLockedRef.current) {
        return;
      }

      const selectedAddress = addresses.find((address) => address.uid === addressUid);
      if (!selectedAddress) {
        return;
      }

      setForm((current) => applyCustomerAddressToCheckoutForm(current, selectedAddress));
    },
    [addresses],
  );

  if ((isHydrating || isAuthPrefillLoading) && step !== "success" && !shouldShowSuccess) {
    return <CheckoutPageSkeleton />;
  }

  if (items.length === 0 && step !== "success" && !shouldShowSuccess) {
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
    if (checkoutLockedRef.current) {
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
    setShowOtpModal(false);

    if (result.registrationRequired) {
      // Finishing the account reloads this page; keep what the guest already typed.
      try {
        window.sessionStorage.setItem(CHECKOUT_FORM_RESUME_KEY, JSON.stringify(form));
      } catch {
        // Storage unavailable: the guest retypes the address.
      }
      openLoginModal({
        returnUrl: "/checkout",
        createAccountResume: {
          target: buildCheckoutOtpTarget(form),
          otp: result.otp,
          fullName: getCheckoutRegistrationName(form),
          countryCode: form.contactCountryCode,
          phoneDisplay: isCheckoutEmailContact(form.phoneOrEmail)
            ? undefined
            : form.phoneOrEmail.replace(/\D/g, ""),
        },
      });
      toast({
        title: "Almost there",
        description: "Enter your details to finish creating your account.",
      });
      return;
    }

    setPhoneVerified(true);

    if (result.loggedIn) {
      void refreshAuth();
      setOrderSuccessAuthenticated(true);
    }

    toast({ title: "Verified", description: "Your contact details have been verified." });
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

    formValidation.validateSubmit(() => {
      // A first address typed here becomes the customer's saved address.
      const submittedForm = {
        ...form,
        ...(isAuthenticated && !hasDeliveryAddressAvailable ? { saveAddressToProfile: true } : {}),
      };
      const contactIsEmail = isCheckoutEmailContact(submittedForm.phoneOrEmail);

      // Guests prove they own the contact they typed — SMS OTP for a number,
      // email OTP for an address — before the order is placed under it.
      const contactOtpEnabled = contactIsEmail ? emailOtpLoginEnabled : otpLoginEnabled;
      if (contactOtpEnabled && !isAuthenticated && !phoneVerified) {
        setShowOtpModal(true);
        toast({
          title: "Verification required",
          description: contactIsEmail
            ? "Please verify your email address before continuing."
            : "Please verify your phone number before continuing.",
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
              savedAddresses: addresses,
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

    // Nothing to validate when no payment is taken (the options are hidden).
    const validatePayment = noPaymentNeeded
      ? (onValid: () => void) => onValid()
      : paymentValidation.validateSubmit;

    validatePayment(() => {
      const submittedForm = { ...form };
      const submittedPayment = { ...payment };
      const submittedItems = [...items];
      const submittedTotal = totalPrice;

      checkoutLockedRef.current = true;
      paymentInFlightRef.current = true;
      setSubmitting(true);
      // The message from an earlier failed attempt stayed on screen through the
      // next one, so a successful retry still read "Payment failed" (QA bug #31).
      dismissPaymentFailedToast();

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
                showPaymentFailedToast();
                return;
              }

              outcome = {
                status: "paid",
                paymentId: paidPending.paymentId,
                signature: paidPending.signature,
              };
            }

            // Magento confirm already started in the Razorpay handler. Waiting
            // here kept the checkout form on screen after payment succeeded.
            setPlacedItems([...submittedItems]);
            setPlacedTotal(submittedTotal);
            setPlacedOrderNumber(order.orderNumber);
            setForm(submittedForm);
            setStep("success");

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
          : noPaymentNeeded
            ? "PLACE ORDER"
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
      setForm((current) => ({
        ...current,
        [field]: sanitizePincodeInput(String(value)),
        ...(CHECKOUT_SHIPPING_ADDRESS_FIELDS.includes(field)
          ? { selectedShippingAddressUid: null }
          : {}),
      }));
      return;
    }

    if (field === "shippingPhone" || field === "billingPhone") {
      setForm((current) => {
        const countryCode =
          field === "shippingPhone" ? current.shippingCountryCode : current.billingCountryCode;
        return {
          ...current,
          [field]: sanitizePhoneInput(String(value), countryCode),
          ...(CHECKOUT_SHIPPING_ADDRESS_FIELDS.includes(field)
            ? { selectedShippingAddressUid: null }
            : {}),
        };
      });
      return;
    }

    if (
      field === "shippingCountryCode" ||
      field === "billingCountryCode" ||
      field === "contactCountryCode"
    ) {
      const phoneField =
        field === "shippingCountryCode"
          ? "shippingPhone"
          : field === "billingCountryCode"
            ? "billingPhone"
            : "phoneOrEmail";
      setForm((current) => {
        const nextCode = String(value);
        const phoneValue = current[phoneField];
        const shouldResanitizePhone =
          phoneField !== "phoneOrEmail" || !isCheckoutEmailContact(String(phoneValue));

        return {
          ...current,
          [field]: nextCode,
          ...(shouldResanitizePhone
            ? { [phoneField]: sanitizePhoneInput(String(phoneValue), nextCode) }
            : {}),
          ...(field === "shippingCountryCode"
            ? { selectedShippingAddressUid: null }
            : {}),
        };
      });
      if (field === "contactCountryCode" && phoneVerified) {
        setPhoneVerified(false);
        verifiedCheckoutOtpRef.current = null;
      }
      return;
    }

    if (field === "phoneOrEmail") {
      const nextValue = String(value);

      if (contactEmailOnly || isCheckoutEmailContact(nextValue)) {
        setPhoneVerified(false);
        verifiedCheckoutOtpRef.current = null;
        lastCheckedGuestEmailRef.current = "";
        updateForm(field, nextValue);
        return;
      }

      updateForm(field, sanitizePhoneInput(nextValue, form.contactCountryCode || "+91"));
      if (phoneVerified) {
        setPhoneVerified(false);
        verifiedCheckoutOtpRef.current = null;
      }
      return;
    }

    setForm((current) => {
      const next: CheckoutFormData = {
        ...current,
        [field]: value as CheckoutFormData[typeof field],
      };

      if (CHECKOUT_SHIPPING_ADDRESS_FIELDS.includes(field)) {
        next.selectedShippingAddressUid = null;
      }

      return next;
    });
  };

  return (
    <section
      className={cn(
        "bg-gray300 lg:pb-104",
        "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
        "pb-16",
      )}
    >
      <div className="mx-auto w-full px-4 pt-6 md:pt-10 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
        <CheckoutPaymentFailedToast
          open={paymentFailedToastOpen}
          onDismiss={dismissPaymentFailedToast}
          className="mb-6"
        />
        <h1 className="mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl md:text-4xl">
          Complete Checkout
        </h1>

        <div
          className={cn(cartCheckoutAsideLayout.gridClassName)}
        >
          <div className={cn("flex min-w-0 flex-col", step === "payment" ? "gap-[33px]" : "gap-6")}>
            {step === "form" ? (
              <CheckoutFormStep
                form={form}
                onChange={handleFormChange}
                phoneVerified={phoneVerified}
                onVerifyPhone={handleVerifyPhone}
                showVerify={
                  isCheckoutEmailContact(form.phoneOrEmail) ? emailOtpLoginEnabled : otpLoginEnabled
                }
                emailOnly={contactEmailOnly}
                contactCountryCodes={otpCountryCodes}
                onContactBlur={handleGuestContactBlur}
                validation={formValidation}
                isAuthenticated={isAuthenticated}
                savedAddresses={addresses}
                onSelectSavedShippingAddress={handleSelectSavedShippingAddress}
                // Saved addresses still loading: typing now would be overwritten by the prefill.
                fieldsDisabled={isSavingAddresses || (isAuthenticated && addressesLoading)}
                contactVerified={
                  isAuthenticated &&
                  (isCheckoutEmailContact(form.phoneOrEmail)
                    ? customer?.emailVerified === true &&
                      form.phoneOrEmail.trim().toLowerCase() === customer.email.toLowerCase()
                    : customer?.phoneVerified === true)
                }
                // The mobile number is this customer's identity, so the email is theirs to
                // change for this order. Signed up by email: the email is the identity and
                // stays as it is (QA bug #28, decision of 4 Oct).
                contactEmailEditable={customer?.phoneVerified === true}
              />
            ) : (
              <CheckoutPaymentStep
                form={form}
                payment={payment}
                hasEngravedItems={hasEngravedItems}
                codOffered={codAvailable}
                noPaymentNeeded={noPaymentNeeded}
                onPaymentChange={updatePayment}
                onEditPersonal={() => {
                  if (checkoutLockedRef.current || paymentInFlightRef.current) return;
                  requestCheckoutSectionScroll("checkout-personal-information");
                  setStep("form");
                }}
                onEditDelivery={() => {
                  if (checkoutLockedRef.current || paymentInFlightRef.current) return;
                  requestCheckoutSectionScroll("checkout-delivery-address");
                  setStep("form");
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

      {otpLoginEnabled || emailOtpLoginEnabled ? (
        <CheckoutOtpModal
          open={showOtpModal}
          phone={form.phoneOrEmail}
          countryCode={form.contactCountryCode || "+91"}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleOtpVerified}
        />
      ) : null}
      {checkoutStatusToast}
    </section>
  );
};

export default CheckoutPage;
