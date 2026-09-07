"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileOrderItemBadge } from "./profileUi";

function ProfileOrderThumbnailImage({ item }: { item: ProfileOrderItemUi }) {
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
      className="object-cover"
      sizes="100px"
    />
  );
}

export function ProfileOrderMobileThumbnails({ items }: { items: ProfileOrderItemUi[] }) {
  const thumbnails = items.slice(0, 3);

  return (
    <div className="flex gap-2 lg:hidden">
      {thumbnails.map((item) => (
        <div key={item.id} className="relative size-[100px] shrink-0 overflow-hidden bg-white">
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
