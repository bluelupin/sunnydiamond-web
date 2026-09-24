"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { cn } from "@/shared/utils/cn";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileOrderItemBadge } from "./profileUi";

function ProfileOrderThumbnailImage({ item }: { item: ProfileOrderItemUi }) {
  const isGiftCardItem = Boolean(item.subtitle?.trim());

  if (item.useIconPlaceholder || !item.imageSrc) {
    return (
      <div className="flex size-full items-center justify-center bg-white">
        <RingsTabIcon className="size-12 text-darkblack" />
      </div>
    );
  }

  return (
    <Image
      src={item.imageSrc}
      alt={item.name}
      fill
      className={isGiftCardItem ? "object-contain object-center" : "object-cover"}
      sizes="100px"
    />
  );
}

export function ProfileOrderMobileThumbnails({ items }: { items: ProfileOrderItemUi[] }) {
  const thumbnails = items.slice(0, 3);

  return (
    <div className="flex gap-2 lg:hidden">
      {thumbnails.map((item) => (
        <div
          key={item.id}
          className={cn(
            "relative shrink-0 overflow-hidden bg-white",
            item.subtitle?.trim() ? "h-[100px] w-[120px]" : "size-[100px]",
          )}
        >
          {item.isGift ? <ProfileOrderItemBadge label="Gift" /> : null}
          {item.productUrlKey ? (
            <Link href={`/product/${item.productUrlKey}`} className="block size-full">
              <ProfileOrderThumbnailImage item={item} />
            </Link>
          ) : (
            <ProfileOrderThumbnailImage item={item} />
          )}
        </div>
      ))}
    </div>
  );
}
