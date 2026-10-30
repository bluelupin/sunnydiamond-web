"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  getJewelleryPriceSliderStep,
  normalizeJewelleryPriceRange,
  parseJewelleryPriceInput,
} from "@/features/jewellery-product/data/filters";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import { mapMagentoCategoriesToPlpNav } from "@/features/jewellery-product/utils/plpCategoryNav";
import { slugifyDiamondShapeLabel } from "@/features/jewellery-product/utils/diamondShapeListing";
import type { JewelleryCategory, JewelleryCategorySlug } from "@/features/jewellery-product/types";
import type {
  JewelleryFilterFacetOption,
  JewelleryFilterFacets,
} from "@/types/magento/jewelleryListing";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import { getMagentoProductAttributeOptions } from "@/services/magento/products/productAttributeOptions.service";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import { resolveDiscoverJourneyDiamondShapeIcon } from "../data/diamondShapeIcons";
import {
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_CATEGORY_AND_RANGE_MESSAGE,
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_RANGE_MESSAGE,
  DISCOVER_JOURNEY_NO_PRODUCTS_IN_SHAPE_CATEGORY_AND_RANGE_MESSAGE,
  DISCOVER_JOURNEY_PANEL_CONTENT_MAX_CLASS,
  MAGENTO_DIAMOND_SHAPE_ATTRIBUTE_CODE,
  normalizeDiscoverJourneyDiamondShapeOptions,
  resolveDiscoverJourneySteps,
} from "../data/discoverJourney";
import type { NormalizedEducationDiscoverStep } from "@/services/education/learn-about-diamonds-page.types";
import {
  discoverJourneyHasMatchingProducts,
  getDiscoverJourneyListingFacets,
  isDiscoverJourneyAbortError,
  peekDiscoverJourneyListingFacets,
  prefetchDiscoverJourneyCategoryFacets,
  primeDiscoverJourneyListingFacetCache,
  type DiscoverJourneyPriceRange,
} from "../utils/discoverJourneyAvailability";
import { buildEducationJourneyHref } from "../utils/educationJourneyRoutes";
import {
  EducationDiscoverJourneyStep1PriceSkeleton,
  EducationDiscoverJourneyStep2CategorySkeleton,
  EducationDiscoverJourneyStep3ShapeSkeleton,
} from "./skeletons/EducationDiscoverJourneyStepSkeletons";
import EducationDiscoverJourneyStepper from "./EducationDiscoverJourneyStepper";

type EducationDiscoverJourneyPanelProps = {
  open: boolean;
  onClose: () => void;
  steps?: NormalizedEducationDiscoverStep[];
};

type JourneyStep = 1 | 2 | 3;

/** Digits and grouping commas only — matches jewellery price fields elsewhere. */
function sanitizeDiscoverJourneyPriceInput(value: string): string {
  return value.replace(/[^\d,]/g, "");
}

const rangeThumbClassName =
  "pointer-events-none col-start-1 row-start-1 z-20 h-[12px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-darkblack [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-darkblack";

function createEmptyDiscoverJourneyPriceFacets(): JewelleryFilterFacets {
  return { ...EMPTY_JEWELLERY_FILTER_FACETS };
}

function isValidDiscoverJourneyPriceFacets(facets: JewelleryFilterFacets): boolean {
  return facets.maxPrice > facets.minPrice;
}

type DiscoverJourneyPriceRangeSetters = {
  setFacets: (facets: JewelleryFilterFacets) => void;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setMinInputValue: (value: string) => void;
  setMaxInputValue: (value: string) => void;
  setPriceFacetsLoadState: (state: "idle" | "loading" | "ready" | "error") => void;
};

function resetDiscoverJourneyPriceRangeState(setters: DiscoverJourneyPriceRangeSetters): void {
  const empty = createEmptyDiscoverJourneyPriceFacets();
  setters.setFacets(empty);
  setters.setMinPrice(empty.minPrice);
  setters.setMaxPrice(empty.maxPrice);
  setters.setMinInputValue(formatJewelleryPrice(empty.minPrice));
  setters.setMaxInputValue(formatJewelleryPrice(empty.maxPrice));
}

function applyDiscoverJourneyPriceRangeFromFacets(
  nextFacets: JewelleryFilterFacets,
  setters: DiscoverJourneyPriceRangeSetters,
): void {
  setters.setFacets(nextFacets);
  primeDiscoverJourneyListingFacetCache(null, nextFacets);
  setters.setMinPrice(nextFacets.minPrice);
  setters.setMaxPrice(nextFacets.maxPrice);
  setters.setMinInputValue(formatJewelleryPrice(nextFacets.minPrice));
  setters.setMaxInputValue(formatJewelleryPrice(nextFacets.maxPrice));
  setters.setPriceFacetsLoadState("ready");
}

/** Lets React commit loading UI before a sync PLP cache hit resolves the proceed check. */
function waitForDiscoverJourneyProceedPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

/**
 * Default catalogue range reuses the PLP listing cache and can finish in one frame;
 * custom ranges usually miss cache and feel slower. Keep Checking… visible long enough
 * to read on every Step 1 proceed without delaying slow network responses.
 */
const DISCOVER_JOURNEY_STEP1_CHECKING_MIN_MS = 400;

async function waitForDiscoverJourneyMinimumCheckingDuration(startedAtMs: number): Promise<void> {
  const remaining = DISCOVER_JOURNEY_STEP1_CHECKING_MIN_MS - (Date.now() - startedAtMs);
  if (remaining <= 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, remaining);
  });
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
  const { data: navData, isLoading: isJewelleryNavLoading } = useMagentoJewelleryNav();
  const { showMobileShell } = useResponsiveOverlayShell(open, EDUCATION_JOURNEY_MOBILE_QUERY);

  const journeySteps = useMemo(() => resolveDiscoverJourneySteps(steps), [steps]);

  const [step, setStep] = useState<JourneyStep>(1);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(createEmptyDiscoverJourneyPriceFacets);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minInputValue, setMinInputValue] = useState("0");
  const [maxInputValue, setMaxInputValue] = useState("0");
  const [priceFacetsLoadState, setPriceFacetsLoadState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [minInputFocused, setMinInputFocused] = useState(false);
  const [maxInputFocused, setMaxInputFocused] = useState(false);
  const [categorySlug, setCategorySlug] = useState<JewelleryCategorySlug>("all");
  const [diamondShapeValue, setDiamondShapeValue] = useState("");
  const [diamondShapeOptions, setDiamondShapeOptions] = useState<
    readonly JewelleryFilterFacetOption[]
  >([]);
  const [diamondShapesLoadState, setDiamondShapesLoadState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [isVerifyingAvailability, setIsVerifyingAvailability] = useState(false);
  const [isCheckingStep2Category, setIsCheckingStep2Category] = useState(false);
  const [step2CategoryHasProducts, setStep2CategoryHasProducts] = useState<boolean | null>(
    null,
  );
  const [isCheckingStep3Shape, setIsCheckingStep3Shape] = useState(false);
  const [step3ShapeHasProducts, setStep3ShapeHasProducts] = useState<boolean | null>(null);
  const [categoryListingFacets, setCategoryListingFacets] =
    useState<JewelleryFilterFacets | null>(null);
  const step2CategoryVerifyRequestRef = useRef(0);
  const step3ShapeVerifyRequestRef = useRef(0);
  const step1ProceedInFlightRef = useRef(false);
  const step1ProceedRequestRef = useRef(0);
  const committedDiscoverJourneyPriceRangeRef = useRef<DiscoverJourneyPriceRange | null>(
    null,
  );

  const categories = useMemo(
    () => (navData?.categories ? mapMagentoCategoriesToPlpNav(navData.categories) : []),
    [navData?.categories],
  );

  const showStep2CategorySkeleton =
    isJewelleryNavLoading && (navData?.categories?.length ?? 0) === 0;

  const selectedCategory: JewelleryCategory | undefined = useMemo(
    () => categories.find((category) => category.slug === categorySlug) ?? categories[0],
    [categories, categorySlug],
  );

  const selectedShape = useMemo(
    () =>
      diamondShapeOptions.find((option) => option.value === diamondShapeValue) ?? null,
    [diamondShapeOptions, diamondShapeValue],
  );

  const hasPriceRange = facets.maxPrice > facets.minPrice;
  const priceSpan = Math.max(facets.maxPrice - facets.minPrice, 1);
  const minPercent = ((minPrice - facets.minPrice) / priceSpan) * 100;
  const maxPercent = ((maxPrice - facets.minPrice) / priceSpan) * 100;
  const priceSliderStep = getJewelleryPriceSliderStep(facets);

  useEffect(() => {
    const priceRangeSetters: DiscoverJourneyPriceRangeSetters = {
      setFacets,
      setMinPrice,
      setMaxPrice,
      setMinInputValue,
      setMaxInputValue,
      setPriceFacetsLoadState,
    };

    if (!open) {
      setStep(1);
      setCategorySlug("all");
      setDiamondShapeValue("");
      setDiamondShapeOptions([]);
      setDiamondShapesLoadState("idle");
      setShowAvailabilityError(false);
      setIsVerifyingAvailability(false);
      step1ProceedInFlightRef.current = false;
      step1ProceedRequestRef.current += 1;
      committedDiscoverJourneyPriceRangeRef.current = null;
      setIsCheckingStep2Category(false);
      setStep2CategoryHasProducts(null);
      setIsCheckingStep3Shape(false);
      setStep3ShapeHasProducts(null);
      setCategoryListingFacets(null);
      setMinInputFocused(false);
      setMaxInputFocused(false);
      resetDiscoverJourneyPriceRangeState(priceRangeSetters);
      setPriceFacetsLoadState("idle");
      return;
    }

    let cancelled = false;
    const priceAbort = new AbortController();
    const shapesAbort = new AbortController();

    const cachedPriceFacets = peekDiscoverJourneyListingFacets(null);
    if (cachedPriceFacets && isValidDiscoverJourneyPriceFacets(cachedPriceFacets)) {
      applyDiscoverJourneyPriceRangeFromFacets(cachedPriceFacets, priceRangeSetters);
    } else {
      setPriceFacetsLoadState("loading");
      resetDiscoverJourneyPriceRangeState(priceRangeSetters);
    }

    setDiamondShapesLoadState("loading");
    setDiamondShapeOptions([]);

    void (async () => {
      try {
        const nextFacets = await getDiscoverJourneyListingFacets(null, priceAbort.signal);

        if (cancelled) return;

        if (!isValidDiscoverJourneyPriceFacets(nextFacets)) {
          if (!peekDiscoverJourneyListingFacets(null)) {
            resetDiscoverJourneyPriceRangeState(priceRangeSetters);
            setPriceFacetsLoadState("error");
          }
          return;
        }

        applyDiscoverJourneyPriceRangeFromFacets(nextFacets, priceRangeSetters);
      } catch (error) {
        if (cancelled || isDiscoverJourneyAbortError(error)) {
          return;
        }
        if (!peekDiscoverJourneyListingFacets(null)) {
          resetDiscoverJourneyPriceRangeState(priceRangeSetters);
          setPriceFacetsLoadState("error");
        }
      }
    })();

    void (async () => {
      try {
        const magentoShapes = await getMagentoProductAttributeOptions(
          MAGENTO_DIAMOND_SHAPE_ATTRIBUTE_CODE,
          { signal: shapesAbort.signal, fresh: true },
        );

        if (cancelled) return;

        const options = normalizeDiscoverJourneyDiamondShapeOptions(magentoShapes);
        setDiamondShapeOptions(options);
        setDiamondShapesLoadState(options.length > 0 ? "ready" : "error");
      } catch (error) {
        if (cancelled || isDiscoverJourneyAbortError(error)) {
          return;
        }
        setDiamondShapeOptions([]);
        setDiamondShapesLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
      priceAbort.abort();
      shapesAbort.abort();
    };
  }, [open]);

  useEffect(() => {
    if (step === 1) {
      setShowAvailabilityError(false);
    }
  }, [minPrice, maxPrice, step]);

  useEffect(() => {
    if (step !== 2) {
      step2CategoryVerifyRequestRef.current += 1;
      setIsCheckingStep2Category(false);
      setStep2CategoryHasProducts(null);
    }
  }, [step]);

  useEffect(() => {
    if (step !== 3) {
      step3ShapeVerifyRequestRef.current += 1;
      setIsCheckingStep3Shape(false);
      setStep3ShapeHasProducts(null);
      return;
    }

    setDiamondShapeValue("");
    setShowAvailabilityError(false);
  }, [step]);

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

  const resolveDiscoverJourneyShapeSlug = (shapeValue: string): string => {
    const trimmed = shapeValue.trim();
    if (!trimmed) {
      return "";
    }

    const option =
      diamondShapeOptions.find((item) => item.value === trimmed) ??
      diamondShapeOptions.find(
        (item) => slugifyDiamondShapeLabel(item.label) === trimmed.toLowerCase(),
      );

    if (option) {
      return slugifyDiamondShapeLabel(option.label);
    }

    return "";
  };

  const availabilityErrorMessage =
    step === 3
      ? DISCOVER_JOURNEY_NO_PRODUCTS_IN_SHAPE_CATEGORY_AND_RANGE_MESSAGE
      : step === 2
        ? DISCOVER_JOURNEY_NO_PRODUCTS_IN_CATEGORY_AND_RANGE_MESSAGE
        : DISCOVER_JOURNEY_NO_PRODUCTS_IN_RANGE_MESSAGE;

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    const prefetchController = new AbortController();
    prefetchDiscoverJourneyCategoryFacets(
      categories.map((category) => category.urlKey ?? null),
      prefetchController.signal,
    );

    return () => {
      prefetchController.abort();
    };
  }, [step, categories]);

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    const category = categories.find((item) => item.slug === categorySlug);
    const categoryUrlKey = category?.urlKey ?? null;
    const requestId = step2CategoryVerifyRequestRef.current + 1;
    step2CategoryVerifyRequestRef.current = requestId;
    const controller = new AbortController();

    setIsCheckingStep2Category(true);
    setStep2CategoryHasProducts(null);
    setShowAvailabilityError(false);

    void (async () => {
      try {
        const { hasProducts, listingFacets } = await discoverJourneyHasMatchingProducts({
          categoryUrlKey,
          range: { minPrice, maxPrice },
          signal: controller.signal,
        });

        if (requestId !== step2CategoryVerifyRequestRef.current) {
          return;
        }

        setCategoryListingFacets(listingFacets);
        setStep2CategoryHasProducts(hasProducts);
        setShowAvailabilityError(!hasProducts);
      } catch (error) {
        if (
          isDiscoverJourneyAbortError(error) ||
          requestId !== step2CategoryVerifyRequestRef.current
        ) {
          return;
        }

        setStep2CategoryHasProducts(false);
        setShowAvailabilityError(true);
      } finally {
        if (requestId === step2CategoryVerifyRequestRef.current) {
          setIsCheckingStep2Category(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [step, categorySlug, minPrice, maxPrice, categories]);

  useEffect(() => {
    if (step !== 3) {
      return;
    }

    const trimmedShape = diamondShapeValue.trim();
    if (!trimmedShape) {
      setIsCheckingStep3Shape(false);
      setStep3ShapeHasProducts(null);
      setShowAvailabilityError(false);
      return;
    }

    const categoryUrlKey = selectedCategory?.urlKey ?? null;
    const requestId = step3ShapeVerifyRequestRef.current + 1;
    step3ShapeVerifyRequestRef.current = requestId;
    const controller = new AbortController();

    setIsCheckingStep3Shape(true);
    setStep3ShapeHasProducts(null);
    setShowAvailabilityError(false);

    void (async () => {
      try {
        const shapeSlug = resolveDiscoverJourneyShapeSlug(trimmedShape);
        const { hasProducts, listingFacets } = await discoverJourneyHasMatchingProducts({
          categoryUrlKey,
          range: { minPrice, maxPrice },
          diamondShapeSlug: shapeSlug,
          listingFacets: categoryListingFacets ?? undefined,
          signal: controller.signal,
        });

        if (requestId !== step3ShapeVerifyRequestRef.current) {
          return;
        }

        setCategoryListingFacets(listingFacets);
        setStep3ShapeHasProducts(hasProducts);
        setShowAvailabilityError(!hasProducts);
      } catch (error) {
        if (
          isDiscoverJourneyAbortError(error) ||
          requestId !== step3ShapeVerifyRequestRef.current
        ) {
          return;
        }

        setStep3ShapeHasProducts(false);
        setShowAvailabilityError(true);
      } finally {
        if (requestId === step3ShapeVerifyRequestRef.current) {
          setIsCheckingStep3Shape(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [step, diamondShapeValue, minPrice, maxPrice, selectedCategory?.urlKey]);

  const handleBack = () => {
    if (step === 1) {
      onClose();
      return;
    }

    if (step === 2) {
      step2CategoryVerifyRequestRef.current += 1;
      step1ProceedRequestRef.current += 1;
      step1ProceedInFlightRef.current = false;
      setIsVerifyingAvailability(false);
    }

    if (step === 3) {
      step3ShapeVerifyRequestRef.current += 1;
      setShowAvailabilityError(false);
    }

    setStep((current) => (current === 3 ? 2 : 1));
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      if (step1ProceedInFlightRef.current || isVerifyingAvailability || !hasPriceRange) {
        return;
      }

      const proceedRequestId = step1ProceedRequestRef.current + 1;
      step1ProceedRequestRef.current = proceedRequestId;
      step1ProceedInFlightRef.current = true;
      setIsVerifyingAvailability(true);
      setShowAvailabilityError(false);

      void (async () => {
        const checkingStartedAt = Date.now();

        try {
          await waitForDiscoverJourneyProceedPaint();

          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }

          const range = commitPriceRangeForProceed();
          committedDiscoverJourneyPriceRangeRef.current = range;
          const { hasProducts } = await discoverJourneyHasMatchingProducts({
            categoryUrlKey: null,
            range,
            listingFacets: facets,
          });

          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }

          await waitForDiscoverJourneyMinimumCheckingDuration(checkingStartedAt);

          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }

          if (!hasProducts) {
            setShowAvailabilityError(true);
            return;
          }

          setShowAvailabilityError(false);
          prefetchDiscoverJourneyCategoryFacets(
            categories.map((category) => category.urlKey ?? null),
          );
          setStep(2);
        } catch {
          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }

          await waitForDiscoverJourneyMinimumCheckingDuration(checkingStartedAt);

          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }

          setShowAvailabilityError(true);
        } finally {
          if (proceedRequestId !== step1ProceedRequestRef.current) {
            return;
          }
          step1ProceedInFlightRef.current = false;
          setIsVerifyingAvailability(false);
        }
      })();

      return;
    }

    if (step === 2) {
      if (isCheckingStep2Category || step2CategoryHasProducts !== true) {
        return;
      }

      setShowAvailabilityError(false);
      setStep(3);
      return;
    }

    if (isCheckingStep3Shape || step3ShapeHasProducts !== true || !selectedShape) {
      return;
    }

    const categoryUrlKey = selectedCategory?.urlKey ?? null;
    const priceRange =
      committedDiscoverJourneyPriceRangeRef.current ?? { minPrice, maxPrice };
    const href = buildEducationJourneyHref({
      categoryUrlKey,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      diamondShapeLabel: selectedShape.label,
      priceUrlFacets: facets,
    });

    setShowAvailabilityError(false);
    onClose();
    router.push(href);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const isPrimaryActionChecking =
    (step === 1 && isVerifyingAvailability) ||
    (step === 2 && isCheckingStep2Category) ||
    (step === 3 && isCheckingStep3Shape);

  const primaryActionLabel = isPrimaryActionChecking
    ? "Checking..."
    : step === 3
      ? "View Products"
      : "Proceed";

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
          {step === 1 && priceFacetsLoadState === "loading" ? (
            <EducationDiscoverJourneyStep1PriceSkeleton />
          ) : null}
          {step === 1 && priceFacetsLoadState === "error" ? (
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              Price range is unavailable right now. Please try again later.
            </p>
          ) : null}
          {step === 1 && priceFacetsLoadState === "ready" && hasPriceRange ? (
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
                        const nextValue = sanitizeDiscoverJourneyPriceInput(event.target.value);
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
                        const nextValue = sanitizeDiscoverJourneyPriceInput(event.target.value);
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

          {step === 2 && showStep2CategorySkeleton ? (
            <EducationDiscoverJourneyStep2CategorySkeleton />
          ) : null}
          {step === 2 && !showStep2CategorySkeleton ? (
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
              {diamondShapesLoadState === "loading" ? (
                <EducationDiscoverJourneyStep3ShapeSkeleton />
              ) : null}
              {diamondShapesLoadState === "error" ? (
                <p className="font-gill text-base font-light leading-110 text-neutral500">
                  Diamond shapes are unavailable right now. Please try again later.
                </p>
              ) : null}
              {diamondShapesLoadState === "ready" ? (
                <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                  {diamondShapeOptions.map((option) => {
                    const isSelected = option.value === diamondShapeValue;
                    const Icon = resolveDiscoverJourneyDiamondShapeIcon(option);

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
                            aria-hidden
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
              ) : null}
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
              isVerifyingAvailability ||
              (step === 1 && (priceFacetsLoadState !== "ready" || !hasPriceRange)) ||
              (step === 2 &&
                (isCheckingStep2Category || step2CategoryHasProducts !== true)) ||
              (step === 3 &&
                (diamondShapesLoadState !== "ready" ||
                  isCheckingStep3Shape ||
                  step3ShapeHasProducts !== true ||
                  !diamondShapeValue.trim()))
            }
            className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10">{primaryActionLabel}</span>
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
