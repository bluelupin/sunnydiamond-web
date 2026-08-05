"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, TriangleAlert } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { categoryIconSrc } from "@/features/jewellery-product/data/categoryIcons";
import {
  createEmptyFilterState,
  normalizeJewelleryPriceRange,
  parseJewelleryPriceInput,
} from "@/features/jewellery-product/data/filters";
import { mapMagentoCategoriesToPlpNav } from "@/features/jewellery-product/utils/plpCategoryNav";
import { DIAMOND_SHAPE_OPTIONS } from "@/features/jewellery-product/utils/diamondShapeListing";
import type { JewelleryCategory, JewelleryCategorySlug } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import { getMagentoJewelleryProducts } from "@/services/magento/products/products.service";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import { diamondShapeIconByValue } from "../data/diamondShapeIcons";
import { buildEducationJourneyHref } from "../utils/educationJourneyRoutes";

type EducationDiscoverJourneyPanelProps = {
  open: boolean;
  onClose: () => void;
};

type JourneyStep = 1 | 2 | 3;

const FALLBACK_MAX_PRICE = 300_000;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const rangeThumbClassName =
  "pointer-events-none col-start-1 row-start-1 z-20 h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

const STEP_COPY: Record<JourneyStep, string> = {
  1: "Step 1. Define your price range",
  2: "Step 2. Choose your jewellery type",
  3: "Step 3. Pick your preferred diamond shape",
};

function createFallbackFacets(): JewelleryFilterFacets {
  return {
    ...EMPTY_JEWELLERY_FILTER_FACETS,
    minPrice: 0,
    maxPrice: FALLBACK_MAX_PRICE,
  };
}

const EducationDiscoverJourneyPanel = ({ open, onClose }: EducationDiscoverJourneyPanelProps) => {
  const router = useRouter();
  const { data: navData } = useMagentoJewelleryNav();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<JourneyStep>(1);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(createFallbackFacets);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(FALLBACK_MAX_PRICE);
  const [minInputValue, setMinInputValue] = useState("0");
  const [maxInputValue, setMaxInputValue] = useState(formatCurrency(FALLBACK_MAX_PRICE));
  const [minInputFocused, setMinInputFocused] = useState(false);
  const [maxInputFocused, setMaxInputFocused] = useState(false);
  const [categorySlug, setCategorySlug] = useState<JewelleryCategorySlug>("all");
  const [diamondShapeValue, setDiamondShapeValue] = useState(DIAMOND_SHAPE_OPTIONS[0]?.value ?? "");
  const [hasProducts, setHasProducts] = useState(true);
  const [isCheckingProducts, setIsCheckingProducts] = useState(false);

  const categories = useMemo(
    () => (navData?.categories ? mapMagentoCategoriesToPlpNav(navData.categories) : []),
    [navData?.categories],
  );

  const selectedCategory: JewelleryCategory | undefined = useMemo(
    () => categories.find((category) => category.slug === categorySlug) ?? categories[0],
    [categories, categorySlug],
  );

  const selectedShape = useMemo(
    () =>
      DIAMOND_SHAPE_OPTIONS.find((option) => option.value === diamondShapeValue) ??
      DIAMOND_SHAPE_OPTIONS[0],
    [diamondShapeValue],
  );

  const hasPriceRange = facets.maxPrice > facets.minPrice;
  const priceSpan = Math.max(facets.maxPrice - facets.minPrice, 1);
  const minPercent = ((minPrice - facets.minPrice) / priceSpan) * 100;
  const maxPercent = ((maxPrice - facets.minPrice) / priceSpan) * 100;
  const canProceedFromPrice = hasProducts && !isCheckingProducts;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!open) {
      setStep(1);
      setCategorySlug("all");
      setDiamondShapeValue(DIAMOND_SHAPE_OPTIONS[0]?.value ?? "");
      setHasProducts(true);
      setIsCheckingProducts(false);
      setMinInputFocused(false);
      setMaxInputFocused(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const data = await getMagentoJewelleryProducts({
          page: 1,
          pageSize: 1,
          filters: createEmptyFilterState(),
          includeFacets: true,
        });

        if (cancelled) return;

        const nextFacets =
          data.facets.maxPrice > data.facets.minPrice ? data.facets : createFallbackFacets();

        setFacets(nextFacets);
        setMinPrice(nextFacets.minPrice);
        setMaxPrice(nextFacets.maxPrice);
        setMinInputValue(formatCurrency(nextFacets.minPrice));
        setMaxInputValue(formatCurrency(nextFacets.maxPrice));
        setHasProducts(data.totalCount > 0);
      } catch {
        if (cancelled) return;
        const fallback = createFallbackFacets();
        setFacets(fallback);
        setMinPrice(fallback.minPrice);
        setMaxPrice(fallback.maxPrice);
        setMinInputValue(formatCurrency(fallback.minPrice));
        setMaxInputValue(formatCurrency(fallback.maxPrice));
        setHasProducts(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || step !== 1 || !hasPriceRange) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setIsCheckingProducts(true);

      void (async () => {
        try {
          const data = await getMagentoJewelleryProducts({
            page: 1,
            pageSize: 1,
            filters: {
              ...createEmptyFilterState(),
              minPrice,
              maxPrice,
            },
            facets,
            includeFacets: false,
          });

          if (!cancelled) {
            setHasProducts(data.totalCount > 0);
          }
        } catch {
          if (!cancelled) {
            setHasProducts(true);
          }
        } finally {
          if (!cancelled) {
            setIsCheckingProducts(false);
          }
        }
      })();
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, step, minPrice, maxPrice, facets, hasPriceRange]);

  const updatePriceRange = (nextMin: number, nextMax: number) => {
    const normalized = normalizeJewelleryPriceRange(nextMin, nextMax, facets);
    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    if (!minInputFocused) {
      setMinInputValue(formatCurrency(normalized.minPrice));
    }
    if (!maxInputFocused) {
      setMaxInputValue(formatCurrency(normalized.maxPrice));
    }
  };

  const commitMinAmountInput = () => {
    const trimmed = minInputValue.replace(/,/g, "").trim();
    const nextMin =
      trimmed === "" ? facets.minPrice : parseJewelleryPriceInput(minInputValue, facets.minPrice);
    const normalized = normalizeJewelleryPriceRange(nextMin, maxPrice, facets);

    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    setMinInputValue(formatCurrency(normalized.minPrice));
    setMaxInputValue(formatCurrency(normalized.maxPrice));
    setMinInputFocused(false);
  };

  const commitMaxAmountInput = () => {
    const trimmed = maxInputValue.replace(/,/g, "").trim();
    const nextMax =
      trimmed === "" ? facets.maxPrice : parseJewelleryPriceInput(maxInputValue, facets.maxPrice);
    const normalized = normalizeJewelleryPriceRange(minPrice, nextMax, facets);

    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    setMinInputValue(formatCurrency(normalized.minPrice));
    setMaxInputValue(formatCurrency(normalized.maxPrice));
    setMaxInputFocused(false);
  };

  const handleBack = () => {
    if (step === 1) {
      onClose();
      return;
    }
    setStep((current) => (current === 3 ? 2 : 1));
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      if (!canProceedFromPrice) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    const href = buildEducationJourneyHref({
      categoryUrlKey: selectedCategory?.urlKey ?? null,
      minPrice,
      maxPrice,
      diamondShapeLabel: selectedShape?.label ?? "",
    });

    onClose();
    router.push(href);
  };

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex max-md:flex-col max-md:overflow-hidden md:justify-end">
      <button
        type="button"
        aria-label="Close discover journey"
        className="min-h-0 flex-1 bg-[#1E1E1EBF] backdrop-blur-[3px] animate-in fade-in duration-300 max-md:min-h-12"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Discover Your Piece"
        className={cn(
          "flex min-h-0 flex-col bg-white shadow-2xl",
          "max-md:w-full max-md:max-h-[calc(100dvh-3rem)] max-md:overflow-hidden",
          "max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300",
          "md:h-full md:w-full md:max-w-[440px] md:shrink-0 md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        <div className="md:px-6 px-4 md:pt-10 pt-6">
          <div className="mx-auto flex h-8 w-full max-w-[392px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Go back"
                  className="inline-flex size-8 shrink-0 items-center justify-center text-darkblack"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
              ) : null}
              <h2 className="truncate font-larken text-2xl font-light leading-110 text-darkblack">
                Discover Your Piece
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close discover journey panel"
              className="inline-flex size-8 shrink-0 items-center justify-center"
            >
              <Image
                src="/images/jewellery/filter-drawer-close.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden
                className="size-8 object-contain"
              />
            </button>
          </div>
          <div className="mx-auto mt-6 h-px w-full max-w-[392px] bg-neutral300" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:px-6 px-4 pt-6">
          <div className="mx-auto flex w-full max-w-[392px] flex-col gap-8 pb-72">
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              {STEP_COPY[step]}
            </p>

            {step === 1 && hasPriceRange ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="grid h-3 grid-cols-1 grid-rows-1 items-center">
                    <div
                      className="col-start-1 row-start-1 h-1 rounded-[70px] bg-neutral300"
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
                      value={minPrice}
                      onChange={(event) =>
                        updatePriceRange(Number(event.target.value), maxPrice)
                      }
                      className={rangeThumbClassName}
                      aria-label="Minimum price"
                    />
                    <input
                      type="range"
                      min={facets.minPrice}
                      max={facets.maxPrice}
                      step={500}
                      value={maxPrice}
                      onChange={(event) =>
                        updatePriceRange(minPrice, Number(event.target.value))
                      }
                      className={cn(rangeThumbClassName, "z-30")}
                      aria-label="Maximum price"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex min-w-0 flex-1 flex-col">
                    <span className="sr-only">Minimum price</span>
                    <span
                      className={cn(
                        "flex h-14 items-center gap-1 bg-aboutInactive px-3 font-gill text-sm font-normal leading-110 text-darkblack",
                        minInputFocused && "border border-neutral500",
                      )}
                    >
                      <span aria-hidden>₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={minInputFocused ? minInputValue : formatCurrency(minPrice)}
                        onFocus={() => {
                          setMinInputFocused(true);
                          setMinInputValue(String(minPrice));
                        }}
                        onBlur={commitMinAmountInput}
                        onChange={(event) => {
                          const nextValue = event.target.value.replace(/[^\d,]/g, "");
                          setMinInputValue(nextValue);

                          const trimmed = nextValue.replace(/,/g, "").trim();
                          if (!trimmed) {
                            return;
                          }

                          const parsed = Number(trimmed);
                          if (Number.isFinite(parsed)) {
                            updatePriceRange(Math.max(0, Math.round(parsed)), maxPrice);
                          }
                        }}
                        className="min-w-0 flex-1 bg-transparent outline-none"
                      />
                    </span>
                  </label>
                  <label className="flex min-w-0 flex-1 flex-col">
                    <span className="sr-only">Maximum price</span>
                    <span
                      className={cn(
                        "flex h-14 items-center gap-1 bg-aboutInactive px-3 font-gill text-sm font-normal leading-110 text-darkblack",
                        maxInputFocused && "border border-neutral500",
                      )}
                    >
                      <span aria-hidden>₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={maxInputFocused ? maxInputValue : formatCurrency(maxPrice)}
                        onFocus={() => {
                          setMaxInputFocused(true);
                          setMaxInputValue(String(maxPrice));
                        }}
                        onBlur={commitMaxAmountInput}
                        onChange={(event) => {
                          const nextValue = event.target.value.replace(/[^\d,]/g, "");
                          setMaxInputValue(nextValue);

                          const trimmed = nextValue.replace(/,/g, "").trim();
                          if (!trimmed) {
                            return;
                          }

                          const parsed = Number(trimmed);
                          if (Number.isFinite(parsed)) {
                            updatePriceRange(minPrice, Math.max(0, Math.round(parsed)));
                          }
                        }}
                        className="min-w-0 flex-1 bg-transparent outline-none"
                      />
                    </span>
                  </label>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                {(categories.length > 0
                  ? categories
                  : [{ slug: "all" as const, label: "All", urlKey: null }]
                ).map((category) => {
                  const isSelected = category.slug === categorySlug;
                  const Icon = categoryIconSrc[category.slug];

                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => setCategorySlug(category.slug)}
                      aria-pressed={isSelected}
                      className="flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                    >
                      <span
                        className={cn(
                          "flex size-14 items-center justify-center rounded-full",
                          isSelected ? "bg-aboutInactive" : "bg-transparent",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-10",
                            isSelected ? "text-darkblack" : "text-gray600",
                          )}
                          aria-hidden
                        />
                      </span>
                      <span
                        className={cn(
                          "font-gill text-sm leading-110",
                          isSelected
                            ? "font-semibold text-darkblack"
                            : "font-normal text-gray600",
                        )}
                      >
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                {DIAMOND_SHAPE_OPTIONS.map((option) => {
                  const isSelected = option.value === diamondShapeValue;
                  const Icon = diamondShapeIconByValue[option.value];

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDiamondShapeValue(option.value)}
                      aria-pressed={isSelected}
                      className="flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                    >
                      <span className="flex size-14 items-center justify-center">
                        {Icon ? (
                          <Icon
                            className={cn(
                              "size-10",
                              isSelected ? "text-darkblack" : "text-gray600",
                            )}
                          />
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          "font-gill text-sm leading-110",
                          isSelected
                            ? "font-semibold text-darkblack"
                            : "font-normal text-gray600",
                        )}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <PanelFooter
          className="max-md:pb-[env(safe-area-inset-bottom,0px)]"
          contentClassName="border-t-[0.5px] border-neutral300 px-0 py-6 lg:px-6 md:px-6 px-4"
        >
          <div className="mx-auto flex w-full max-w-[392px] flex-col gap-4">
            {step === 1 && !hasProducts ? (
              <div
                role="status"
                className="flex items-center gap-2 bg-yellow100 px-3 py-3 font-gill text-sm font-normal leading-110 text-darkblack"
              >
                <TriangleAlert className="size-4 shrink-0 text-yellow600" aria-hidden />
                <span>No products found for this price range.</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={step === 1 && !canProceedFromPrice}
              className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:border-neutral300 disabled:bg-neutral300 disabled:text-white disabled:opacity-100"
            >
              <span className="relative z-10">{step === 3 ? "View Products" : "Proceed"}</span>
            </button>
          </div>
        </PanelFooter>
      </aside>
    </div>,
    document.body,
  );
};

export default EducationDiscoverJourneyPanel;
