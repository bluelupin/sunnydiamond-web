"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import JewelleryHeroSection from "./JewelleryHeroSection";
import JewelleryCategoryNav from "./JewelleryCategoryNav";
import JewelleryProductToolbar from "./JewelleryProductToolbar";
import JewelleryProductGrid from "./JewelleryProductGrid";
import JewelleryLoadMoreSection from "./JewelleryLoadMoreSection";
import JewelleryListingEmptyState from "./JewelleryListingEmptyState";
import JewelleryGuaranteesSection from "./JewelleryGuaranteesSection";
import JewelleryProductGridSkeleton from "./skeletons/JewelleryProductGridSkeleton";
import {
  createDefaultFilterState,
  createEmptyFilterState,
  DEFAULT_JEWELLERY_LISTING_SORT,
  PAGE_SIZE,
  hasActiveFilters,
  hasMagentoFilterFacets,
  isDefaultPriceRange,
} from "../data/filters";
import {
  buildJewelleryCategoryHref,
  parseJewelleryCategorySlug,
} from "../utils/jewelleryRoutes";
import { resolveDiamondShapeFacetOption } from "../utils/diamondShapeListing";
import { resolveFancyColourFacetOption } from "../utils/fancyColourListing";
import { resolveOccasionFacetOption } from "../utils/occasionListing";
import {
  applyGiftFinderPriceToFilterState,
  parseGiftFinderPriceParam,
} from "@/features/gifting/utils/giftFinderRoutes";
import {
  markJewelleryPlpNavigation,
  reportJewelleryPlpFirstGridPaint,
  reportJewelleryPlpProductsReady,
  reportJewelleryPlpTtfb,
} from "../utils/jewelleryPlpPerformance";
import { useMagentoJewelleryListing, createJewelleryListingPrefetchParams } from "@/hooks/magento/useMagentoJewelleryListing";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { resolveActiveCategorySlugFromFilters } from "../utils/plpCategoryNav";
import type { JewelleryCategory, JewelleryFilterState } from "../types";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";

const JewelleryFilterDrawer = dynamic(() => import("./JewelleryFilterDrawer"), {
  ssr: false,
  loading: () => null,
});

type JewelleryProductPageProps = {
  initialListing?: JewelleryListingProductsData;
  prefetchedCategoryUrlKey?: string | null;
};

const JewelleryProductPage = ({
  initialListing,
  prefetchedCategoryUrlKey,
}: JewelleryProductPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryUrlKey =
    typeof params?.categoryUrl === "string" ? decodeURIComponent(params.categoryUrl) : null;
  const categoryFromPath = parseJewelleryCategorySlug(categoryUrlKey);
  const categoryFromQuery = parseJewelleryCategorySlug(searchParams?.get("category") ?? null);
  const categoryFromUrl = categoryFromPath ?? categoryFromQuery ?? "all";
  const occasionSlug = searchParams?.get("occasion");
  const diamondShapeSlug = searchParams?.get("diamondShape");
  const fancyColourSlug = searchParams?.get("fancyColour");
  const minPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("minPrice"));
  const maxPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("maxPrice"));

  const [sortValue, setSortValue] = useState(DEFAULT_JEWELLERY_LISTING_SORT);
  const [filters, setFilters] = useState<JewelleryFilterState>(() => {
    const initial = createEmptyFilterState();
    // Keep CMS/URL slug as-is; Magento option ids are resolved from live attribute options.
    if (occasionSlug?.trim()) {
      initial.occasion = occasionSlug.trim();
    }
    const shapeOption = resolveDiamondShapeFacetOption(diamondShapeSlug);
    if (shapeOption) {
      initial.diamondShape = shapeOption.value;
    }
    const colourOption = resolveFancyColourFacetOption(fancyColourSlug);
    if (colourOption) {
      initial.fancyColour = colourOption.value;
    }
    return initial;
  });
  const [draftFilters, setDraftFilters] = useState<JewelleryFilterState>(() => {
    const initial = createEmptyFilterState();
    if (occasionSlug?.trim()) {
      initial.occasion = occasionSlug.trim();
    }
    const shapeOption = resolveDiamondShapeFacetOption(diamondShapeSlug);
    if (shapeOption) {
      initial.diamondShape = shapeOption.value;
    }
    const colourOption = resolveFancyColourFacetOption(fancyColourSlug);
    if (colourOption) {
      initial.fancyColour = colourOption.value;
    }
    return initial;
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: navData } = useMagentoJewelleryNav();
  const navCategories = navData?.categories ?? [];
  const facetsSyncedRef = useRef(false);
  const lastOccasionSlugRef = useRef<string | null>(null);
  const lastDiamondShapeSlugRef = useRef<string | null>(null);
  const lastFancyColourSlugRef = useRef<string | null>(null);
  const lastPriceParamsRef = useRef<string | null>(null);
  const plpTtfbReportedRef = useRef(false);
  const plpPrefetchReportedRef = useRef(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const initialListingParams =
    initialListing && prefetchedCategoryUrlKey !== undefined
      ? createJewelleryListingPrefetchParams(prefetchedCategoryUrlKey)
      : undefined;

  const {
    products,
    totalCount,
    facets,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useMagentoJewelleryListing({
    categoryUrlKey,
    sortValue,
    filters,
    pageSize: PAGE_SIZE,
    initialListing,
    initialListingParams,
  });

  useEffect(() => {
    markJewelleryPlpNavigation();

    if (!plpTtfbReportedRef.current) {
      plpTtfbReportedRef.current = true;
      reportJewelleryPlpTtfb();
    }
  }, [categoryUrlKey]);

  useEffect(() => {
    if (plpPrefetchReportedRef.current || !initialListing) {
      return;
    }

    plpPrefetchReportedRef.current = true;
    reportJewelleryPlpProductsReady({
      source: "prefetch",
      productCount: initialListing.products.length,
      categoryUrlKey: prefetchedCategoryUrlKey ?? categoryUrlKey,
      durationMs: 0,
    });
  }, [initialListing, prefetchedCategoryUrlKey, categoryUrlKey]);

  useEffect(() => {
    if (isLoading || products.length === 0) {
      return;
    }

    const routeKey = pathname ?? "/jewellery";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reportJewelleryPlpFirstGridPaint({
          routeKey,
          productCount: products.length,
          hadPrefetch: Boolean(initialListing),
        });
      });
    });
  }, [isLoading, products.length, pathname, initialListing]);

  const activeCategory = useMemo(() => {
    const fromDrawerCategory = resolveActiveCategorySlugFromFilters(
      filters,
      facets,
      navCategories,
    );

    return fromDrawerCategory ?? categoryFromUrl;
  }, [filters, facets, navCategories, categoryFromUrl]);

  useEffect(() => {
    if (!hasMagentoFilterFacets(facets)) {
      return;
    }

    const occasionOption = resolveOccasionFacetOption(occasionSlug, facets.occasions);
    const occasionChanged = lastOccasionSlugRef.current !== (occasionSlug ?? null);
    lastOccasionSlugRef.current = occasionSlug ?? null;

    const diamondShapeOption = resolveDiamondShapeFacetOption(
      diamondShapeSlug,
      facets.diamondShapes,
    );
    const diamondShapeChanged =
      lastDiamondShapeSlugRef.current !== (diamondShapeSlug ?? null);
    lastDiamondShapeSlugRef.current = diamondShapeSlug ?? null;

    const fancyColourOption = resolveFancyColourFacetOption(
      fancyColourSlug,
      facets.fancyColours,
    );
    const fancyColourChanged =
      lastFancyColourSlugRef.current !== (fancyColourSlug ?? null);
    lastFancyColourSlugRef.current = fancyColourSlug ?? null;

    const priceParamsKey = `${minPriceFromUrl}|${maxPriceFromUrl}`;
    const priceParamsChanged = lastPriceParamsRef.current !== priceParamsKey;
    lastPriceParamsRef.current = priceParamsKey;

    const buildFiltersFromUrl = (preserve?: JewelleryFilterState) => {
      let nextDraft = createDefaultFilterState(facets);

      if (preserve) {
        nextDraft = {
          ...nextDraft,
          categories: preserve.categories,
          metalTypes: preserve.metalTypes,
          metalPurities: preserve.metalPurities,
          gemstoneType: preserve.gemstoneType,
        };

        if (!isDefaultPriceRange(preserve, facets)) {
          nextDraft.minPrice = preserve.minPrice;
          nextDraft.maxPrice = preserve.maxPrice;
        }
      }

      if (occasionOption) {
        nextDraft.occasion = occasionOption.value;
      }
      if (diamondShapeOption) {
        nextDraft.diamondShape = diamondShapeOption.value;
      }
      if (fancyColourOption) {
        nextDraft.fancyColour = fancyColourOption.value;
      }
      return applyGiftFinderPriceToFilterState(
        nextDraft,
        facets,
        minPriceFromUrl,
        maxPriceFromUrl,
      );
    };

    if (!facetsSyncedRef.current) {
      facetsSyncedRef.current = true;
      const nextDraft = buildFiltersFromUrl();
      setFilters(nextDraft);
      return;
    }

    if (
      occasionChanged ||
      diamondShapeChanged ||
      fancyColourChanged ||
      priceParamsChanged
    ) {
      setFilters((current) => buildFiltersFromUrl(current));
    }
  }, [
    facets,
    occasionSlug,
    diamondShapeSlug,
    fancyColourSlug,
    minPriceFromUrl,
    maxPriceFromUrl,
  ]);

  const handleCategoryChange = useCallback(
    (category: JewelleryCategory) => {
      router.replace(buildJewelleryCategoryHref(category.urlKey), { scroll: false });
      setFilters((current) => ({
        ...current,
        categories: [],
      }));
    },
    [router],
  );

  const handleApplyFilters = useCallback(
    (nextFilters: JewelleryFilterState) => {
      setFilters(nextFilters);
      setIsFilterOpen(false);

      const clearedToDefault =
        hasMagentoFilterFacets(facets) && !hasActiveFilters(nextFilters, facets);
      const hasUrlFilterParams =
        Boolean(occasionSlug) ||
        Boolean(diamondShapeSlug) ||
        Boolean(fancyColourSlug) ||
        minPriceFromUrl != null ||
        maxPriceFromUrl != null;

      if (clearedToDefault && hasUrlFilterParams && pathname) {
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.delete("occasion");
        params.delete("diamondShape");
        params.delete("fancyColour");
        params.delete("minPrice");
        params.delete("maxPrice");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    },
    [
      facets,
      occasionSlug,
      diamondShapeSlug,
      fancyColourSlug,
      minPriceFromUrl,
      maxPriceFromUrl,
      pathname,
      router,
      searchParams,
    ],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = hasMagentoFilterFacets(facets)
      ? createDefaultFilterState(facets)
      : createEmptyFilterState();
    handleApplyFilters(cleared);
  }, [facets, handleApplyFilters]);

  const showFilterEmptyState =
    !isLoading && products.length === 0 && hasActiveFilters(filters, facets);

  const handleOpenFilters = () => {
    void import("./JewelleryFilterDrawer");
    setIsFilterOpen(true);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  return (
    <div className="pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <JewelleryHeroSection />
      <JewelleryCategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <JewelleryProductToolbar
        productCount={totalCount}
        sortValue={sortValue}
        onSortChange={setSortValue}
        onFilterOpen={handleOpenFilters}
        isFilterOpen={isFilterOpen}
      />

      <section className="relative isolate z-0 w-full bg-gray200 pb-0 md:pb-10">
        {isLoading ? (
          <JewelleryProductGridSkeleton count={PAGE_SIZE} />
        ) : showFilterEmptyState ? (
          <JewelleryListingEmptyState onClearFilters={handleClearFilters} />
        ) : (
          <JewelleryProductGrid
            products={products}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </section>

      {!isLoading && totalCount > 0 ? (
        <JewelleryLoadMoreSection
          visibleCount={products.length}
          totalCount={totalCount}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
        />
      ) : null}

      <ScrollReveal delayMs={0}>
        <JewelleryGuaranteesSection />
      </ScrollReveal>

      <JewelleryFilterDrawer
        open={isFilterOpen}
        appliedFilters={filters}
        facets={facets}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />

      {isLoadingMore ? <span className="sr-only" aria-live="polite">Loading more products</span> : null}
    </div>
  );
};

export default JewelleryProductPage;
