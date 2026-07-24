"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  CartOutlineButton,
  CartPrimaryButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { CheckoutField } from "@/features/checkout/components/CheckoutUi";
import OrderDetailView from "@/features/orders/components/OrderDetailView";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import PageContainer from "@/shared/ui/layout/PageContainer";

type TrackingFormState = {
  number: string;
  email: string;
  lastname: string;
};

const OrderTrackingPage = () => {
  const searchParams = useSearchParams();
  const { status, customer } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(customer);

  const initialOrderNumber = searchParams?.get("order")?.trim() ?? "";

  const [form, setForm] = useState<TrackingFormState>({
    number: initialOrderNumber,
    email: "",
    lastname: "",
  });
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresGuestDetails, setRequiresGuestDetails] = useState(false);
  const [autoLookupAttempted, setAutoLookupAttempted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !customer) {
      return;
    }

    setForm((current) => ({
      ...current,
      email: current.email || customer.email,
      lastname: current.lastname || customer.lastname,
    }));
  }, [customer, isAuthenticated]);

  const runLookup = useCallback(
    async (input: TrackingFormState, guestFallback = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await trackOrder(
          input.number,
          guestFallback || !isAuthenticated
            ? { email: input.email, lastname: input.lastname }
            : undefined,
        );
        setOrder(result);
        setRequiresGuestDetails(false);
      } catch (lookupError) {
        const message =
          lookupError instanceof Error ? lookupError.message : "Unable to track this order.";

        if (isAuthenticated && !guestFallback && message.includes("email and last name")) {
          setRequiresGuestDetails(true);
          setError("We couldn't find this order in your account. Confirm the checkout email and last name below.");
        } else {
          setError(message);
        }

        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    if (!initialOrderNumber || autoLookupAttempted || status === "loading") {
      return;
    }

    setAutoLookupAttempted(true);

    if (isAuthenticated) {
      void runLookup(
        {
          number: initialOrderNumber,
          email: customer?.email ?? "",
          lastname: customer?.lastname ?? "",
        },
        false,
      );
      return;
    }

    setForm((current) => ({
      ...current,
      number: initialOrderNumber,
    }));
  }, [
    autoLookupAttempted,
    customer?.email,
    customer?.lastname,
    initialOrderNumber,
    isAuthenticated,
    runLookup,
    status,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.number.trim()) {
      setError("Please enter your order number.");
      return;
    }

    if ((!isAuthenticated || requiresGuestDetails) && (!form.email.trim() || !form.lastname.trim())) {
      setError("Email and last name are required to track this order.");
      return;
    }

    void runLookup(form, !isAuthenticated || requiresGuestDetails);
  };

  return (
    <section className="bg-gray200 pb-16 pt-6 md:pb-20 md:pt-10">
      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="font-larken text-32 font-light leading-110 text-darkblack md:text-40">
              Order Tracking
            </h1>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {isAuthenticated
                ? "Look up an order from your account, or verify guest checkout details if needed."
                : "Enter your order number and checkout details to see the latest status."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-sm border border-neutral300 bg-white p-6 md:p-8"
          >
            <CheckoutField
              id="track-order-number"
              label="Order Number"
              value={form.number}
              onChange={(value) => setForm((current) => ({ ...current, number: value }))}
              placeholder="e.g. 000000123"
            />

            {(!isAuthenticated || requiresGuestDetails) && (
              <>
                <CheckoutField
                  id="track-order-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                />
                <CheckoutField
                  id="track-order-lastname"
                  label="Last Name"
                  value={form.lastname}
                  onChange={(value) => setForm((current) => ({ ...current, lastname: value }))}
                  placeholder="As used during checkout"
                />
              </>
            )}

            {error ? (
              <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <CartPrimaryButton type="submit" className="sm:max-w-xs" disabled={isLoading}>
                {isLoading ? "Looking up..." : "Track Order"}
              </CartPrimaryButton>
              {order ? (
                <CartOutlineButton
                  type="button"
                  className="sm:max-w-xs"
                  onClick={() => {
                    setOrder(null);
                    setError(null);
                  }}
                >
                  Look Up Another
                </CartOutlineButton>
              ) : null}
            </div>
          </form>

          {isLoading && !order ? (
            <div
              className="h-48 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
              aria-busy="true"
              aria-label="Loading order details"
            />
          ) : null}

          {order ? <OrderDetailView order={order} /> : null}

          {isAuthenticated && order ? (
            <div className="flex justify-center">
              <CartPrimaryLink
                href={`/profile/orders/${encodeURIComponent(order.number)}`}
                className="w-full max-w-xs"
              >
                View Full Order Details
              </CartPrimaryLink>
            </div>
          ) : null}

          {isAuthenticated ? (
            <div className="flex justify-center">
              <CartPrimaryLink href="/profile?section=orders" className="w-full max-w-xs">
                View All My Orders
              </CartPrimaryLink>
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
};

export default OrderTrackingPage;
