"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileMetaDivider } from "./profileUi";

type ProfileOrderItemRowProps = {
  item: ProfileOrderItemUi;
};

export function ProfileOrderItemRow({ item }: ProfileOrderItemRowProps) {
  return (
    <div className="relative bg-white p-4">
      {item.isGift ? (
        <span
          className="absolute left-0 top-0 bg-darkblack px-3 py-1 font-gill text-xs font-normal uppercase leading-110 text-white"
        >
          Gift
        </span>
      ) : null}

      <div className="flex gap-4">
        <div className="relative h-[63px] w-[71px] shrink-0 overflow-hidden bg-neutral300">
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="71px"
          />
        </div>

        <div className="min-w-0 flex-1 pt-1">
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
            <div className="mt-2 flex flex-wrap items-center gap-2 font-gill text-sm leading-110 text-darkblack">
              {item.size ? (
                <span className="font-light">
                  Size: <span className="font-normal">{item.size}</span>
                </span>
              ) : null}
              {item.size && item.metal ? <ProfileMetaDivider /> : null}
              {item.metal ? <span className="font-light">{item.metal}</span> : null}
            </div>
          ) : null}

          {item.quantity > 1 ? (
            <p className="mt-1 font-gill text-sm font-light leading-110 text-neutral500">
              Qty: {item.quantity}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
