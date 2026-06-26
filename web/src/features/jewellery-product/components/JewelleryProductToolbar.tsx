"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { sortOptions } from "../data/filters";
import {
  jewelleryListingMobileFooterSpec,
  jewelleryListingToolbarAssets,
  jewelleryListingToolbarSpec,
} from "../data/content";

interface JewelleryProductToolbarProps {
  productCount: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterOpen: () => void;
  isFilterOpen?: boolean;
}

const desktopSpec = jewelleryListingToolbarSpec;
const mobileSpec = jewelleryListingMobileFooterSpec;

const FilterIcon = ({ size }: { size: number }) => (
  <span className="relative shrink-0" style={{ width: size, height: size }}>
    <Image
      src={jewelleryListingToolbarAssets.filterIcon}
      alt=""
      width={size}
      height={size}
      className="size-full object-contain"
      aria-hidden
    />
  </span>
);

const SortChevron = ({ size }: { size: number }) => (
  <span className="relative shrink-0" style={{ width: size, height: size }}>
    <Image
      src={jewelleryListingToolbarAssets.chevronDownIcon}
      alt=""
      width={size}
      height={size}
      className="size-full object-contain"
      aria-hidden
    />
  </span>
);

type FilterControlProps = {
  iconSize: number;
  fontSize: number;
  gap: number;
  color: string;
  onClick: () => void;
};

const FilterControl = ({ iconSize, fontSize, gap, color, onClick }: FilterControlProps) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
    style={{ gap, color }}
    aria-label="Open filters"
  >
    <FilterIcon size={iconSize} />
    <span
      className="whitespace-nowrap font-gill font-normal uppercase leading-110"
      style={{ fontSize }}
    >
      Filter
    </span>
  </button>
);

type SortControlProps = {
  iconSize: number;
  fontSize: number;
  gap: number;
  color: string;
  sortValue: string;
  onSortChange: (value: string) => void;
  onMobileOpen?: () => void;
};

const SortControl = ({
  iconSize,
  fontSize,
  gap,
  color,
  sortValue,
  onSortChange,
  onMobileOpen,
}: SortControlProps) => (
  <>
    {/* Desktop — native select overlay */}
    <div
      className="relative hidden items-center md:inline-flex"
      style={{ gap, color }}
    >
      <span
        className="pointer-events-none whitespace-nowrap font-gill font-normal uppercase leading-110"
        style={{ fontSize }}
      >
        Sort By
      </span>
      <SortChevron size={iconSize} />
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

    {/* Mobile — opens sort drawer */}
    <button
      type="button"
      onClick={onMobileOpen}
      className="inline-flex items-center md:hidden"
      style={{ gap, color }}
      aria-label="Open sort options"
    >
      <span
        className="whitespace-nowrap font-gill font-normal uppercase leading-110"
        style={{ fontSize }}
      >
        Sort By
      </span>
      <SortChevron size={iconSize} />
    </button>
  </>
);

type SortDrawerProps = {
  open: boolean;
  sortValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

const SortDrawer = ({ open, sortValue, onClose, onSelect }: SortDrawerProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden">
      <button
        type="button"
        aria-label="Close sort options"
        className="absolute inset-0 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sort products"
        className="absolute inset-x-0 bottom-0 animate-in slide-in-from-bottom duration-300"
      >
        <div className="bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral300/50 px-6 py-6">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack">SORT BY</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sort panel"
              className="inline-flex size-8 shrink-0 items-center justify-center"
            >
              <Image
                src="/images/navigation/menu-close.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden
              />
            </button>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {sortOptions.map((option) => {
              const selected = sortValue === option.value;
              return (
                <li key={option.value} className="border-b border-neutral300/40 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-6 py-5 text-left font-gill text-base leading-110 text-darkblack",
                      selected ? "font-normal" : "font-light",
                    )}
                  >
                    <span>{option.label}</span>
                    {selected ? (
                      <Check size={20} strokeWidth={1.5} aria-hidden className="shrink-0" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
};

const JewelleryProductToolbar = ({
  productCount,
  sortValue,
  onSortChange,
  onFilterOpen,
  isFilterOpen = false,
}: JewelleryProductToolbarProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const hideMobileBar = isFilterOpen || isSortOpen;

  const handleFilterOpen = () => {
    setIsSortOpen(false);
    onFilterOpen();
  };

  return (
    <>
      {/* Desktop — sticky top bar (Figma 692:4232) */}
      <div className="sticky top-0 z-20 hidden bg-white md:block">
        <div
          className="flex w-full items-center justify-between bg-white"
          style={{
            height: desktopSpec.height,
            paddingLeft: desktopSpec.paddingX,
            paddingRight: desktopSpec.paddingX,
          }}
        >
          <p
            className="shrink-0 whitespace-nowrap font-gill font-light leading-110"
            style={{
              fontSize: desktopSpec.productCountFontSize,
              color: desktopSpec.productCountColor,
            }}
          >
            {productCount.toLocaleString("en-IN")} Products
          </p>

          <div className="flex shrink-0 items-center" style={{ gap: desktopSpec.controlsGap }}>
            <FilterControl
              iconSize={desktopSpec.iconSize}
              fontSize={desktopSpec.controlFontSize}
              gap={desktopSpec.controlInnerGap}
              color={desktopSpec.controlColor}
              onClick={handleFilterOpen}
            />
            <SortControl
              iconSize={desktopSpec.iconSize}
              fontSize={desktopSpec.controlFontSize}
              gap={desktopSpec.controlInnerGap}
              color={desktopSpec.controlColor}
              sortValue={sortValue}
              onSortChange={onSortChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile — sticky footer (Figma 1279:1015) */}
      {!hideMobileBar ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral300/60 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
          style={{ backgroundColor: mobileSpec.backgroundColor }}
        >
          <div
            className="mx-auto flex w-full max-w-[375px] items-center justify-between"
            style={{
              height: mobileSpec.height,
              paddingLeft: mobileSpec.paddingX,
              paddingRight: mobileSpec.paddingX,
            }}
          >
            <FilterControl
              iconSize={mobileSpec.iconSize}
              fontSize={mobileSpec.fontSize}
              gap={mobileSpec.controlGap}
              color={mobileSpec.textColor}
              onClick={handleFilterOpen}
            />
            <SortControl
              iconSize={mobileSpec.iconSize}
              fontSize={mobileSpec.fontSize}
              gap={mobileSpec.controlGap}
              color={mobileSpec.textColor}
              sortValue={sortValue}
              onSortChange={onSortChange}
              onMobileOpen={() => setIsSortOpen(true)}
            />
          </div>
        </div>
      ) : null}

      <SortDrawer
        open={isSortOpen}
        sortValue={sortValue}
        onClose={() => setIsSortOpen(false)}
        onSelect={onSortChange}
      />
    </>
  );
};

export default JewelleryProductToolbar;
