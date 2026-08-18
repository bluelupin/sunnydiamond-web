"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import { profileTabsContent } from "../data/profileContent";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import type {
  OrderFilterEmptyStateKey,
  OrderFilterKey,
  ProfileOrderUi,
} from "../types/profileUi.types";
import { formatOrderStatusLabel } from "../utils/orderDeliveryTimeline.utils";
import { categorizeOrder, mapCustomerOrderToProfileUi } from "../utils/profileDisplayMappers";
import { PROFILE_ORDER_QUERY_PARAM } from "../utils/profileOrderNavigation";
import { ProfileOrderCard } from "./ProfileOrderCard";
import { ProfileOrderDetailPanel } from "./ProfileOrderDetailPanel";
import { ProfileOrdersEmptyState } from "./ProfileOrdersEmptyState";
import { ProfileFilterChips } from "./profileUi";
import { ProfileOrderCardSkeleton } from "./ProfileOrderCardSkeleton";
import { ProfileOrdersListingSkeleton } from "./ProfileOrdersListingSkeleton";

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

type ProfileOrderOverride = Pick<
  ProfileOrderUi,
  "status" | "statusLabel" | "category" | "subState" | "showTrack" | "showCancel" | "showReturn"
>;

/** Patch applied over the list mapping so a cancelled/returned order changes tab at once. */
function buildOrderOverride(order: TrackedOrder): ProfileOrderOverride {
  const { category, subState } = categorizeOrder(order.sunnyStatus, order.status);
  const actions = order.sunnyActions;

  return {
    status: order.status,
    statusLabel: formatOrderStatusLabel(order.status),
    category,
    subState,
    showTrack: actions ? actions.canTrack : false,
    showCancel: actions ? actions.canCancel : false,
    showReturn: actions ? actions.canReturn : false,
  };
}

const ProfileOrdersSection = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();
  const selectedOrderNumber = searchParams?.get(PROFILE_ORDER_QUERY_PARAM)?.trim() ?? "";
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isLoadingMore, error, hasMore, loadMore, refresh } =
    useCustomerOrders(true);
  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>("in_progress");
  const [resolvedStatuses, setResolvedStatuses] = useState<Record<string, string>>({});
  const [orderOverrides, setOrderOverrides] = useState<Record<string, ProfileOrderOverride>>({});

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
    () =>
      (data?.orders ?? []).map((order) => {
        const mapped = mapCustomerOrderToProfileUi(order);
        const override = orderOverrides[order.id];

        // Once a refetch reports the mutated status, the mapped order is authoritative again.
        return override && override.status !== order.status ? { ...mapped, ...override } : mapped;
      }),
    [data, orderOverrides],
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

  const handleOrderChanged = useCallback(
    (freshOrder: TrackedOrder) => {
      setOrderOverrides((current) => ({
        ...current,
        [freshOrder.id]: buildOrderOverride(freshOrder),
      }));
      refresh();
    },
    [refresh],
  );

  // Only the first load blanks the section. A post-mutation `refresh()` keeps the current
  // tree mounted, so the open detail panel (and its success dialog) survives the refetch.
  if (isLoading && !data) {
    return <ProfileOrdersListingSkeleton />;
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
        onOrderChanged={handleOrderChanged}
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
                onOrderChanged={handleOrderChanged}
              />
            </li>
          ))}
        </ul>
      )}

      {hasMore ? <div ref={loadMoreRef} className="h-px w-full shrink-0" aria-hidden /> : null}

      {isLoadingMore ? (
        <ProfileOrderCardSkeleton />
      ) : null}
    </div>
  );
};

export default ProfileOrdersSection;
