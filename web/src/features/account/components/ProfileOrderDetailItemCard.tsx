"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { giftingContent } from "@/features/cart/data/giftingContent";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileOrderDetailItemUi } from "../types/profileUi.types";
import { formatOrderTotal } from "../utils/formatAccountData";
import { ProfileMetaDivider, ProfileOrderItemBadge } from "./profileUi";

type ProfileOrderDetailItemCardProps = {
  item: ProfileOrderDetailItemUi;
};

export function ProfileOrderDetailItemCard({ item }: ProfileOrderDetailItemCardProps) {
  const content = profileTabsContent.orders.detail;
  const badgeLabel = item.isGift ? "Gift" : item.isBespoke ? "Bespoke" : null;
  const lineTotal = item.unitPrice * item.quantity;
  const borderClass = item.isBespoke ? "border border-neutral200" : "";

  return (
    <div className={`relative bg-white p-6 ${borderClass}`}>
      {badgeLabel ? <ProfileOrderItemBadge label={badgeLabel} /> : null}

      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-[62px] w-[83px] shrink-0 overflow-hidden bg-white">
            {item.useIconPlaceholder ? (
              <div className="flex size-full items-center justify-center">
                <RingsTabIcon className="size-12 text-darkblack" />
              </div>
            ) : (
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="83px"
              />
            )}
          </div>

          <div className="min-w-0 flex flex-col gap-3">
            {item.productUrlKey ? (
              <Link
                href={`/product/${item.productUrlKey}`}
                className="font-gill text-base font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
              >
                {item.name}
              </Link>
            ) : (
              <p className="font-gill text-base font-normal leading-110 text-darkblack">
                {item.name}
              </p>
            )}

            {item.size || item.metal ? (
              <div className="flex items-center gap-2 font-gill text-sm font-light leading-110 text-neutral500">
                {item.size ? <span>Size: {item.size}</span> : null}
                {item.size && item.metal ? <ProfileMetaDivider className="h-4" /> : null}
                {item.metal ? <span>{item.metal}</span> : null}
              </div>
            ) : null}

            {item.quantity > 1 ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500">
                Qty: {item.quantity}
              </p>
            ) : null}
          </div>
        </div>

        <p className="shrink-0 font-gill text-base font-normal leading-normal tracking-[0.16px] text-darkblack">
          {formatOrderTotal(lineTotal, item.currency)}
        </p>
      </div>

      {item.isGift ? (
        <div className="mt-4 flex flex-col gap-4 bg-chalk100 p-4">
          <div className="flex items-center gap-2">
            <div className="relative size-[58px] shrink-0 overflow-hidden">
              <Image
                src={giftingContent.bagHero.single}
                alt={giftingContent.bagHero.alt}
                width={60}
                height={72}
                className="object-contain"
              />
            </div>
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              {content.complementaryGiftBagLabel}
            </p>
          </div>

          {item.giftNote ? (
            <>
              <div className="h-px w-full bg-neutral200" />
              <div className="flex flex-col gap-2">
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  {content.giftNoteLabel}
                </p>
                <p className="font-gill text-sm font-light leading-110 text-darkblack">
                  {item.giftNote}
                </p>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
