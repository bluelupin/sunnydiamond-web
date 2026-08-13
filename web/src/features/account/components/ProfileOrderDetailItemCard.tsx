"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { giftingContent } from "@/features/cart/data/giftingContent";
import { cn } from "@/shared/utils/cn";
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

  const nameElement = item.productUrlKey ? (
    <Link
      href={`/product/${item.productUrlKey}`}
      className="font-gill text-base font-normal leading-110 text-darkblack underline-offset-2 hover:underline"
    >
      {item.name}
    </Link>
  ) : (
    <p className="font-gill text-base font-normal leading-110 text-darkblack">{item.name}</p>
  );

  const attributesElement =
    item.size || item.metal ? (
      <div className="flex items-center gap-2 font-gill text-sm font-light leading-110 text-darkblack lg:text-neutral500">
        {item.size ? <span>Size: {item.size}</span> : null}
        {item.size && item.metal ? <ProfileMetaDivider className="h-4" /> : null}
        {item.metal ? <span>{item.metal}</span> : null}
      </div>
    ) : null;

  const engravingElement = item.engraving ? (
    <p className="font-gill text-sm font-light leading-110 text-darkblack lg:text-neutral500">
      Engraving: “{item.engraving}”
      {item.engravingFont ? ` (${item.engravingFont})` : null}
    </p>
  ) : null;

  const priceElement = (
    <p className="font-gill text-base font-normal leading-110 text-darkblack lg:leading-normal lg:tracking-[0.16px]">
      {formatOrderTotal(lineTotal, item.currency)}
    </p>
  );

  const imageElement = item.useIconPlaceholder ? (
    <div className="flex size-full items-center justify-center">
      <RingsTabIcon className="size-12 text-darkblack" />
    </div>
  ) : (
    <Image src={item.imageSrc} alt={item.name} fill className="object-cover" sizes="112px" />
  );

  return (
    <div
      className={cn(
        "relative bg-white p-4 lg:p-6",
        item.isBespoke && "border border-aboutInactive lg:border-neutral300",
      )}
    >
      {badgeLabel ? <ProfileOrderItemBadge label={badgeLabel} /> : null}

      {item.isBespoke ? (
        <div className="flex items-center gap-6 lg:hidden">
          <div className="relative h-[63px] w-[71px] shrink-0 overflow-hidden bg-white">
            {imageElement}
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            {nameElement}
            {attributesElement}
            {engravingElement}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative h-[84px] w-[112px] shrink-0 overflow-hidden bg-white">
            {imageElement}
          </div>
          <div className="min-w-0 flex flex-1 flex-col gap-2">
            {nameElement}
            {attributesElement}
            {engravingElement}
            {priceElement}
            {item.quantity > 1 ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500">
                Qty: {item.quantity}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className="hidden flex-col gap-4 lg:flex">
        <div className="flex items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "relative shrink-0 overflow-hidden bg-white",
                item.isBespoke ? "h-[62px] w-[83px]" : "h-[62px] w-[83px]",
              )}
            >
              {imageElement}
            </div>

            <div className="min-w-0 flex flex-col gap-3">
              {nameElement}
              {attributesElement}
              {engravingElement}
              {item.quantity > 1 ? (
                <p className="font-gill text-sm font-light leading-110 text-neutral500">
                  Qty: {item.quantity}
                </p>
              ) : null}
            </div>
          </div>

          <div className="shrink-0">{priceElement}</div>
        </div>
      </div>

      {item.isGift ? (
        <>
          <div className="mt-4 h-px w-full bg-neutral300 lg:mt-0" />

          <div className="mt-4 flex flex-col gap-4 bg-gray300 p-3 lg:mt-4 lg:bg-gray200 lg:p-4">
            <div className="flex items-center gap-2">
              <div className="relative h-[50px] w-[52px] shrink-0 overflow-hidden lg:size-[58px]">
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
                <div className="h-px w-full bg-aboutInactive lg:bg-neutral300" />
                <div className="flex flex-col gap-2">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {content.giftNoteLabel}
                  </p>
                  <p className="font-gill text-base font-light leading-110 text-neutral500 lg:text-sm lg:text-darkblack">
                    {item.giftNote}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
