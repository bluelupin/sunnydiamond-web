"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { sortOptions } from "../data/filters";
import {
  jewelleryListingMobileFooterSpec,
  jewelleryListingToolbarAssets,
  jewelleryListingToolbarSpec,
} from "../data/content";
import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import SortByIcon from "@/assets/Icons/PLP/SortByIcon";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface JewelleryProductToolbarProps {
  productCount: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterOpen: () => void;
  isFilterOpen?: boolean;
}

const desktopSpec = jewelleryListingToolbarSpec;
const mobileSpec = jewelleryListingMobileFooterSpec;

const SortChevron = ({ size, mobile = false }: { size: number; mobile?: boolean }) => {
  const chevronWidth = mobile ? 13.33 : 13.5;
  const chevronHeight = mobile ? 6.67 : 7.5;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        mobile && "rotate-180",
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={
          mobile
            ? jewelleryListingToolbarAssets.chevronDownMobileIcon
            : jewelleryListingToolbarAssets.chevronDownIcon
        }
        alt=""
        width={chevronWidth}
        height={chevronHeight}
        className="object-contain"
        style={{ width: chevronWidth, height: chevronHeight }}
        aria-hidden
      />
    </span>
  );
};

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
    className="text-darkblack inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:py-[7px]"
    style={{ gap, color }}
    aria-label="Open filters"
  >
    <span
      className="whitespace-nowrap font-gill font-normal uppercase leading-110 lg:text-xl text-base"
    >
      Filter
    </span>
    <FilterIcon className="size-6" />
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
    {/* Desktop — original Sort By control; Gemstone Type-style dropdown menu */}
    <div
      className="hidden grid-cols-1 grid-rows-1 items-center justify-center md:grid"
      style={{
        gap,
        color,
        paddingLeft: desktopSpec.sortPaddingX,
        paddingRight: desktopSpec.sortPaddingX,
        paddingTop: desktopSpec.sortPaddingY,
        paddingBottom: desktopSpec.sortPaddingY,
      }}
    >
      <span
        className="pointer-events-none col-start-1 row-start-1 inline-flex items-center gap-2 whitespace-nowrap font-gill text-base font-normal uppercase leading-110 text-darkblack lg:text-xl"
      >
        Sort By
        <SortByIcon className="size-6" />
      </span>
      <Select value={sortValue} onValueChange={onSortChange}>
        <SelectTrigger
          aria-label="Sort products"
          className="col-start-1 row-start-1 z-10 size-full h-full min-h-0 cursor-pointer border-0 bg-transparent opacity-0 shadow-none focus:ring-0 [&>svg]:hidden"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-30">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Mobile — opens sort drawer (Figma 1279:1020) */}
    <button
      type="button"
      onClick={onMobileOpen}
      className="inline-flex h-8 items-center md:hidden"
      style={{ gap, color }}
      aria-label="Open sort options"
    >
      <span
        className="whitespace-nowrap font-gill font-normal uppercase leading-110"
        style={{ fontSize }}
      >
        Sort By
      </span>
      <SortChevron size={iconSize} mobile />
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
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
      <DrawerContent
        overlayClassName="z-[80] bg-[#1E1E1E]/25 backdrop-blur-[9px]"
        className="z-[80] mt-12 max-h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none [&>div:first-child]:hidden md:hidden"
      >
        <DrawerTitle className="sr-only">Sort products</DrawerTitle>
        <div className="shrink-0 animate-in slide-in-from-bottom duration-300 pb-[env(safe-area-inset-bottom,0px)]">
          <div className="bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral300/50 px-6 py-6">
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Sort By</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sort panel"
                className="inline-flex size-8 shrink-0 items-center justify-center"
              >
                <Image
                  src="/icons/menu-close.svg"
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
                        "flex w-full items-center gap-3 px-6 py-5 text-left font-gill text-base leading-110 text-darkblack",
                        selected ? "bg-gold300 font-normal" : "font-light",
                      )}
                    >
                      <span className="inline-flex size-5 shrink-0 items-center justify-center" aria-hidden>
                        {selected ? <Check size={20} strokeWidth={1.5} /> : null}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
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

          <div className="flex shrink-0 items-center gap-8">
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
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral300/60 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
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
