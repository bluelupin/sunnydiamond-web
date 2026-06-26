"use client";

import Image from "next/image";
import { sortOptions } from "../data/filters";
import {
  jewelleryListingToolbarAssets,
  jewelleryListingToolbarSpec,
} from "../data/content";

interface JewelleryProductToolbarProps {
  productCount: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterOpen: () => void;
}

const {
  height,
  paddingX,
  productCountColor,
  productCountFontSize,
  controlFontSize,
  controlColor,
  controlsGap,
  controlInnerGap,
  filterPaddingY,
  sortPaddingX,
  sortPaddingY,
  iconSize,
} = jewelleryListingToolbarSpec;

const JewelleryProductToolbar = ({
  productCount,
  sortValue,
  onSortChange,
  onFilterOpen,
}: JewelleryProductToolbarProps) => {
  return (
    <div className="sticky top-0 z-20 hidden bg-white md:block">
      <div
        className="flex w-full items-center justify-between bg-white"
        style={{
          height: `${height}px`,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
        }}
      >
        <p
          className="shrink-0 whitespace-nowrap font-gill font-light leading-110"
          style={{
            fontSize: `${productCountFontSize}px`,
            color: productCountColor,
          }}
        >
          {productCount.toLocaleString("en-IN")} Products
        </p>

        <div
          className="flex shrink-0 items-center"
          style={{ gap: `${controlsGap}px` }}
        >
          <button
            type="button"
            onClick={onFilterOpen}
            className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            style={{
              gap: `${controlInnerGap}px`,
              paddingTop: `${filterPaddingY}px`,
              paddingBottom: `${filterPaddingY}px`,
            }}
            aria-label="Open filters"
          >
            <span
              className="relative shrink-0"
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            >
              <Image
                src={jewelleryListingToolbarAssets.filterIcon}
                alt=""
                width={iconSize}
                height={iconSize}
                className="size-full object-contain"
                aria-hidden
              />
            </span>
            <span
              className="whitespace-nowrap font-gill font-normal uppercase leading-110"
              style={{
                fontSize: `${controlFontSize}px`,
                color: controlColor,
              }}
            >
              Filter
            </span>
          </button>

          <div
            className="relative inline-flex items-center"
            style={{
              gap: `${controlInnerGap}px`,
              paddingLeft: `${sortPaddingX}px`,
              paddingRight: `${sortPaddingX}px`,
              paddingTop: `${sortPaddingY}px`,
              paddingBottom: `${sortPaddingY}px`,
            }}
          >
            <span
              className="pointer-events-none whitespace-nowrap font-gill font-normal uppercase leading-110"
              style={{
                fontSize: `${controlFontSize}px`,
                color: controlColor,
              }}
            >
              Sort By
            </span>
            <span
              className="pointer-events-none relative shrink-0"
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            >
              <Image
                src={jewelleryListingToolbarAssets.chevronDownIcon}
                alt=""
                width={iconSize}
                height={iconSize}
                className="size-full object-contain"
                aria-hidden
              />
            </span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="absolute inset-0 cursor-pointer appearance-none bg-transparent opacity-0"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryProductToolbar;
