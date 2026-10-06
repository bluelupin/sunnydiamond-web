"use client";

import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileMetaDivider, ProfileOrderItemBadge } from "./profileUi";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";

type ProfileOrderItemRowProps = {
  item: ProfileOrderItemUi;
  price?: string;
};

/** Figma order listing — `Size: 14 | White Gold | Engraving: DIYA` on one line. */
function ProfileOrderItemAttributeLine({ item }: { item: ProfileOrderItemUi }) {
  const segments: ReactNode[] = [];

  if (item.size) {
    segments.push(<span key="size">Size: {item.size}</span>);
  }

  if (item.metal) {
    segments.push(<span key="metal">{item.metal}</span>);
  }

  if (item.engraving) {
    segments.push(<span key="engraving">Engraving: {item.engraving}</span>);
  }

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 font-gill text-sm font-light leading-110 text-darkblack">
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {index > 0 ? <ProfileMetaDivider className="h-4" /> : null}
          {segment}
        </Fragment>
      ))}
    </div>
  );
}

export function ProfileOrderItemRow({ item, price }: ProfileOrderItemRowProps) {
  const badgeLabel = item.isGift ? "Gift" : item.isBespoke ? "Bespoke" : null;
  const isGiftCardItem = Boolean(item.subtitle?.trim());

  return (
    <div className="relative overflow-visible border border-aboutInactive bg-white p-4 lg:p-6">
      {badgeLabel ? <ProfileOrderItemBadge label={badgeLabel} /> : null}

      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-6">
          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-white",
              isGiftCardItem ? "h-[62px] w-[99px]" : "h-[63px] w-[71px]",
            )}
          >
            {item.useIconPlaceholder || !item.imageSrc ? (
              <div className="flex size-full items-center justify-center">
                <RingsTabIcon className="size-12 text-darkblack" />
              </div>
            ) : (
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className={isGiftCardItem ? "object-contain object-center" : "object-cover"}
                sizes={isGiftCardItem ? "99px" : "71px"}
              />
            )}
          </div>

          <div className={cn("min-w-0 flex flex-col", isGiftCardItem ? "gap-3" : "gap-2")}>
            {item.productUrlKey ? (
              <Link
                href={`/product/${item.productUrlKey}`}
                className={cn(
                  "font-gill text-base font-normal leading-110 text-darkblack underline-offset-2 hover:underline",
                  productNameDisplayClassName,
                )}
              >
                {item.name}
              </Link>
            ) : (
              <p
                className={cn(
                  "font-gill text-base font-normal leading-110 text-darkblack",
                  productNameDisplayClassName,
                )}
              >
                {item.name}
              </p>
            )}

            {item.subtitle ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500">
                {item.subtitle}
              </p>
            ) : null}

            <ProfileOrderItemAttributeLine item={item} />

            {item.quantity > 1 ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500">
                Qty: {item.quantity}
              </p>
            ) : null}
          </div>
        </div>

        {price ? (
          <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
            {price}
          </p>
        ) : null}
      </div>
    </div>
  );
}
