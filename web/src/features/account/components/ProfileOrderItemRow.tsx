"use client";

import Image from "next/image";
import Link from "next/link";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileMetaDivider, ProfileOrderItemBadge } from "./profileUi";

type ProfileOrderItemRowProps = {
  item: ProfileOrderItemUi;
  price?: string;
};

export function ProfileOrderItemRow({ item, price }: ProfileOrderItemRowProps) {
  const badgeLabel = item.isGift ? "Gift" : item.isBespoke ? "Bespoke" : null;

  return (
    <div className="relative border border-aboutInactive bg-white p-4">
      {badgeLabel ? <ProfileOrderItemBadge label={badgeLabel} /> : null}

      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-6">
          <div className="relative h-[63px] w-[71px] shrink-0 overflow-hidden bg-white">
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
                sizes="71px"
              />
            )}
          </div>

          <div className="min-w-0 flex flex-col gap-2">
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
              <div className="flex items-center gap-2 font-gill text-sm font-light leading-110 text-darkblack">
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

        {price ? (
          <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
            {price}
          </p>
        ) : null}
      </div>
    </div>
  );
}
