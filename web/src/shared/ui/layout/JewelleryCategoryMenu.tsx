"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import {
  getJewelleryNavRows,
  resolveJewelleryNavItem,
  type JewelleryNavVariant,
} from "@/features/jewellery-product/utils/jewelleryRoutes";

type JewelleryCategoryMenuProps = {
  variant: JewelleryNavVariant;
  onClose: () => void;
  className?: string;
};

const VARIANT_CONFIG = {
  desktop: {
    rowsClassName: "flex flex-col gap-8",
    rowClassName: "flex items-stretch gap-3",
    itemClassName: "group flex min-w-0 flex-1 flex-col gap-2",
    imageClassName: "relative h-[204px] w-full shrink-0 overflow-hidden",
    imageSizes: "(max-width: 1440px) 25vw, 300px",
    imageCoverClassName: "object-cover transition-transform duration-300 group-hover:scale-105",
    labelClassName:
      "font-gill text-xl leading-110 text-darkblack transition-opacity group-hover:opacity-70",
    allProductsClassName: "font-gill text-xl leading-110 text-darkblack",
  },
  mobile: {
    rowsClassName: "flex flex-col gap-3",
    rowClassName: "flex items-stretch gap-3",
    itemClassName: "flex min-w-0 flex-1 flex-col gap-1",
    imageClassName: "relative h-100 w-full shrink-0 overflow-hidden",
    imageSizes: "50vw",
    imageCoverClassName: "object-cover",
    labelClassName: "font-gill text-[14px] leading-110 text-darkblack",
    allProductsClassName: "font-gill text-[14px] leading-110 text-darkblack",
  },
} as const;

export function JewelleryCategoryMenu({ variant, onClose, className }: JewelleryCategoryMenuProps) {
  const config = VARIANT_CONFIG[variant];
  const rows = getJewelleryNavRows(variant);

  return (
    <div className={cn(config.rowsClassName, className)}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={config.rowClassName}>
          {row.map((category) => {
            const item = resolveJewelleryNavItem(category);

            return (
              <Link
                key={item.category}
                href={item.href}
                onClick={onClose}
                className={config.itemClassName}
              >
                <div className={config.imageClassName}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className={config.imageCoverClassName}
                      sizes={config.imageSizes}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-benefitSurface">
                      <span className={config.allProductsClassName}>{item.label}</span>
                    </div>
                  )}
                </div>
                {item.image ? (
                  <span className={config.labelClassName}>{item.label}</span>
                ) : (
                  <span className={cn(config.labelClassName, "invisible")} aria-hidden>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default JewelleryCategoryMenu;
