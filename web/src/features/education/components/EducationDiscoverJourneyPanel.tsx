"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { RIGHT_PANEL_HEADER_PADDING_CLASS, RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { categoryIconSrc } from "@/features/jewellery-product/data/categoryIcons";
import {
  createEmptyFilterState,
  getJewelleryPriceSliderStep,
  normalizeJewelleryPriceRange,
  parseJewelleryPriceInput,
} from "@/features/jewellery-product/data/filters";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import { mapMagentoCategoriesToPlpNav } from "@/features/jewellery-product/utils/plpCategoryNav";
import { DIAMOND_SHAPE_OPTIONS } from "@/features/jewellery-product/utils/diamondShapeListing";
import type { JewelleryCategory, JewelleryCategorySlug } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import { getMagentoJewelleryProducts } from "@/services/magento/products/products.service";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import { diamondShapeIconByValue } from "../data/diamondShapeIcons";
import {
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_CATEGORY_AND_RANGE_MESSAGE,
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_RANGE_MESSAGE,
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_SHAPE_CATEGORY_AND_RANGE_MESSAGE,
  DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS,
  resolveDiscoverJourneyStepLabels,
} from "../data/discoverJourney";
import { buildEducationJourneyHref } from "../utils/educationJourneyRoutes";
import EducationDiscoverJourneyStepper from "./EducationDiscoverJourneyStepper";

type EducationDiscoverJourneyPanelProps = {
  open: boolean;
  onClose: () => void;
  steps?: string[];
};

type JourneyStep = 1 | 2 | 3;

const FALLBACK_MAX_PRICE = 300_000;

const rangeThumbClassName =
  "pointer-events-none col-start-1 row-start-1 z-20 h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

function createFallbackFacets(): JewelleryFilterFacets {
  return {
    ...EMPTY_JEWELLERY_FILTER_FACETS,
    minPrice: 0,
    maxPrice: FALLBACK_MAX_PRICE,
  };
}

const EDUCATION_JOURNEY_MOBILE_QUERY = "(max-width: 767px)";

const EDUCATION_JOURNEY_OVERLAY_CLASS = "z-[100] bg-[#1E1E1EBF] backdrop-blur-[3px]";

const EDUCATION_JOURNEY_SHELL_CLASS =
  "z-[100] flex min-h-0 flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl";

const EducationDiscoverJourneyPanel = ({
  open,
  onClose,
  steps,
}: EducationDiscoverJourneyPanelProps) => {
  const router = useRouter();
  const { data: navData } = useMagentoJewelleryNav();
  const { showMobileShell } = useResponsiveOverlayShell(open, EDUCATION_JOURNEY_MOBILE_QUERY);

  const journeySteps = useMemo(() => resolveDiscoverJourneyStepLabels(steps), [steps]);

  const [step, setStep] = useState<JourneyStep>(1);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(createFallbackFacets);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(FALLBACK_MAX_PRICE);
  const [minInputValue, setMinInputValue] = useState("0");
  const [maxInputValue, setMaxInputValue] = useState(formatJewelleryPrice(FALLBACK_MAX_PRICE));
  const [minInputFocused, setMinInputFocused] = useState(false);
  const [maxInputFocused, setMaxInputFocused] = useState(false);
  const [categorySlug, setCategorySlug] = useState<JewelleryCategorySlug>("all");
  const [diamondShapeValue, setDiamondShapeValue] = useState(DIAMOND_SHAPE_OPTIONS[0]?.value ?? "");
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [isVerifyingAvailability, setIsVerifyingAvailability] = useState(false);

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
  const priceSliderStep = getJewelleryPriceSliderStep(facets);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setCategorySlug("all");
      setDiamondShapeValue(DIAMOND_SHAPE_OPTIONS[0]?.value ?? "");
      setShowAvailabilityError(false);
      setIsVerifyingAvailability(false);
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
        setMinInputValue(formatJewelleryPrice(nextFacets.minPrice));
        setMaxInputValue(formatJewelleryPrice(nextFacets.maxPrice));
      } catch {
        if (cancelled) return;
        const fallback = createFallbackFacets();
        setFacets(fallback);
        setMinPrice(fallback.minPrice);
        setMaxPrice(fallback.maxPrice);
        setMinInputValue(formatJewelleryPrice(fallback.minPrice));
        setMaxInputValue(formatJewelleryPrice(fallback.maxPrice));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (step === 1) {
      setShowAvailabilityError(false);
    }
  }, [minPrice, maxPrice, step]);

  useEffect(() => {
    if (step === 2) {
      setShowAvailabilityError(false);
    }
  }, [categorySlug, step]);

  useEffect(() => {
    if (step === 3) {
      setShowAvailabilityError(false);
    }
  }, [diamondShapeValue, step]);

  const updatePriceRange = (nextMin: number, nextMax: number) => {
    const normalized = normalizeJewelleryPriceRange(nextMin, nextMax, facets);
    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    if (!minInputFocused) {
      setMinInputValue(formatJewelleryPrice(normalized.minPrice));
    }
    if (!maxInputFocused) {
      setMaxInputValue(formatJewelleryPrice(normalized.maxPrice));
    }
  };

  const commitMinAmountInput = () => {
    const trimmed = minInputValue.replace(/,/g, "").trim();
    const nextMin =
      trimmed === "" ? facets.minPrice : parseJewelleryPriceInput(minInputValue, facets.minPrice);
    const normalized = normalizeJewelleryPriceRange(nextMin, maxPrice, facets);

    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    setMinInputValue(formatJewelleryPrice(normalized.minPrice));
    setMaxInputValue(formatJewelleryPrice(normalized.maxPrice));
    setMinInputFocused(false);
  };

  const commitMaxAmountInput = () => {
    const trimmed = maxInputValue.replace(/,/g, "").trim();
    const nextMax =
      trimmed === "" ? facets.maxPrice : parseJewelleryPriceInput(maxInputValue, facets.maxPrice);
    const normalized = normalizeJewelleryPriceRange(minPrice, nextMax, facets);

    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    setMinInputValue(formatJewelleryPrice(normalized.minPrice));
    setMaxInputValue(formatJewelleryPrice(normalized.maxPrice));
    setMaxInputFocused(false);
  };

  const commitPriceRangeForProceed = () => {
    const trimmedMin = minInputValue.replace(/,/g, "").trim();
    const trimmedMax = maxInputValue.replace(/,/g, "").trim();
    const nextMin =
      trimmedMin === "" ? facets.minPrice : parseJewelleryPriceInput(minInputValue, facets.minPrice);
    const nextMax =
      trimmedMax === "" ? facets.maxPrice : parseJewelleryPriceInput(maxInputValue, facets.maxPrice);
    const normalized = normalizeJewelleryPriceRange(nextMin, nextMax, facets);

    setMinPrice(normalized.minPrice);
    setMaxPrice(normalized.maxPrice);
    setMinInputValue(formatJewelleryPrice(normalized.minPrice));
    setMaxInputValue(formatJewelleryPrice(normalized.maxPrice));
    setMinInputFocused(false);
    setMaxInputFocused(false);

    return normalized;
  };

  const verifyProductsAvailable = async (
    range: { minPrice: number; maxPrice: number },
    categoryUrlKey: string | null,
    diamondShape = "",
  ): Promise<boolean> => {
    const data = await getMagentoJewelleryProducts({
      page: 1,
      pageSize: 1,
      categoryUrlKey,
      filters: {
        ...createEmptyFilterState(),
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
        diamondShape: diamondShape.trim(),
      },
      facets,
      includeFacets: false,
    });

    return data.totalCount > 0;
  };

  const availabilityErrorMessage =
    step === 3
      ? DISCOVER_JOURNEY_NO_PRODUCTS_IN_SHAPE_CATEGORY_AND_RANGE_MESSAGE
      : step === 2
        ? DISCOVER_JOURNEY_NO_PRODUCTS_IN_CATEGORY_AND_RANGE_MESSAGE
        : DISCOVER_JOURNEY_NO_PRODUCTS_IN_RANGE_MESSAGE;

  const handleBack = () => {
    if (step === 1) {
      onClose();
      return;
    }
    setStep((current) => (current === 3 ? 2 : 1));
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      if (isVerifyingAvailability || !hasPriceRange) {
        return;
      }

      setIsVerifyingAvailability(true);
      setShowAvailabilityError(false);

      void (async () => {
        try {
          const range = commitPriceRangeForProceed();
          const hasProducts = await verifyProductsAvailable(range, null);

          if (!hasProducts) {
            setShowAvailabilityError(true);
            return;
          }

          setShowAvailabilityError(false);
          setStep(2);
        } catch {
          setShowAvailabilityError(true);
        } finally {
          setIsVerifyingAvailability(false);
        }
      })();

      return;
    }

    if (step === 2) {
      if (isVerifyingAvailability) {
        return;
      }

      setIsVerifyingAvailability(true);
      setShowAvailabilityError(false);

      void (async () => {
        try {
          const categoryUrlKey = selectedCategory?.urlKey ?? null;
          const hasProducts = await verifyProductsAvailable(
            { minPrice, maxPrice },
            categoryUrlKey,
          );

          if (!hasProducts) {
            setShowAvailabilityError(true);
            return;
          }

          setShowAvailabilityError(false);
          setStep(3);
        } catch {
          setShowAvailabilityError(true);
        } finally {
          setIsVerifyingAvailability(false);
        }
      })();

      return;
    }

    if (isVerifyingAvailability) {
      return;
    }

    setIsVerifyingAvailability(true);
    setShowAvailabilityError(false);

    void (async () => {
      try {
        const categoryUrlKey = selectedCategory?.urlKey ?? null;
        const hasProducts = await verifyProductsAvailable(
          { minPrice, maxPrice },
          categoryUrlKey,
          diamondShapeValue,
        );

        if (!hasProducts) {
          setShowAvailabilityError(true);
          return;
        }

        const href = buildEducationJourneyHref({
          categoryUrlKey,
          minPrice,
          maxPrice,
          diamondShapeLabel: selectedShape?.label ?? "",
        });

        setShowAvailabilityError(false);
        onClose();
        router.push(href);
      } catch {
        setShowAvailabilityError(true);
      } finally {
        setIsVerifyingAvailability(false);
      }
    })();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const panelBody = (
    <>
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar">
        <div className={RIGHT_PANEL_HEADER_PADDING_CLASS}>
          <div className="mx-auto flex w-full items-center justify-between gap-3">
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
            <RightPanelCloseButton
              onClick={onClose}
              aria-label="Close discover journey panel"
            />
          </div>
          {/* <div
            className={cn("mx-auto mt-6 h-px w-full bg-neutral300", DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS)}
            aria-hidden
          /> */}
          <div className={cn("mx-auto mt-6 w-full", DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS)}>
            <EducationDiscoverJourneyStepper steps={journeySteps} activeStep={step} />
          </div>
        </div>

        <div
          className={cn(
            "mx-auto flex w-full flex-col gap-6 pb-6 pt-6 md:px-0 px-4",
            DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS,
          )}
        >
          {step === 1 && hasPriceRange ? (
            <section className="flex flex-col gap-6">
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
                  step={priceSliderStep}
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
                  step={priceSliderStep}
                  value={maxPrice}
                  onChange={(event) =>
                    updatePriceRange(minPrice, Number(event.target.value))
                  }
                  className={cn(rangeThumbClassName, "z-30")}
                  aria-label="Maximum price"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex min-w-0 flex-1">
                  <span className="sr-only">Minimum price</span>
                  <span
                    className={cn(
                      "flex h-14 w-full items-center gap-1 bg-aboutInactive px-3 font-gill text-sm font-normal leading-110 text-darkblack",
                      minInputFocused && "border border-neutral500",
                    )}
                  >
                    <span aria-hidden>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        minInputFocused ? minInputValue : formatJewelleryPrice(minPrice)
                      }
                      onFocus={() => {
                        setMinInputFocused(true);
                        setMinInputValue(formatJewelleryPrice(minPrice));
                      }}
                      onBlur={commitMinAmountInput}
                      onChange={(event) => {
                        const nextValue = event.target.value;
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
                <span className="shrink-0 font-gill text-sm font-light leading-110 text-darkblack" aria-hidden>
                  —
                </span>
                <label className="flex min-w-0 flex-1">
                  <span className="sr-only">Maximum price</span>
                  <span
                    className={cn(
                      "flex h-14 w-full items-center gap-1 bg-aboutInactive px-3 font-gill text-sm font-normal leading-110 text-darkblack",
                      maxInputFocused && "border border-neutral500",
                    )}
                  >
                    <span aria-hidden>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        maxInputFocused ? maxInputValue : formatJewelleryPrice(maxPrice)
                      }
                      onFocus={() => {
                        setMaxInputFocused(true);
                        setMaxInputValue(formatJewelleryPrice(maxPrice));
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
                          updatePriceRange(minPrice, Math.max(0, Math.round(parsed)));
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                  </span>
                </label>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="flex flex-col gap-4">
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
                      <Icon
                        className={cn(
                          "size-6",
                          isSelected ? "text-darkblack" : "text-gray600",
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "font-gill text-base leading-110",
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
            </section>
          ) : null}

          {step === 3 ? (
            <section className="flex flex-col gap-4">
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
                      {Icon ? (
                        <Icon
                          className={cn(
                            "size-6",
                            isSelected ? "text-darkblack" : "text-gray600",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "font-gill text-base leading-110",
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
            </section>
          ) : null}
        </div>
      </div>

      {showAvailabilityError ? (
        <div role="alert" className="md:mx-6 mx-4 shrink-0 bg-yellow100 px-4 md:h-12 h-10 flex items-center justify-start md:px-6 lg:px-6 md:mb-[15px] mb-[52px]">
          <div
            className={cn(
              "mx-auto flex w-full flex-nowrap items-center gap-2",
              DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS,
            )}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0 text-darkblack" >
              <path d="M11.25 11.25C11.4489 11.25 11.6397 11.329 11.7803 11.4697C11.921 11.6103 12 11.8011 12 12V15.75C12 15.9489 12.079 16.1397 12.2197 16.2803C12.3603 16.421 12.5511 16.5 12.75 16.5" stroke="#0A0A0A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.625 8.8125C12.1428 8.8125 12.5625 8.39277 12.5625 7.875C12.5625 7.35723 12.1428 6.9375 11.625 6.9375C11.1072 6.9375 10.6875 7.35723 10.6875 7.875C10.6875 8.39277 11.1072 8.8125 11.625 8.8125Z" fill="#0A0A0A" />
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#0A0A0A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-gill text-base font-normal leading-110 text-[#121212]">
              {availabilityErrorMessage}
            </p>
          </div>
        </div>
      ) : null}

      <PanelFooter showGradient={false}
        className="max-md:pb-[env(safe-area-inset-bottom,0px)]"
        contentClassName="border-t-[0.5px] border-neutral300 px-0 py-6 lg:px-6 md:px-6 px-4"
      >
        <div
          className={cn(
            "mx-auto flex w-full flex-col gap-4",
            DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS,
          )}
        >
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={
              isVerifyingAvailability || (step === 1 && !hasPriceRange)
            }
            className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:border-neutral300 disabled:bg-neutral300 disabled:text-white disabled:opacity-100"
          >
            <span className="relative z-10">
              {isVerifyingAvailability
                ? "Checking..."
                : step === 3
                  ? "View Products"
                  : "Proceed"}
            </span>
          </button>
        </div>
      </PanelFooter>
    </>
  );

  if (showMobileShell) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent
          overlayClassName={EDUCATION_JOURNEY_OVERLAY_CLASS}
          className={cn(
            EDUCATION_JOURNEY_SHELL_CLASS,
            "mt-12 max-h-[calc(100dvh-3rem)] w-full rounded-none [&>div:first-child]:hidden",
          )}
        >
          <DrawerTitle className="sr-only">Discover Your Piece</DrawerTitle>
          {panelBody}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName={EDUCATION_JOURNEY_OVERLAY_CLASS}
        className={cn(
          EDUCATION_JOURNEY_SHELL_CLASS,
          "h-dvh max-h-dvh w-full",
          RIGHT_PANEL_WIDTH_CLASS,
          "data-[state=open]:duration-300 data-[state=closed]:duration-300",
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Discover Your Piece</SheetTitle>
        {panelBody}
      </SheetContent>
    </Sheet>
  );
};

export default EducationDiscoverJourneyPanel;
