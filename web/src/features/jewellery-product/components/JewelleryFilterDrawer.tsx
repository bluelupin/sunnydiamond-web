"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import FormFieldError from "@/shared/ui/FormFieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  chunkFilterOptions,
  createDefaultFilterState,
  createEmptyFilterState,
  getAvailableCategoryLabels,
  getAvailableMetalTypeLabels,
  getMaxAmountBelowMinError,
  hasFilterChanges,
  hasMagentoFilterFacets,
  isDefaultPriceRange,
  normalizeJewelleryPriceRange,
  parseJewelleryPriceInput,
} from "../data/filters";
import type { JewelleryFilterState } from "../types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";

interface JewelleryFilterDrawerProps {
  open: boolean;
  appliedFilters: JewelleryFilterState;
  facets: JewelleryFilterFacets;
  /** When set (category PLP), chips are subcategories and this is the section title. */
  categoryFilterHeading?: string | null;
  onClose: () => void;
  onApply: (filters: JewelleryFilterState) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const rangeThumbClassName =
  "pointer-events-none col-start-1 row-start-1 z-20 h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

const FilterChip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "flex h-14 items-center justify-center px-6 py-3 font-gill text-base leading-110 font-normal",
      selected ? "bg-gold300" : "bg-aboutInactive",
    )}
  >
    <span className={selected ? "text-darkblack" : "text-darkblack"}>{label}</span>
  </button>
);

function buildDrawerDraft(
  appliedFilters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
): JewelleryFilterState {
  return hasMagentoFilterFacets(facets)
    ? { ...createDefaultFilterState(facets), ...appliedFilters }
    : appliedFilters;
}

const JewelleryFilterDrawer = ({
  open,
  appliedFilters,
  facets,
  categoryFilterHeading,
  onClose,
  onApply,
}: JewelleryFilterDrawerProps) => {
  const [draft, setDraft] = useState<JewelleryFilterState>(() =>
    buildDrawerDraft(appliedFilters, facets),
  );
  const [minInputFocused, setMinInputFocused] = useState(false);
  const [maxInputFocused, setMaxInputFocused] = useState(false);
  const [maxInputValue, setMaxInputValue] = useState("");
  const wasOpenRef = useRef(false);

  const getMaxAmountDisplayValue = (
    maxPrice: number,
    minPrice: number,
    facetMax: number,
  ): string => {
    if (maxPrice === facetMax && minPrice !== maxPrice) {
      return "";
    }

    return formatCurrency(maxPrice);
  };

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;

    if (justOpened) {
      setDraft(buildDrawerDraft(appliedFilters, facets));
      setMaxInputFocused(false);
    } else if (open && hasMagentoFilterFacets(facets)) {
      // Facets can load after the drawer opens — refresh bounds without clearing selections.
      setDraft((current) => {
        const defaults = createDefaultFilterState(facets);

        return {
          ...current,
          minPrice: isDefaultPriceRange(current, facets) ? defaults.minPrice : current.minPrice,
          maxPrice: isDefaultPriceRange(current, facets) ? defaults.maxPrice : current.maxPrice,
        };
      });
    }

    wasOpenRef.current = open;
  }, [open, appliedFilters, facets]);

  useEffect(() => {
    if (maxInputFocused || getMaxAmountBelowMinError(draft.minPrice, maxInputValue)) {
      return;
    }

    setMaxInputValue(getMaxAmountDisplayValue(draft.maxPrice, draft.minPrice, facets.maxPrice));
  }, [draft.maxPrice, draft.minPrice, facets.maxPrice, maxInputFocused, maxInputValue]);

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

  const updatePriceRange = (minPrice: number, maxPrice: number) => {
    const normalized = normalizeJewelleryPriceRange(minPrice, maxPrice, facets);
    setDraft((current) => ({
      ...current,
      minPrice: normalized.minPrice,
      maxPrice: normalized.maxPrice,
    }));
  };

  const resolveDraftPriceRange = () => {
    const trimmedMax = maxInputValue.replace(/,/g, "").trim();
    const draftMax =
      trimmedMax === ""
        ? draft.maxPrice
        : parseJewelleryPriceInput(maxInputValue, facets.maxPrice);

    return normalizeJewelleryPriceRange(draft.minPrice, draftMax, facets);
  };

  const applyDraft = () => {
    if (getMaxAmountBelowMinError(draft.minPrice, maxInputValue)) {
      return;
    }

    const normalized = resolveDraftPriceRange();
    onApply({ ...draft, ...normalized });
    setMaxInputFocused(false);
    setMaxInputValue(
      getMaxAmountDisplayValue(normalized.maxPrice, normalized.minPrice, facets.maxPrice),
    );
  };

  const handleClearAll = () => {
    const cleared = hasMagentoFilterFacets(facets)
      ? createDefaultFilterState(facets)
      : createEmptyFilterState();
    setDraft(cleared);
    onApply(cleared);
  };

  const categoryOptions = getAvailableCategoryLabels(facets);
  const categoryRows = chunkFilterOptions(categoryOptions, 3);
  const metalTypeOptions = getAvailableMetalTypeLabels(facets);
  const metalPurityOptions = facets.metalPurities.map((option) => option.label);
  const hasPriceRange = facets.maxPrice > facets.minPrice;

  const minPercent = hasPriceRange
    ? ((draft.minPrice - facets.minPrice) / (facets.maxPrice - facets.minPrice)) * 100
    : 0;
  const maxPercent = hasPriceRange
    ? ((draft.maxPrice - facets.minPrice) / (facets.maxPrice - facets.minPrice)) * 100
    : 0;
  const maxAmountError = getMaxAmountBelowMinError(draft.minPrice, maxInputValue);
  const canApplyFilters = hasFilterChanges(draft, appliedFilters, facets) && !maxAmountError;

  const commitMaxAmountInput = () => {
    if (getMaxAmountBelowMinError(draft.minPrice, maxInputValue)) {
      setMaxInputFocused(false);
      return;
    }

    const trimmed = maxInputValue.replace(/,/g, "").trim();
    const nextMax =
      trimmed === "" ? facets.maxPrice : parseJewelleryPriceInput(maxInputValue, facets.maxPrice);
    const normalized = normalizeJewelleryPriceRange(draft.minPrice, nextMax, facets);

    setDraft((current) => ({
      ...current,
      minPrice: normalized.minPrice,
      maxPrice: normalized.maxPrice,
    }));
    setMaxInputFocused(false);
    setMaxInputValue(
      getMaxAmountDisplayValue(normalized.maxPrice, normalized.minPrice, facets.maxPrice),
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex max-md:flex-col max-md:overflow-hidden md:justify-end">
      <button
        type="button"
        aria-label="Close filters"
        className="min-h-0 flex-1 bg-[#1E1E1EBF] backdrop-blur-[3px] animate-in fade-in duration-300 max-md:min-h-12"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "flex min-h-0 flex-col bg-white shadow-2xl",
          "max-md:w-full max-md:max-h-[calc(100dvh-3rem)] max-md:overflow-hidden",
          "max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300",
          "md:h-full md:w-full md:max-w-[474px] md:shrink-0 md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        <div className="md:px-6 px-4 md:pt-10 pt-6">
          <div className="mx-auto flex h-[32px] w-full max-w-[424px] items-center justify-between">
            <h2 className="font-larken text-[24px] font-light leading-110 text-darkblack">Filters</h2>
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
          <div className="mx-auto mt-6 h-px w-full max-w-[424px] bg-neutral300" aria-hidden />
        </div>

        <div className="filter-drawer-scroll flex min-h-0 flex-1 flex-col overflow-y-auto md:px-6 px-4 pt-6">
          <div className="mx-auto flex w-full max-w-[424px] flex-col gap-[24px] pb-72">
            {hasPriceRange ? (
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
                      min={facets.minPrice}
                      max={facets.maxPrice}
                      step={500}
                      value={draft.minPrice}
                      onChange={(event) =>
                        updatePriceRange(Number(event.target.value), draft.maxPrice)
                      }
                      className={rangeThumbClassName}
                      aria-label="Minimum price"
                    />
                    <input
                      type="range"
                      min={facets.minPrice}
                      max={facets.maxPrice}
                      step={500}
                      value={draft.maxPrice}
                      onChange={(event) =>
                        updatePriceRange(draft.minPrice, Number(event.target.value))
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
            ) : null}

            {hasPriceRange &&
              <div className="space-y-4">
                <section className="flex gap-[24px]">
                  <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                    <span className="font-gill text-base font-normal leading-110 text-darkblack">
                      Min Amount
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatCurrency(draft.minPrice)}
                      onFocus={() => setMinInputFocused(true)}
                      onBlur={() => setMinInputFocused(false)}
                      onChange={(event) =>
                        updatePriceRange(
                          parseJewelleryPriceInput(event.target.value, facets.minPrice),
                          draft.maxPrice,
                        )
                      }
                      className={cn(
                        "h-14 w-full bg-aboutInactive p-[12px] font-gill text-sm font-normal leading-110 text-darkblack outline-none",
                        minInputFocused && "border border-neutral500",
                      )}
                    />
                  </label>
                  <label className="flex min-w-0 flex-1 flex-col gap-[8px]">
                    <span className="font-gill text-base font-normal leading-110 text-darkblack">
                      Max Amount
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter"
                      value={maxInputValue}
                      onFocus={() => {
                        setMaxInputFocused(true);
                        setMaxInputValue(
                          getMaxAmountDisplayValue(draft.maxPrice, draft.minPrice, facets.maxPrice),
                        );
                      }}
                      onBlur={commitMaxAmountInput}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setMaxInputValue(nextValue);

                        const trimmed = nextValue.replace(/,/g, "").trim();
                        if (!trimmed) {
                          return;
                        }

                        const parsed = Number(trimmed);
                        if (Number.isFinite(parsed)) {
                          const intendedMax = Math.max(0, Math.round(parsed));
                          if (intendedMax < Math.round(draft.minPrice)) {
                            return;
                          }
                          updatePriceRange(draft.minPrice, intendedMax);
                        }
                      }}
                      aria-invalid={Boolean(maxAmountError)}
                      aria-describedby={maxAmountError ? "jewellery-max-amount-error" : undefined}
                      className={cn(
                        "h-14 w-full bg-aboutInactive p-[12px] font-gill text-base font-normal leading-110 text-darkblack placeholder:text-neutral400 outline-none",
                        maxAmountError && "border border-[#F91616]",
                      )}
                    />
                  </label>
                </section>
                <FormFieldError id="jewellery-max-amount-error" message={maxAmountError ?? undefined} />
              </div>
            }

            {categoryOptions.length > 0 ? (
              <section className="flex flex-col gap-[16px]">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  {categoryFilterHeading ?? "By Categories:"}
                </h3>
                {categoryFilterHeading ? (
                  <div className="flex flex-wrap gap-[7px]">
                    {categoryOptions.map((category) => (
                      <FilterChip
                        key={category}
                        label={category}
                        selected={draft.categories.includes(category)}
                        onClick={() => toggleListValue("categories", category)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-[12px]">
                    {categoryRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex flex-wrap gap-[7px]">
                        {row.map((category) => (
                          <FilterChip
                            key={category}
                            label={category}
                            selected={draft.categories.includes(category)}
                            onClick={() => toggleListValue("categories", category)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : null}

            {metalTypeOptions.length > 0 ? (
              <section className="flex flex-col gap-[16px]">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  Metal Type:
                </h3>
                <div className="flex flex-wrap gap-[7px]">
                  {metalTypeOptions.map((metalType) => (
                    <FilterChip
                      key={metalType}
                      label={metalType}
                      selected={draft.metalTypes.includes(metalType)}
                      onClick={() => toggleListValue("metalTypes", metalType)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {metalPurityOptions.length > 0 ? (
              <section className="flex flex-col gap-[16px]">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  Metal Purity:
                </h3>
                <div className="flex flex-wrap gap-[7px]">
                  {metalPurityOptions.map((purity) => (
                    <FilterChip
                      key={purity}
                      label={purity}
                      selected={draft.metalPurities.includes(purity)}
                      onClick={() => toggleListValue("metalPurities", purity)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {facets.gemstoneTypes.length > 0 ? (
              <section className="flex flex-col gap-2">
                <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                  Gemstone Type:
                </p>
                <Select
                  value={draft.gemstoneType}
                  onValueChange={(gemstoneType) =>
                    setDraft((current) => ({ ...current, gemstoneType }))
                  }
                >
                  <SelectTrigger className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0">
                    <SelectValue placeholder="-select-" />
                  </SelectTrigger>
                  <SelectContent
                    className="z-[90]"
                    side="bottom"
                    align="start"
                    position="popper"
                    avoidCollisions={false}
                  >
                    {facets.gemstoneTypes.map((option) => (
                      <SelectItem key={option.label} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            ) : null}
          </div>
        </div>

        <PanelFooter
          className="max-md:pb-[env(safe-area-inset-bottom,0px)]"
          contentClassName="border-t-[0.5px] border-neutral300 px-0 py-6 lg:px-6 md:px-6 px-4"
        >
          <div className="flex w-full flex-col gap-4">
            <button
              type="button"
              onClick={applyDraft}
              disabled={!canApplyFilters}
              className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-[28px] py-[20px] font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="btn-border-slide inline-flex h-14 w-full items-center justify-center border-[0.8px] border-neutral300 px-[28px] py-[20px] font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              <span className="relative z-10">Clear All</span>
            </button>
          </div>
        </PanelFooter>
      </aside>
    </div>
  );
};

export default JewelleryFilterDrawer;
