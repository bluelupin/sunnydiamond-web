"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";
import { sortOptions } from "../data/filters";
import {
  jewelleryListingMobileFooterSpec,
  jewelleryListingToolbarSpec,
} from "../data/content";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";

interface JewelleryProductToolbarProps {
  productCount: number;
  isSearching?: boolean;
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterOpen: () => void;
  isFilterOpen?: boolean;
}

const desktopSpec = jewelleryListingToolbarSpec;
const mobileSpec = jewelleryListingMobileFooterSpec;

type FilterControlProps = {
  iconSize: number;
  fontSize: number;
  gap: number;
  color: string;
  onClick: () => void;
};

const FilterControl = ({ iconSize, fontSize, gap, color, onClick }: FilterControlProps) => {
  const { windows } = useUiPlatform();

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-darkblack inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 flex items-center justify-center h-10 md:px-3"
      style={{ gap, color }}
      aria-label="Open filters"
    >
      <span
        className="whitespace-nowrap font-gill font-normal uppercase leading-110 lg:text-xl text-base"
      >
        Filter
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(!windows && "-translate-y-0.5", "md:size-6 size-5")}
        aria-hidden
      >
        <path d="M8.125 8.125C9.16053 8.125 10 7.28553 10 6.25C10 5.21447 9.16053 4.375 8.125 4.375C7.08947 4.375 6.25 5.21447 6.25 6.25C6.25 7.28553 7.08947 8.125 8.125 8.125Z" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.125 15.625C14.1605 15.625 15 14.7855 15 13.75C15 12.7145 14.1605 11.875 13.125 11.875C12.0895 11.875 11.25 12.7145 11.25 13.75C11.25 14.7855 12.0895 15.625 13.125 15.625Z" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 6.25H16.875" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.125 6.25H6.25" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 13.75H16.875" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.125 13.75H11.25" stroke="#0A0A0A" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

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
}: SortControlProps) => {
  const { windows } = useUiPlatform();
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const desktopSortRef = useRef<HTMLDivElement>(null);
  const listboxId = "plp-sort-listbox";

  useEffect(() => {
    if (!isDesktopOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (desktopSortRef.current?.contains(target)) {
        return;
      }

      setIsDesktopOpen(false);
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isDesktopOpen]);

  const handleDesktopSortSelect = (value: string) => {
    onSortChange(value);
    setIsDesktopOpen(false);
  };

  return (
    <>
      {/* Desktop — Sort By trigger with contact-form-style inline dropdown */}
      <div
        ref={desktopSortRef}
        className="relative hidden h-10 md:block"
        style={{ color }}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isDesktopOpen}
          aria-controls={isDesktopOpen ? listboxId : undefined}
          aria-label="Sort products"
          onClick={() => setIsDesktopOpen((current) => !current)}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap px-3 font-gill text-base font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 lg:text-xl"
          style={{ gap }}
        >
          Sort By
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              !windows && "-translate-y-0.5",
              "md:size-6 size-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-in-out",
              isDesktopOpen && "rotate-180",
            )}
            aria-hidden
          >
            <path
              d="M19 9L12.5 15.5L6 9"
              stroke="#0A0A0A"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isDesktopOpen ? (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Sort products"
            className="absolute right-0 top-full z-[90] mt-2 flex min-w-[188px] flex-col bg-[#F2F2F2]"
          >
            {sortOptions.map((option) => {
              const selected = sortValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => handleDesktopSortSelect(option.value)}
                  className={cn(
                    "flex h-14 w-full shrink-0 items-center p-3 text-left font-gill text-base leading-110",
                    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
                    selected
                      ? "bg-gold300 font-normal text-darkblack"
                      : "font-normal text-neutral500 hover:bg-gold300 hover:text-darkblack",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(!windows && "-translate-y-0.5", "md:size-6 size-5")}
          aria-hidden
        >
          <path d="M19 9L12.5 15.5L6 9" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
};

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
  isSearching = false,
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
      <div className="hidden bg-white md:block">
        <div
          className="flex w-full items-center justify-between bg-white py-6 px-10"
        >
          {isSearching ? (
            <span
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-gill font-light leading-110"
              style={{
                fontSize: desktopSpec.productCountFontSize,
                color: desktopSpec.productCountColor,
              }}
              aria-live="polite"
              aria-busy="true"
            >
              Searching products...
            </span>
          ) : (
            <p
              className="shrink-0 whitespace-nowrap font-gill font-light leading-110"
              style={{
                fontSize: desktopSpec.productCountFontSize,
                color: desktopSpec.productCountColor,
              }}
            >
              {productCount.toLocaleString("en-IN")} Products
            </p>
          )}

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
