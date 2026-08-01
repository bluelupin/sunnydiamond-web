"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { profileTabsContent } from "../data/profileContent";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import type { OrderFilterEmptyStateKey, OrderFilterKey } from "../types/profileUi.types";
import { mapCustomerOrderToProfileUi } from "../utils/profileDisplayMappers";
import { PROFILE_ORDER_QUERY_PARAM } from "../utils/profileOrderNavigation";
import { ProfileOrderCard } from "./ProfileOrderCard";
import { ProfileOrderDetailPanel } from "./ProfileOrderDetailPanel";
import { ProfileOrdersEmptyState } from "./ProfileOrdersEmptyState";
import { ProfileFilterChips } from "./profileUi";

const content = profileTabsContent.orders;

const FILTER_OPTIONS: { key: OrderFilterKey; label: string }[] = [
  { key: "in_progress", label: content.filters.inProgress },
  { key: "delivered", label: content.filters.delivered },
  { key: "cancelled", label: content.filters.cancelled },
  { key: "returned", label: content.filters.returned },
];

const FILTER_EMPTY_UI_KEYS: readonly OrderFilterEmptyStateKey[] = [
  "delivered",
  "cancelled",
  "returned",
];

function isOrderFilterEmptyStateKey(
  filter: OrderFilterKey,
): filter is OrderFilterEmptyStateKey {
  return (FILTER_EMPTY_UI_KEYS as readonly string[]).includes(filter);
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading orders">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="h-48 animate-pulse bg-gray300 p-6" />
      ))}
    </div>
  );
}

const ProfileOrdersSection = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();
  const selectedOrderNumber = searchParams?.get(PROFILE_ORDER_QUERY_PARAM)?.trim() ?? "";
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isLoadingMore, error, hasMore, loadMore } = useCustomerOrders(true);
  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>("in_progress");
  const [resolvedStatuses, setResolvedStatuses] = useState<Record<string, string>>({});

  const openOrderDetail = useCallback(
    (orderNumber: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("section", "orders");
      params.set(PROFILE_ORDER_QUERY_PARAM, orderNumber.trim());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const closeOrderDetail = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete(PROFILE_ORDER_QUERY_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!selectedOrderNumber) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedOrderNumber]);

  const orders = useMemo(
    () => (data?.orders ?? []).map(mapCustomerOrderToProfileUi),
    [data],
  );

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.category === activeFilter),
    [orders, activeFilter],
  );

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, loadMore, filteredOrders.length]);

  const handleTrackedStatusChange = useCallback((orderId: string, status: string) => {
    setResolvedStatuses((current) => {
      if (current[orderId] === status) {
        return current;
      }

      return {
        ...current,
        [orderId]: status,
      };
    });
  }, []);

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!data || data.orders.length === 0) {
    return <ProfileOrdersEmptyState />;
  }

  if (selectedOrderNumber) {
    const selectedOrder = orders.find((order) => order.number === selectedOrderNumber);

    return (
      <ProfileOrderDetailPanel
        orderNumber={selectedOrderNumber}
        onBack={closeOrderDetail}
        onTrackedStatusChange={
          selectedOrder
            ? (status) => handleTrackedStatusChange(selectedOrder.id, status)
            : undefined
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
          {content.filterLabel}
        </p>
        <ProfileFilterChips
          options={FILTER_OPTIONS}
          activeKey={activeFilter}
          onChange={setActiveFilter}
          scrollOnMobile
        />
      </div>

      {filteredOrders.length === 0 ? (
        isOrderFilterEmptyStateKey(activeFilter) ? (
          <ProfileOrdersEmptyState
            title={content.emptyFilterStates[activeFilter].title}
            descriptionPrimary={content.emptyFilterStates[activeFilter].descriptionPrimary}
            descriptionSecondary={content.emptyFilterStates[activeFilter].descriptionSecondary}
          />
        ) : (
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            {content.emptyFilterMessage}
          </p>
        )
      ) : (
        <ul className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <ProfileOrderCard
                order={order}
                onViewDetails={openOrderDetail}
                resolvedStatus={resolvedStatuses[order.id]}
              />
            </li>
          ))}
        </ul>
      )}

      {hasMore ? <div ref={loadMoreRef} className="h-px w-full shrink-0" aria-hidden /> : null}

      {isLoadingMore ? (
        <div className="h-12 animate-pulse bg-gray300" aria-busy="true" aria-label="Loading more orders" />
      ) : null}
    </div>
  );
};

export default ProfileOrdersSection;
