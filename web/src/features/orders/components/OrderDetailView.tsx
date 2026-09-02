"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { CartMetaRow, CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { formatOrderDate, formatOrderTotal, formatAddressLines } from "@/features/account/utils/formatAccountData";
import { buildOrderDeliveryTimelineFromStatus } from "@/features/account/utils/orderDeliveryTimeline.utils";
import { ProfileOrderTimeline } from "@/features/account/components/ProfileOrderTimeline";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";
import type { TrackedOrder, TrackedOrderItem } from "@/services/customer/order-tracking.types";
import {
  formatTrackedOrderStatus,
  getTrackedOrderStatusMessage,
} from "@/features/order-tracking/utils/orderStatus";

function OrderItemOptions({ item }: { item: TrackedOrderItem }) {
  const options = [...item.selectedOptions, ...item.enteredOptions];

  if (options.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1">
      {options.map((option) => (
        <li
          key={`${option.label}-${option.value}`}
          className="font-gill text-sm font-light leading-110 text-neutral500"
        >
          {option.label}: {option.value}
        </li>
      ))}
    </ul>
  );
}

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: NonNullable<TrackedOrder["shippingAddress"]>;
}) {
  return (
    <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
      <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">{title}</h3>
      <p className="font-gill text-base font-normal leading-110 text-darkblack">{address.fullName}</p>
      <p className="mt-2 font-gill text-sm font-light leading-110 text-neutral500">
        {formatAddressLines(address.streetLines)}
        <br />
        {address.city}
        {address.region ? `, ${address.region}` : ""} {address.pincode}
        <br />
        {address.phone}
      </p>
    </div>
  );
}

type OrderDetailViewProps = {
  order: TrackedOrder;
  showBackLink?: boolean;
  backHref?: string;
  backLabel?: string;
};

const OrderDetailView = ({
  order,
  showBackLink = false,
  backHref = "/profile?section=orders",
  backLabel = "Back to My Orders",
}: OrderDetailViewProps) => {
  const deliveryTimeline = buildOrderDeliveryTimelineFromStatus(order.status);

  return (
  <div className="space-y-6">
    {showBackLink ? (
      <Link
        href={backHref}
        className="inline-flex font-gill text-sm font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
      >
        ← {backLabel}
      </Link>
    ) : null}

    <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
          Order #{order.number}
        </h2>
        <CartMetaRow
          parts={[formatOrderDate(order.orderDate), formatTrackedOrderStatus(order.status)]}
        />
        <p className="font-gill text-sm font-light leading-110 text-neutral500">
          {getTrackedOrderStatusMessage(order.status)}
        </p>
      </div>

      {deliveryTimeline.length > 0 ? (
        <ProfileOrderTimeline steps={deliveryTimeline} className="border border-neutral300" />
      ) : null}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="font-gill text-sm font-normal leading-110 text-neutral500">Order total</p>
          <p className="font-gill text-base font-normal leading-110 text-darkblack">
            {formatOrderTotal(order.totals.grandTotal, order.totals.currency)}
          </p>
        </div>
        {order.shippingMethod ? (
          <div className="space-y-2">
            <p className="font-gill text-sm font-normal leading-110 text-neutral500">Shipping</p>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {order.shippingMethod}
            </p>
          </div>
        ) : null}
        {order.paymentMethods[0] ? (
          <div className="space-y-2">
            <p className="font-gill text-sm font-normal leading-110 text-neutral500">Payment</p>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {order.paymentMethods[0].name}
            </p>
          </div>
        ) : null}
      </div>
    </div>

    <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
      <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">Items</h3>
      <ul className="space-y-5">
        {order.items.map((item, index) => (
          <li
            key={`${order.id}-${item.productSku ?? index}`}
            className="border-b border-neutral300 pb-5 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-gill text-base font-normal leading-110 text-darkblack",
                    productNameDisplayClassName,
                  )}
                >
                  {item.productUrlKey ? (
                    <Link href={`/product/${item.productUrlKey}`} className="hover:underline">
                      {item.productName}
                    </Link>
                  ) : (
                    item.productName
                  )}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                </p>
                {item.productSku ? (
                  <p className="mt-1 font-gill text-xs font-light leading-110 text-neutral500">
                    SKU: {item.productSku}
                  </p>
                ) : null}
                <OrderItemOptions item={item} />
              </div>
              <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
                {formatCartPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
      <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">Price Details</h3>
      <dl className="space-y-3 font-gill text-sm leading-110">
        <div className="flex justify-between gap-4 text-neutral500">
          <dt>Subtotal</dt>
          <dd className="text-darkblack">
            {formatOrderTotal(order.totals.subtotalInclTax, order.totals.currency)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-neutral500">
          <dt>Shipping</dt>
          <dd className="text-darkblack">
            {order.totals.totalShipping === 0
              ? "Free"
              : formatOrderTotal(order.totals.totalShipping, order.totals.currency)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-neutral500">
          <dt>Tax</dt>
          <dd className="text-darkblack">
            {formatOrderTotal(order.totals.totalTax, order.totals.currency)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-neutral300 pt-3 text-base text-darkblack">
          <dt className="font-normal">Total</dt>
          <dd className="font-normal">
            {formatOrderTotal(order.totals.grandTotal, order.totals.currency)}
          </dd>
        </div>
      </dl>
    </div>

    {order.shipments.length > 0 ? (
      <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
        <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">
          Shipment Updates
        </h3>
        <ul className="space-y-4">
          {order.shipments.map((shipment) => (
            <li key={shipment.number} className="rounded-sm bg-gray200/50 p-4">
              <p className="font-gill text-base font-normal leading-110 text-darkblack">
                Shipment #{shipment.number}
              </p>
              {shipment.tracking.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {shipment.tracking.map((tracking) => (
                    <li
                      key={`${shipment.number}-${tracking.number}-${tracking.title}`}
                      className="font-gill text-sm font-light leading-110 text-neutral500"
                    >
                      {tracking.title}
                      {tracking.carrier ? ` · ${tracking.carrier}` : ""}
                      {tracking.number ? ` · ${tracking.number}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 font-gill text-sm font-light leading-110 text-neutral500">
                  Tracking details will appear here once available.
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    ) : null}

    {order.shippingAddress ? <AddressBlock title="Delivery Address" address={order.shippingAddress} /> : null}

    {order.billingAddress ? <AddressBlock title="Billing Address" address={order.billingAddress} /> : null}

    {order.comments.length > 0 ? (
      <div className="rounded-sm border border-neutral300 bg-white p-6 md:p-8">
        <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">Order Notes</h3>
        <ul className="space-y-3">
          {order.comments.map((comment, index) => (
            <li
              key={`${comment.timestamp ?? index}-${comment.message.slice(0, 24)}`}
              className="rounded-sm bg-gray200/50 p-4 font-gill text-sm font-light leading-110 text-neutral500 whitespace-pre-wrap"
            >
              {comment.message}
            </li>
          ))}
        </ul>
      </div>
    ) : null}

    <div className="flex justify-center">
      <CartPrimaryLink href="/jewellery" className="w-full max-w-xs">
        Continue Shopping
      </CartPrimaryLink>
    </div>
  </div>
  );
};

export default OrderDetailView;
