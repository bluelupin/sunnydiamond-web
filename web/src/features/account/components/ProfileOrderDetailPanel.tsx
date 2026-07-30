"use client";

import { useEffect, useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import { mapTrackedOrderToProfileDetailUi } from "../utils/orderDetailDisplay.mapper";
import { ProfileOrderDetailView } from "./ProfileOrderDetailView";

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
};

export function ProfileOrderDetailPanel({ orderNumber, onBack }: ProfileOrderDetailPanelProps) {
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
        <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
          {error}
        </p>
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

  return <ProfileOrderDetailView order={orderDetail} onBack={onBack} />;
}
