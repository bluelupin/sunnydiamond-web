"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { cn } from "@/shared/utils/cn";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileOrderItemBadge } from "./profileUi";

/** Figma mobile order listing — gift card thumbnail (100×100 square, 15.5px side inset). */
const MOBILE_GIFT_CARD_THUMB_CLASS =
  "box-border size-[100px] px-[15.5px] py-7 w-full";
const MOBILE_GIFT_CARD_IMAGE_FRAME_CLASS = "relative h-11 w-full max-w-[70px]";

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
      {thumbnails.map((item) => {
        const isGiftCardItem = Boolean(item.subtitle?.trim());

        return (
          <div key={item.id} className={cn(isGiftCardItem && "w-full", "relative shrink-0")}>
            {item.isGift ? <ProfileOrderItemBadge label="Gift" /> : null}
            <div
              className={cn(
                "overflow-hidden bg-white",
                isGiftCardItem ? MOBILE_GIFT_CARD_THUMB_CLASS : "size-[100px]",
              )}
            >
              {isGiftCardItem ? (
                <div className={MOBILE_GIFT_CARD_IMAGE_FRAME_CLASS}>
                  <ProfileOrderThumbnailImage item={item} />
                </div>
              ) : item.productUrlKey ? (
                <Link href={`/product/${item.productUrlKey}`} className="relative block size-full">
                  <ProfileOrderThumbnailImage item={item} />
                </Link>
              ) : (
                <div className="relative size-full">
                  <ProfileOrderThumbnailImage item={item} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
