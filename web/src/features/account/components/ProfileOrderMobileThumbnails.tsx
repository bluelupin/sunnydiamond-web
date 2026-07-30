"use client";

import Image from "next/image";
import Link from "next/link";
import { profileTabsContent } from "../data/profileContent";
import { formatOrderDate } from "../utils/formatAccountData";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileOrderItemBadge } from "./profileUi";

export function ProfileOrderMobileThumbnails({ items }: { items: ProfileOrderItemUi[] }) {
  const thumbnails = items.slice(0, 3);

  return (
    <div className="flex gap-2 lg:hidden">
      {thumbnails.map((item) => (
        <div key={item.id} className="relative size-[100px] shrink-0 overflow-hidden bg-neutral300">
          {item.isGift ? <ProfileOrderItemBadge label="Gift" /> : null}
          {item.productUrlKey ? (
            <Link href={`/product/${item.productUrlKey}`} className="block size-full">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="100px"
              />
            </Link>
          ) : (
            <Image
              src={item.imageSrc}
              alt={item.name}
              fill
              className="object-cover"
              sizes="100px"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function getOrderMobileSubtext(order: {
  category: string;
  estimatedDeliveryValue?: string;
  deliveryBy?: string;
}): string | null {
  const content = profileTabsContent.orders.mobileMeta;

  if (order.category === "in_progress" && order.estimatedDeliveryValue) {
    return `${content.estimatedDelivery} ${order.estimatedDeliveryValue}`;
  }

  if (order.category === "delivered" && order.deliveryBy) {
    return `${content.deliveredOn} ${formatOrderDate(order.deliveryBy)}`;
  }

  if (order.category === "returned") {
    return `${content.refundTimeline} ${content.refundTimelineValue}`;
  }

  if (order.category === "cancelled" && order.deliveryBy) {
    return `${content.deliveredOn} ${formatOrderDate(order.deliveryBy)}`;
  }

  return null;
}
