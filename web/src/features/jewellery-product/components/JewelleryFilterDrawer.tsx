"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { PanelFooter, PanelFooterDualActions } from "@/shared/ui/PanelFooter";
import {
  jewelleryListingFilterDrawerAssets,
  jewelleryListingFilterDrawerSpec as spec,
} from "../data/content";
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  createDefaultFilterState,
  filterCategoryRows,
  filterGemstoneOptions,
  filterMetalPurityOptions,
  filterMetalTypeOptions,
} from "../data/filters";
import type { JewelleryFilterState } from "../types";

interface JewelleryFilterDrawerProps {
  open: boolean;
  filters: JewelleryFilterState;
  onClose: () => void;
  onApply: (filters: JewelleryFilterState) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const parseAmount = (value: string) => {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const rangeThumbClassName =
  "pointer-events-none col-start-1 row-start-1 z-20 h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

const FilterChip = ({
  label,
  selected,
  showCheck,
  onClick,
}: {
  label: string;
  selected: boolean;
  showCheck?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "flex h-[56px] items-center justify-center bg-[#F2F2F2] px-[24px] py-[12px] font-gill text-base leading-110",
      showCheck && selected && "gap-[4px]",
    )}
  >
    {showCheck && selected ? (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 9.75L6.75 12.75L14.25 5.25" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : null}
    <span className={selected ? "font-normal text-darkblack" : "font-light text-gary300 opacity-80"}>{label}</span>
  </button>
);

const FilterSelectChevron = ({ open = false }: { open?: boolean }) => (
  <span
    className="pointer-events-none inline-flex size-[24px] shrink-0 items-center justify-center"
    aria-hidden
  >
    <Image
      src={jewelleryListingFilterDrawerAssets.selectChevronIcon}
      alt=""
      width={spec.selectChevronIconWidth}
      height={spec.selectChevronIconHeight}
      className={cn(
        "shrink-0 object-contain transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90",
      )}
      style={{
        width: spec.selectChevronIconWidth,
        height: spec.selectChevronIconHeight,
      }}
    />
  </span>
);

const gemstoneChoices = filterGemstoneOptions.filter((option) => option.value);

const GemstoneTypeSelect = ({
  value,
  onChange,
  drawerOpen,
}: {
  value: string;
  onChange: (value: string) => void;
  drawerOpen: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) {
      setIsOpen(false);
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const selectedOption = gemstoneChoices.find((option) => option.value === value);
  const triggerLabel = selectedOption?.label ?? "Select";
  const showPlaceholder = !selectedOption;

  return (
    <div ref={rootRef} className="flex flex-col gap-[8px]">
      <span
        id="filter-gemstone-type-label"
        className="font-gill text-sm font-normal leading-110 text-darkblack"
      >
        Gemstone Type:
      </span>
      <button
        type="button"
        id="filter-gemstone-type"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "filter-gemstone-type-listbox" : undefined}
        aria-labelledby="filter-gemstone-type-label filter-gemstone-type-value"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-[56px] w-full items-center justify-between bg-[#F2F2F2] p-[12px] font-gill text-sm leading-110 outline-none",
          isOpen ? "border border-darkblack" : "border border-transparent",
          showPlaceholder && !isOpen ? "font-light text-neutral400" : "font-normal text-darkblack",
        )}
      >
        <span id="filter-gemstone-type-value">{triggerLabel}</span>
        <FilterSelectChevron open={isOpen} />
      </button>
      {isOpen ? (
        <div
          id="filter-gemstone-type-listbox"
          role="listbox"
          aria-labelledby="filter-gemstone-type-label"
          className="flex w-full flex-col bg-[#F2F2F2]"
        >
          {gemstoneChoices.map((option) => {
            const selected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex h-[56px] w-full items-center p-[12px] text-left font-gill text-sm leading-110 transition-colors",
                  selected
                    ? "bg-[#DECAA0] font-normal text-darkblack"
                    : "font-normal text-neutral400 hover:bg-white",
                )}
              >
                <span className="flex items-center gap-[8px]">
                  <Image
                    src={
                      selected
                        ? jewelleryListingFilterDrawerAssets.gemstoneRadioSelectedIcon
                        : jewelleryListingFilterDrawerAssets.gemstoneRadioDefaultIcon
                    }
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className="size-[24px] shrink-0 object-contain"
                  />
                  <span>{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const JewelleryFilterDrawer = ({ open, filters, onClose, onApply }: JewelleryFilterDrawerProps) => {
  const [draft, setDraft] = useState<JewelleryFilterState>(filters);
  const [minInputFocused, setMinInputFocused] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(filters);
    }
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const toggleListValue = (key: "categories" | "metalTypes" | "metalPurities", value: string) => {
    setDraft((current) => {
      const selected = current[key];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return { ...current, [key]: next };
    });
  };

  const handleClearAll = () => {
    setDraft(createDefaultFilterState());
  };

  const minPercent =
    ((draft.minPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100;
  const maxPercent =
    ((draft.maxPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex max-md:flex-col md:justify-end">
      <button
        type="button"
        aria-label="Close filters"
        className="min-h-0 flex-1 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300 max-md:min-h-12"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "flex max-h-full min-h-0 shrink-0 flex-col bg-white shadow-2xl",
          "max-md:w-full max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300",
          "md:h-full md:w-full md:max-w-[474px] md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        <div className="px-[24px] pt-[40px]">
          <div className="mx-auto flex h-[32px] w-full max-w-[424px] items-center justify-between">
            <h2 className="font-larken text-[24px] font-light leading-110 text-darkblack">FILTERS</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filter panel"
              className="inline-flex size-[32px] shrink-0 items-center justify-center"
            >
              <Image
                src="/images/jewellery/filter-drawer-close.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden
                className="size-[32px] object-contain"
              />
            </button>
          </div>
          <div className="mx-auto mt-[22px] h-px w-full max-w-[424px] bg-neutral300" aria-hidden />
        </div>

        <div className="filter-drawer-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-[24px] pt-[22px]">
          <div className="mx-auto flex w-full max-w-[424px] flex-col gap-[24px] pb-72">
            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                By Price Range
              </h3>
              <div className="flex flex-col gap-[12px]">
                <div className="grid h-[12px] grid-cols-1 grid-rows-1 items-center">
                  <div
                    className="col-start-1 row-start-1 h-[4px] rounded-[70px] bg-neutral300"
                    aria-hidden
                  />
                  <div
                    className="col-start-1 row-start-1 h-[3px] rounded-[70px] bg-darkblack"
                    style={{
                      marginLeft: `${minPercent}%`,
                      width: `${Math.max(maxPercent - minPercent, 0)}%`,
                    }}
                    aria-hidden
                  />
                  <input
                    type="range"
                    min={DEFAULT_MIN_PRICE}
                    max={DEFAULT_MAX_PRICE}
                    step={500}
                    value={draft.minPrice}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        minPrice: Math.min(Number(event.target.value), current.maxPrice),
                      }))
                    }
                    className={rangeThumbClassName}
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min={DEFAULT_MIN_PRICE}
                    max={DEFAULT_MAX_PRICE}
                    step={500}
                    value={draft.maxPrice}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        maxPrice: Math.max(Number(event.target.value), current.minPrice),
                      }))
                    }
                    className={cn(rangeThumbClassName, "z-30")}
                    aria-label="Maximum price"
                  />
                </div>
                <div className="flex items-center justify-between font-gill text-sm font-light leading-110 text-darkblack">
                  <span>₹ {formatCurrency(draft.minPrice)}</span>
                  <span>₹ {formatCurrency(draft.maxPrice)}</span>
                </div>
              </div>
            </section>

            <section className="flex gap-[24px]">
              <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="font-gill text-sm font-normal leading-110 text-darkblack">
                  Min Amount
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(draft.minPrice)}
                  onFocus={() => setMinInputFocused(true)}
                  onBlur={() => setMinInputFocused(false)}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      minPrice: Math.min(
                        parseAmount(event.target.value) || DEFAULT_MIN_PRICE,
                        current.maxPrice,
                      ),
                    }))
                  }
                  className={cn(
                    "h-[56px] w-full bg-[#F2F2F2] p-[12px] font-gill text-sm font-normal leading-110 text-darkblack outline-none",
                    minInputFocused && "border border-neutral500",
                  )}
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="font-gill text-sm font-normal leading-110 text-darkblack">
                  Max Amount
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter"
                  value={draft.maxPrice === DEFAULT_MAX_PRICE ? "" : formatCurrency(draft.maxPrice)}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      maxPrice: Math.max(
                        parseAmount(event.target.value) || DEFAULT_MAX_PRICE,
                        current.minPrice,
                      ),
                    }))
                  }
                  className="h-[56px] w-full bg-[#F2F2F2] p-[12px] font-gill text-sm font-normal leading-110 text-darkblack placeholder:text-neutral400 outline-none"
                />
              </label>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                By Categories:
              </h3>
              <div className="flex flex-col gap-[12px]">
                {filterCategoryRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap gap-[7px]">
                    {row.map((category) => (
                      <FilterChip
                        key={category}
                        label={category}
                        selected={draft.categories.includes(category)}
                        showCheck
                        onClick={() => toggleListValue("categories", category)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                Metal Type:
              </h3>
              <div className="flex flex-wrap gap-[7px]">
                {filterMetalTypeOptions.map((metalType) => (
                  <FilterChip
                    key={metalType}
                    label={metalType}
                    selected={draft.metalTypes.includes(metalType)}
                    onClick={() => toggleListValue("metalTypes", metalType)}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                Metal Purity:
              </h3>
              <div className="flex flex-wrap gap-[7px]">
                {filterMetalPurityOptions.map((purity) => (
                  <FilterChip
                    key={purity}
                    label={purity}
                    selected={draft.metalPurities.includes(purity)}
                    onClick={() => toggleListValue("metalPurities", purity)}
                  />
                ))}
              </div>
            </section>

            <section>
              <GemstoneTypeSelect
                drawerOpen={open}
                value={draft.gemstoneType}
                onChange={(gemstoneType) => setDraft((current) => ({ ...current, gemstoneType }))}
              />
            </section>
          </div>
        </div>

        <PanelFooter contentClassName="border-t-[0.5px] border-neutral300 px-[40px] py-[24px]">
          <PanelFooterDualActions>
            <button
              type="button"
              onClick={handleClearAll}
              className="btn-border-slide inline-flex h-[56px] min-w-0 flex-1 items-center justify-center border-[0.8px] border-neutral300 px-[28px] py-[20px] font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="btn-dark-slide inline-flex h-[56px] min-w-0 flex-1 items-center justify-center px-[28px] py-[20px] font-gill text-sm font-normal uppercase leading-110 text-white"
            >
              Apply Filters
            </button>
          </PanelFooterDualActions>
        </PanelFooter>
      </aside>
    </div>
  );
};

export default JewelleryFilterDrawer;
