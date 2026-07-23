"use client";

import Link from "next/link";
import {
  CartMetaRow,
  CartOutlineButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import {
  formatOrderDate,
  formatOrderStatus,
  formatOrderTotal,
} from "../utils/formatAccountData";

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading orders">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
        />
      ))}
    </div>
  );
}

const ProfileOrdersSection = () => {
  const { data, isLoading, error, page, setPage } = useCustomerOrders(true);

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
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-dashed border-neutral300 bg-gray200/60 p-6">
        <div className="space-y-2">
          <p className="font-gill text-base font-normal leading-110 text-darkblack">
            No orders to show yet
          </p>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            When you place an order while signed in, it will appear here. You can also track an order
            using your order number.
          </p>
        </div>
        <CartPrimaryLink href="/order-tracking" className="w-full max-w-xs">
          Track an Order
        </CartPrimaryLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {data.orders.map((order) => {
          const itemSummary = order.items
            .slice(0, 2)
            .map((item) => item.productName)
            .join(", ");
          const remainingItems = Math.max(0, order.items.length - 2);

          return (
            <li
              key={order.id}
              className="rounded-sm border border-neutral300 bg-gray200/40 p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <p className="font-gill text-base font-normal leading-110 text-darkblack">
                      Order #{order.number}
                    </p>
                    <CartMetaRow
                      parts={[
                        formatOrderDate(order.orderDate),
                        formatOrderStatus(order.status),
                      ]}
                    />
                  </div>

                  {itemSummary ? (
                    <p className="font-gill text-sm font-light leading-110 text-neutral500">
                      {itemSummary}
                      {remainingItems > 0 ? ` +${remainingItems} more` : ""}
                    </p>
                  ) : null}

                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={`${order.id}-${item.productSku ?? index}`}
                        className="flex items-start justify-between gap-4 font-gill text-sm font-light leading-110 text-darkblack"
                      >
                        <span className="min-w-0">
                          {item.productUrlKey ? (
                            <Link
                              href={`/product/${item.productUrlKey}`}
                              className="underline-offset-2 hover:underline"
                            >
                              {item.productName}
                            </Link>
                          ) : (
                            item.productName
                          )}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {formatOrderTotal(order.grandTotal, order.currency)}
                  </p>
                  <CartPrimaryLink href="/order-tracking" className="w-full min-w-[180px] md:w-auto">
                    Track Order
                  </CartPrimaryLink>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.totalPages > 1 ? (
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
