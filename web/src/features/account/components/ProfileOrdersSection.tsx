"use client";

import { useMemo, useState } from "react";
import {
  CartOutlineButton,
} from "@/features/cart/components/CartFlowUi";
import { profileTabsContent } from "../data/profileContent";
import {
  getMockOrdersByFilter,
  PROFILE_PREVIEW_MOCK_WHEN_EMPTY,
} from "../data/profileMockData";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import type { OrderFilterKey } from "../types/profileUi.types";
import {
  categorizeOrderStatus,
  mapCustomerOrderToProfileUi,
} from "../utils/profileDisplayMappers";
import { ProfileOrderCard } from "./ProfileOrderCard";
import { ProfileOrdersEmptyState } from "./ProfileOrdersEmptyState";
import { ProfileFilterChips } from "./profileUi";

const content = profileTabsContent.orders;

const FILTER_OPTIONS: { key: OrderFilterKey; label: string }[] = [
  { key: "in_progress", label: content.filters.inProgress },
  { key: "delivered", label: content.filters.delivered },
  { key: "cancelled", label: content.filters.cancelled },
  { key: "returned", label: content.filters.returned },
];

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
  const { data, isLoading, error, page, setPage } = useCustomerOrders(true);
  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>("in_progress");

  const orders = useMemo(() => {
    if (data && data.orders.length > 0) {
      return data.orders.map(mapCustomerOrderToProfileUi);
    }

    if (PROFILE_PREVIEW_MOCK_WHEN_EMPTY) {
      return getMockOrdersByFilter(activeFilter);
    }

    return [];
  }, [data, activeFilter]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.category === activeFilter),
    [orders, activeFilter],
  );

  const usingMockData =
    PROFILE_PREVIEW_MOCK_WHEN_EMPTY && (!data || data.orders.length === 0);

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

  if (!usingMockData && (!data || data.orders.length === 0)) {
    return <ProfileOrdersEmptyState />;
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
        <p className="font-gill text-base font-light leading-110 text-neutral500">
          {content.emptyFilterMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <ProfileOrderCard order={order} />
            </li>
          ))}
        </ul>
      )}

      {!usingMockData && data && data.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 pt-2">
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </CartOutlineButton>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            Page {data.currentPage} of {data.totalPages}
          </p>
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </CartOutlineButton>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileOrdersSection;
