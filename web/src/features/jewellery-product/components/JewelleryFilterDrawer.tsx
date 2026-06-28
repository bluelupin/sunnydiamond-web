"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { PanelFooter } from "@/shared/ui/PanelFooter";
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
      "flex h-[56px] items-center justify-center bg-[#F2F2F2] px-[24px] py-[12px] font-gill text-[16px] leading-110 text-darkblack",
      showCheck && selected && "gap-[4px]",
    )}
  >
    {showCheck && selected ? (
      <Image
        src="/images/jewellery/filter-check.svg"
        alt=""
        width={18}
        height={18}
        aria-hidden
        className="shrink-0"
      />
    ) : null}
    <span className={selected ? "font-normal" : "font-light"}>{label}</span>
  </button>
);

const FilterSelectChevron = () => (
  <span
    className="pointer-events-none absolute inset-y-0 right-[12px] inline-flex w-[24px] items-center justify-center"
    aria-hidden
  >
    <Image
      src={jewelleryListingFilterDrawerAssets.selectChevronIcon}
      alt=""
      width={spec.selectChevronIconWidth}
      height={spec.selectChevronIconHeight}
      className="rotate-90 object-contain"
      style={{
        width: spec.selectChevronIconWidth,
        height: spec.selectChevronIconHeight,
      }}
    />
  </span>
);

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
    <div className="fixed inset-0 z-[70] flex max-lg:flex-col lg:justify-end">
      <button
        type="button"
        aria-label="Close filters"
        className="min-h-0 flex-1 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300 max-lg:min-h-12"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "flex max-h-full min-h-0 shrink-0 flex-col bg-white shadow-2xl",
          "max-lg:w-full max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:h-full lg:w-full lg:max-w-[474px] lg:animate-in lg:slide-in-from-right lg:duration-300",
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
              />
            </button>
          </div>
          <div className="mx-auto mt-[22px] h-px w-full max-w-[424px] bg-neutral300" aria-hidden />
        </div>

        <div className="filter-drawer-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-[24px] pt-[22px]">
          <div className="mx-auto flex w-full max-w-[424px] flex-col gap-[24px] pb-72">
            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-[16px] font-normal leading-110 text-darkblack">
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
                <div className="flex items-center justify-between font-gill text-[14px] font-light leading-110 text-darkblack">
                  <span>₹ {formatCurrency(draft.minPrice)}</span>
                  <span>₹ {formatCurrency(draft.maxPrice)}</span>
                </div>
              </div>
            </section>

            <section className="flex gap-[24px]">
              <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="font-gill text-[14px] font-normal leading-110 text-darkblack">
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
                    "h-[56px] w-full bg-[#F2F2F2] p-[12px] font-gill text-[14px] font-normal leading-110 text-darkblack outline-none",
                    minInputFocused && "border border-neutral500",
                  )}
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="font-gill text-[14px] font-normal leading-110 text-darkblack">
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
                  className="h-[56px] w-full bg-[#F2F2F2] p-[12px] font-gill text-[14px] font-normal leading-110 text-darkblack placeholder:text-neutral400 outline-none"
                />
              </label>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h3 className="font-gill text-[16px] font-normal leading-110 text-darkblack">
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
              <h3 className="font-gill text-[16px] font-normal leading-110 text-darkblack">
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
              <h3 className="font-gill text-[16px] font-normal leading-110 text-darkblack">
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

            <section className="flex flex-col gap-[8px]">
              <label
                htmlFor="filter-gemstone-type"
                className="font-gill text-[16px] font-normal leading-110 text-darkblack"
              >
                Gemstone Type:
              </label>
              <div className="relative h-[56px] w-full bg-[#F2F2F2]">
                <select
                  id="filter-gemstone-type"
                  value={draft.gemstoneType}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, gemstoneType: event.target.value }))
                  }
                  className={cn(
                    "h-full w-full appearance-none bg-transparent py-[12px] pl-[12px] pr-[44px] font-gill text-[16px] leading-110 outline-none",
                    draft.gemstoneType
                      ? "font-normal text-darkblack"
                      : "font-light text-neutral400",
                  )}
                >
                  {filterGemstoneOptions.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FilterSelectChevron />
              </div>
            </section>
          </div>
        </div>

        <PanelFooter contentClassName="border-t-[0.5px] border-neutral300 px-[40px] py-[24px]">
          <div className="flex gap-[24px]">
            <button
              type="button"
              onClick={handleClearAll}
              className="btn-border-slide inline-flex h-[56px] min-w-0 flex-1 items-center justify-center border-[0.8px] border-neutral300 px-[28px] py-[20px] font-gill text-[14px] font-normal uppercase leading-110 text-darkblack"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="btn-dark-slide inline-flex h-[56px] min-w-0 flex-1 items-center justify-center px-[28px] py-[20px] font-gill text-[14px] font-normal uppercase leading-110 text-white"
            >
              Apply Filters
            </button>
          </div>
        </PanelFooter>
      </aside>
    </div>
  );
};

export default JewelleryFilterDrawer;
