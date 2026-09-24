"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { buildJewelleryNavRows } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import type { JewelleryNavVariant } from "@/features/jewellery-product/utils/jewelleryRoutes";

function isAllProductsNavItem(item: JewelleryNavCategory): boolean {
  return item.slug === "all" || item.id === "all-products";
}

function getFallbackAllProductsImage(categories: JewelleryNavCategory[]): string | null {
  return [...categories].reverse().find((item) => Boolean(item.image))?.image ?? null;
}

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
      "font-gill text-xl leading-110 text-darkblack transition-opacity",
  },
  mobile: {
    rowsClassName: "flex flex-col gap-3",
    rowClassName: "flex items-stretch gap-3",
    itemClassName: "flex min-w-0 flex-1 flex-col gap-2",
    imageClassName: "relative lg:h-100 h-[140px] w-full shrink-0 overflow-hidden",
    imageSizes: "50vw",
    imageCoverClassName: "object-cover",
    labelClassName: "font-gill md:text-base text-sm leading-110 text-darkblack",
  },
} as const;

function JewelleryCategoryMenuItems({
  categories,
  variant,
  onClose,
  className,
}: {
  categories: JewelleryNavCategory[];
  variant: JewelleryNavVariant;
  onClose: () => void;
  className?: string;
}) {
  const config = VARIANT_CONFIG[variant];
  const rows = buildJewelleryNavRows(categories, variant);
  const fallbackAllProductsImage = getFallbackAllProductsImage(categories);

  return (
    <div className={cn(config.rowsClassName, className)}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={config.rowClassName}>
          {row.map((item) => {
            const isAllProduct = isAllProductsNavItem(item);
            const cardImageSrc = item.image ?? (isAllProduct ? fallbackAllProductsImage : null);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={config.itemClassName}
              >
                <div className={config.imageClassName}>
                  {cardImageSrc ? (
                    <Image
                      src={cardImageSrc}
                      alt={item.label}
                      fill
                      className={config.imageCoverClassName}
                      sizes={config.imageSizes}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray200" aria-hidden />
                  )}

                  {isAllProduct && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/70"
                        aria-hidden
                      />

                      <div
                        className="pointer-events-none absolute inset-3 border border-neutral300/80"
                        aria-hidden
                      />

                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 bg-benefitSurface">
                        <span className={cn(config.labelClassName, "text-center text-darkblack md:text-xl text-base font-normal font-gill")}>{item.label}</span>
                      </div>
                    </>
                  )}
                </div>
                {!isAllProduct && <span className={config.labelClassName}>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function JewelleryCategoryMenu({ variant, onClose, className }: JewelleryCategoryMenuProps) {
  const { data } = useMagentoJewelleryNav();
  const categories = data?.categories ?? [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <JewelleryCategoryMenuItems
      categories={categories}
      variant={variant}
      onClose={onClose}
      className={className}
    />
  );
}

export default JewelleryCategoryMenu;
