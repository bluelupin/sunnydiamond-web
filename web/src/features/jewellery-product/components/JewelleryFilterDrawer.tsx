"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  filterCategoryOptions,
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

const JewelleryFilterDrawer = ({ open, filters, onClose, onApply }: JewelleryFilterDrawerProps) => {
  const [draft, setDraft] = useState<JewelleryFilterState>(filters);

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
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="absolute inset-y-0 right-0 w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray600/30">
          <h2 className="font-larken text-xl md:text-2xl text-darkblack uppercase tracking-[0%]">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter panel"
            className="p-2 text-darkblack hover:text-primary transition-colors"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <section>
            <h3 className="font-gill text-sm md:text-base text-darkblack font-normal tracking-[1%] mb-5">
              By Price Range
            </h3>
            <div className="relative h-2 bg-gray300 rounded-full mb-4">
              <div
                className="absolute h-full bg-darkblack rounded-full"
                style={{
                  left: `${((draft.minPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100}%`,
                  right: `${100 - ((draft.maxPrice - DEFAULT_MIN_PRICE) / (DEFAULT_MAX_PRICE - DEFAULT_MIN_PRICE)) * 100}%`,
                }}
                aria-hidden
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                className="w-full accent-darkblack"
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
                className="w-full accent-darkblack"
                aria-label="Maximum price"
              />
            </div>
            <div className="flex items-center justify-between font-gill text-sm text-darkblack/70 mb-4">
              <span>₹ {formatCurrency(draft.minPrice)}</span>
              <span>₹ {formatCurrency(draft.maxPrice)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="font-gill text-xs text-darkblack/70">Min Amount</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(draft.minPrice)}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      minPrice: parseAmount(event.target.value),
                    }))
                  }
                  className="w-full h-12 px-4 border border-darkblack font-gill text-sm text-darkblack focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="font-gill text-xs text-darkblack/70">Max Amount</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter"
                  value={draft.maxPrice ? formatCurrency(draft.maxPrice) : ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      maxPrice: parseAmount(event.target.value),
                    }))
                  }
                  className="w-full h-12 px-4 border border-gray600/40 bg-gray200/40 font-gill text-sm text-darkblack focus:outline-none"
                />
              </label>
            </div>
          </section>

          <section>
            <h3 className="font-gill text-sm md:text-base text-darkblack font-normal tracking-[1%] mb-4">
              By Categories:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterCategoryOptions.map((category) => {
                const selected = draft.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleListValue("categories", category)}
                    className={cn(
                      "h-12 px-4 bg-gray200 text-left font-gill text-sm text-darkblack flex items-center gap-2 transition-colors",
                      selected && "ring-1 ring-darkblack",
                    )}
                  >
                    {selected ? <Check size={14} aria-hidden /> : null}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="font-gill text-sm md:text-base text-darkblack font-normal tracking-[1%] mb-4">
              Metal Type:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterMetalTypeOptions.map((metalType) => {
                const selected = draft.metalTypes.includes(metalType);
                return (
                  <button
                    key={metalType}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleListValue("metalTypes", metalType)}
                    className={cn(
                      "h-12 px-4 bg-gray200 text-left font-gill text-sm text-darkblack transition-colors",
                      selected && "ring-1 ring-darkblack",
                    )}
                  >
                    {metalType}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="font-gill text-sm md:text-base text-darkblack font-normal tracking-[1%] mb-4">
              Metal Purity:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterMetalPurityOptions.map((purity) => {
                const selected = draft.metalPurities.includes(purity);
                return (
                  <button
                    key={purity}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleListValue("metalPurities", purity)}
                    className={cn(
                      "h-12 px-4 bg-gray200 text-left font-gill text-sm text-darkblack transition-colors",
                      selected && "ring-1 ring-darkblack",
                    )}
                  >
                    {purity}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-5 border-t border-gray600/30">
          <button
            type="button"
            onClick={handleClearAll}
            className="h-12 border border-darkblack font-gill text-sm uppercase tracking-[1.8%] text-darkblack hover:bg-gray200 transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-12 bg-darkblack font-gill text-sm uppercase tracking-[1.8%] text-white hover:bg-charcoal transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
};

export default JewelleryFilterDrawer;
