"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import OrderDetailView from "@/features/orders/components/OrderDetailView";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import ProfileAuthGate from "@/features/account/components/ProfileAuthGate";

const ProfileOrderDetailPage = () => {
  const params = useParams<{ orderNumber: string }>();
  const { customer } = useAuth();
  const orderNumber = decodeURIComponent(params?.orderNumber ?? "").trim();

  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber || !customer) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await trackOrder(orderNumber, undefined, controller.signal);
        if (!cancelled) {
          setOrder(result);
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load order details");
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [customer, orderNumber]);

  return (
    <ProfileAuthGate>
      <section className="bg-gray200 pb-16 pt-6 md:pb-20 md:pt-10">
        <PageContainer>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h1 className="font-larken text-32 font-light leading-110 text-darkblack md:text-40">
                Order Details
              </h1>
              {orderNumber ? (
                <p className="font-gill text-base font-light leading-110 text-neutral500">
                  Order #{orderNumber}
                </p>
              ) : null}
            </div>

            {isLoading ? (
              <div
                className="h-56 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
                aria-busy="true"
                aria-label="Loading order details"
              />
            ) : null}

            {error ? (
              <div className="space-y-4 rounded-sm border border-dashed border-neutral300 bg-white p-6">
                <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
                  {error}
                </p>
                <CartPrimaryLink href="/profile?section=orders" className="w-full max-w-xs">
                  Back to My Orders
                </CartPrimaryLink>
              </div>
            ) : null}

            {order ? (
              <OrderDetailView
                order={order}
                showBackLink
                backHref="/profile?section=orders"
                backLabel="Back to My Orders"
              />
            ) : null}

            {!isLoading && !order && !error && !orderNumber ? (
              <CartPrimaryLink href="/profile?section=orders" className="w-full max-w-xs">
                Back to My Orders
              </CartPrimaryLink>
            ) : null}
          </div>
        </PageContainer>
      </section>
    </ProfileAuthGate>
  );
};

export default ProfileOrderDetailPage;
