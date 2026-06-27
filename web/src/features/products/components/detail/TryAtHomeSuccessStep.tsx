"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { Product } from "@/features/products/data/products";
import {
  formatTryAtHomeAddItemsDeadline,
  formatTryAtHomeBookingLabel,
  type TryAtHomeBookingSummary,
} from "@/features/products/utils/tryAtHomeBooking";
import { DetailDarkButton, DetailOutlineButton } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";

type TryAtHomeSuccessStepProps = {
  product: Product;
  productImage: string | StaticImageData;
  booking: TryAtHomeBookingSummary;
  additionalItemsCount?: number;
  onClose: () => void;
  onViewBooking: () => void;
  onContinueShopping: () => void;
};

const TryAtHomeSuccessStep = ({
  product,
  productImage,
  booking,
  additionalItemsCount = 0,
  onClose,
  onViewBooking,
  onContinueShopping,
}: TryAtHomeSuccessStepProps) => {
  const addItemsDeadline = formatTryAtHomeAddItemsDeadline(booking.date);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-6">
            <div className="relative flex w-full items-start justify-end">
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#47CB6C]">
                  <Check size={22} strokeWidth={2} aria-hidden className="text-white" />
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close try at home success panel"
                className="relative inline-flex size-6 shrink-0 items-center justify-center"
              >
                <Image
                  src="/images/navigation/menu-close.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
              </button>
            </div>

            <p className="text-center font-gill text-base font-light leading-110 text-darkblack">
              Item added to your try at home booking !
            </p>
          </div>

          <div className="h-px w-full bg-neutral300" aria-hidden />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-gill text-base leading-110 text-[#4D4D4D]">
                {formatTryAtHomeBookingLabel(booking)}
              </p>
              {addItemsDeadline ? (
                <p className="font-gill text-base font-light leading-110 text-darkblack">
                  You can add more items till {addItemsDeadline}
                </p>
              ) : null}
            </div>

            <div className="h-px w-full bg-neutral300" aria-hidden />

            <div className="flex items-center bg-[#F4F3EE] p-3">
              <div className="relative h-[71px] w-[143px] shrink-0">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="143px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4 pl-3">
                <p className="font-gill text-base leading-110 text-darkblack">{product.name}</p>
                <p className="font-gill text-base leading-110 text-darkblack">
                  ₹{formatJewelleryPrice(product.price)}
                </p>
              </div>
            </div>

            {additionalItemsCount > 0 ? (
              <div className="flex items-center gap-1">
                <ShoppingBag size={20} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                <p className="font-gill text-base font-light leading-110 text-darkblack">
                  Your booking has {additionalItemsCount} more{" "}
                  {additionalItemsCount === 1 ? "item" : "items"}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <PanelFooter contentClassName="flex flex-col items-center gap-4">
        <DetailDarkButton onClick={onViewBooking}>View Booking</DetailDarkButton>
        <DetailOutlineButton onClick={onContinueShopping} className="w-full">
          Continue Shopping
        </DetailOutlineButton>
      </PanelFooter>
    </>
  );
};

export default TryAtHomeSuccessStep;
