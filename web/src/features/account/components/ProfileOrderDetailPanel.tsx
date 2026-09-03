"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import { mapTrackedOrderToProfileDetailUi } from "../utils/orderDetailDisplay.mapper";
import { ProfileOrderDetailView } from "./ProfileOrderDetailView";
import FormFieldError from "@/shared/ui/FormFieldError";

function listingImageUrl(image: string | StaticImageData): string {
  return typeof image === "string" ? image : image.src;
}

function OrderDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading order details">
      <div className="h-10 w-64 animate-pulse bg-gray300" />
      <div className="h-96 animate-pulse bg-gray300" />
    </div>
  );
}

type ProfileOrderDetailPanelProps = {
  orderNumber: string;
  onBack: () => void;
  onTrackedStatusChange?: (status: string) => void;
  onOrderChanged?: (order: TrackedOrder) => void;
};

export function ProfileOrderDetailPanel({
  orderNumber,
  onBack,
  onTrackedStatusChange,
  onOrderChanged,
}: ProfileOrderDetailPanelProps) {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);
      setOrder(null);

      try {
        const result = await trackOrder(orderNumber, undefined, controller.signal);
        if (!cancelled) {
          setOrder(result);
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load order details");
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
  }, [orderNumber]);

  const onTrackedStatusChangeRef = useRef(onTrackedStatusChange);
  onTrackedStatusChangeRef.current = onTrackedStatusChange;

  useEffect(() => {
    if (!order?.status) {
      return;
    }

    onTrackedStatusChangeRef.current?.(order.status);
  }, [order?.status]);

  const orderSkus = useMemo(
    () =>
      (order?.items ?? [])
        .map((item) => item.productSku?.trim() ?? "")
        .filter(Boolean),
    [order],
  );

  const { products: magentoProducts } = useMagentoWishlistProducts(orderSkus);

  const imageBySku = useMemo(() => {
    const images: Record<string, string> = {};

    for (const product of magentoProducts) {
      const sku = product.sku?.trim();
      if (!sku) {
        continue;
      }

      images[sku] = listingImageUrl(product.primaryImage);
    }

    return images;
  }, [magentoProducts]);

  const orderDetail = useMemo(
    () => (order ? mapTrackedOrderToProfileDetailUi(order, imageBySku) : null),
    [order, imageBySku],
  );

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <FormFieldError message={error} />
        <button
          type="button"
          onClick={onBack}
          className="font-gill text-sm font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!orderDetail) {
    return null;
  }

  // The mutation response is the freshest state there is — no refetch needed here.
  const handleOrderChanged = (freshOrder: TrackedOrder) => {
    setOrder(freshOrder);
    onOrderChanged?.(freshOrder);
  };

  return (
    <ProfileOrderDetailView
      order={orderDetail}
      onBack={onBack}
      onOrderChanged={handleOrderChanged}
    />
  );
}
