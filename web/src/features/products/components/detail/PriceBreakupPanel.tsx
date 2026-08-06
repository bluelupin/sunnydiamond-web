"use client";

import Image, { type StaticImageData } from "next/image";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { ProductDetailPricing } from "@/features/products/types/productDetail";
import { derivePriceBreakup } from "@/features/products/utils/priceBreakup";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { AttributeSeparator, DetailDarkButton } from "./shared";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";

type PriceBreakupPanelProps = {
  open: boolean;
  onClose: () => void;
  productName: string;
  productImage: string | StaticImageData;
  metalLabel?: string;
  ringSize?: string;
  pricing: ProductDetailPricing;
};

type PriceBreakupRowProps = {
  label: string;
  value: string;
  discount?: boolean;
};

const PriceBreakupRow = ({ label, value, discount }: PriceBreakupRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <span className="font-gill text-base font-light leading-110 text-darkblack">{label}</span>
    <span className="font-gill text-base font-normal leading-110 text-darkblack">
      {discount ? (
        <span className="inline-flex items-center gap-0.5">
          <span className="text-sm">-</span>
          <span>{value}</span>
        </span>
      ) : (
        value
      )}
    </span>
  </div>
);

const PriceBreakupPanel = ({
  open,
  onClose,
  productName,
  productImage,
  metalLabel,
  ringSize,
  pricing,
}: PriceBreakupPanelProps) => {
  const breakup = derivePriceBreakup(pricing);
  const formatAmount = (amount: number) => `₹${formatJewelleryPrice(amount)}`;

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel="Close price breakup panel"
      dialogAriaLabel="Price Breakup"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-6 px-6 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
              Price Breakup
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close price breakup panel"
              className="inline-flex size-6 shrink-0 items-center justify-center"
            >
              <Image
                src="/images/icons/menu-close.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
            </button>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 px-6 py-6">
          <div className="bg-gray300 px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="relative h-[68px] w-[91px] shrink-0 overflow-hidden bg-white">
                <Image
                  src={productImage}
                  alt=""
                  width={91}
                  height={68}
                  className="size-full object-cover object-center"
                  sizes="91px"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  {productName}
                </p>
                {ringSize || metalLabel ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {ringSize ? (
                      <span className="font-gill text-sm font-light leading-110 text-neutral500">
                        Size: {ringSize}
                      </span>
                    ) : null}
                    {ringSize && metalLabel ? <AttributeSeparator /> : null}
                    {metalLabel ? (
                      <span className="font-gill text-sm font-light leading-110 text-neutral500">
                        {metalLabel}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <PriceBreakupRow label="Metal" value={formatAmount(breakup.metal)} />
            <PriceBreakupRow label="Stone" value={formatAmount(breakup.stone)} />
            <PriceBreakupRow label="Making charges" value={formatAmount(breakup.makingCharges)} />
            {breakup.discount > 0 ? (
              <PriceBreakupRow
                label="Discount"
                value={formatAmount(breakup.discount)}
                discount
              />
            ) : null}
          </div>
        </div>

        <PanelFooter showGradient={false} contentClassName="flex flex-col gap-4 px-4 py-6 lg:px-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-gill text-base font-normal leading-110 text-darkblack">Total</span>
            <span className="font-gill text-base font-normal leading-110 text-darkblack">
              {formatAmount(breakup.total)}
            </span>
          </div>
          <DetailDarkButton className="uppercase" onClick={onClose}>
            Done
          </DetailDarkButton>
        </PanelFooter>
      </div>
    </ProductDetailSidePanelShell>
  );
};

export default PriceBreakupPanel;
