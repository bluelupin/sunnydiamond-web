"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
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
  "pointer-events-none absolute h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

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
    setDraft({
      minPrice: DEFAULT_MIN_PRICE,
      maxPrice: DEFAULT_MAX_PRICE,
      categories: [],
      metalTypes: [],
      metalPurities: [],
      gemstoneType: "",
    });
  };

  const minPercent =
    ((draft.minPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100;
  const maxPercent =
    ((draft.maxPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[474px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="px-6 pt-10">
            <div className="flex w-full items-center justify-between">
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">FILTERS</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filter panel"
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
            <div className="mt-7 h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-[22px]">
            <div className="flex w-full max-w-[424px] flex-col gap-6">
              <section className="flex flex-col gap-4">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  By Price Range
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="relative flex h-3 items-center">
                    <div className="absolute inset-x-0 h-[4px] rounded-[70px] bg-neutral300" aria-hidden />
                    <div
                      className="absolute h-[3px] rounded-[70px] bg-darkblack"
                      style={{
                        left: `${minPercent}%`,
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
                      className={cn(rangeThumbClassName, "z-20")}
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

              <section className="flex gap-6">
                <label className="flex min-w-0 flex-1 flex-col gap-2">
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
                      "h-14 w-full bg-[#F2F2F2] p-3 font-gill text-sm font-normal leading-110 text-darkblack outline-none",
                      minInputFocused && "border border-neutral500",
                    )}
                  />
                </label>
                <label className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="font-gill text-sm font-normal leading-110 text-darkblack">
                    Max Amount
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter"
                    value={
                      draft.maxPrice === DEFAULT_MAX_PRICE ? "" : formatCurrency(draft.maxPrice)
                    }
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        maxPrice: Math.max(
                          parseAmount(event.target.value) || DEFAULT_MAX_PRICE,
                          current.minPrice,
                        ),
                      }))
                    }
                    className="h-14 w-full bg-[#F2F2F2] p-3 font-gill text-sm font-normal leading-110 text-darkblack placeholder:text-neutral400 outline-none"
                  />
                </label>
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  By Categories:
                </h3>
                <div className="flex flex-col gap-3">
                  {filterCategoryRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap gap-[7px]">
                      {row.map((category) => {
                        const selected = draft.categories.includes(category);

                        return (
                          <button
                            key={category}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleListValue("categories", category)}
                            className="flex h-14 items-center justify-center gap-1 bg-[#F2F2F2] px-6 py-3 font-gill text-base leading-110 text-darkblack"
                          >
                            {selected ? (
                              <Check size={18} strokeWidth={1.5} aria-hidden className="shrink-0" />
                            ) : null}
                            <span className={selected ? "font-normal" : "font-light"}>{category}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  Metal Type:
                </h3>
                <div className="flex flex-wrap gap-[7px]">
                  {filterMetalTypeOptions.map((metalType) => {
                    const selected = draft.metalTypes.includes(metalType);

                    return (
                      <button
                        key={metalType}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleListValue("metalTypes", metalType)}
                        className={cn(
                          "flex h-14 items-center justify-center bg-[#F2F2F2] px-6 py-3 font-gill text-base leading-110 text-darkblack",
                          selected ? "font-normal" : "font-light",
                        )}
                      >
                        {metalType}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  Metal Purity:
                </h3>
                <div className="flex flex-wrap gap-[7px]">
                  {filterMetalPurityOptions.map((purity) => {
                    const selected = draft.metalPurities.includes(purity);

                    return (
                      <button
                        key={purity}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleListValue("metalPurities", purity)}
                        className={cn(
                          "flex h-14 items-center justify-center bg-[#F2F2F2] px-6 py-3 font-gill text-base leading-110 text-darkblack",
                          selected ? "font-normal" : "font-light",
                        )}
                      >
                        {purity}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-col gap-2 pb-6">
                <label htmlFor="filter-gemstone-type" className="font-gill text-base font-normal leading-110 text-darkblack">
                  Gemstone Type:
                </label>
                <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] p-3">
                  <select
                    id="filter-gemstone-type"
                    value={draft.gemstoneType}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, gemstoneType: event.target.value }))
                    }
                    className={cn(
                      "min-w-0 flex-1 appearance-none bg-transparent font-gill text-base leading-110 outline-none",
                      draft.gemstoneType ? "text-darkblack" : "text-neutral400",
                    )}
                  >
                    {filterGemstoneOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none shrink-0 text-darkblack"
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="shrink-0">
            <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
            <div className="flex gap-6 border-t border-neutral300/50 px-10 py-6">
              <button
                type="button"
                onClick={handleClearAll}
                className="btn-slide-up inline-flex h-14 min-w-0 flex-1 items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => onApply(draft)}
                className="btn-slide-up inline-flex h-14 min-w-0 flex-1 items-center justify-center bg-darkblack px-7 font-gill text-sm uppercase leading-110 text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default JewelleryFilterDrawer;
