"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import JewelleryHeroSection from "./JewelleryHeroSection";
import JewelleryCategoryNav from "./JewelleryCategoryNav";
import JewelleryProductToolbar from "./JewelleryProductToolbar";
import JewelleryProductGrid from "./JewelleryProductGrid";
import JewelleryFilterDrawer from "./JewelleryFilterDrawer";
import JewelleryLoadMoreSection from "./JewelleryLoadMoreSection";
import JewelleryListingEmptyState from "./JewelleryListingEmptyState";
import JewelleryGuaranteesSection from "./JewelleryGuaranteesSection";
import JewelleryProductGridSkeleton from "./skeletons/JewelleryProductGridSkeleton";
import {
  createDefaultFilterState,
  createEmptyFilterState,
  DEFAULT_JEWELLERY_LISTING_SORT,
  PAGE_SIZE,
  applyJewelleryPriceSearchParams,
  hasActiveFilters,
  hasMagentoFilterFacets,
  isDefaultPriceRange,
  getSelectedMetalPurityQuery,
  reconcileJewelleryPriceFilterState,
} from "../data/filters";
import {
  hasCollectionListingContext,
  isJewelleryCategoryPath,
  JEWELLERY_PATH,
  parseJewelleryCategorySlug,
  preserveJewelleryListingSearchParams,
  readJewelleryListingUrlParams,
  replaceJewelleryListingUrl,
  resolveCategoryUrlKeyFromPathname,
  resolveCategoryUrlKeyFromQueryParam,
  resolveSelectedCategoryUrlKey,
  shouldSyncCategoryFromRouterPathname,
} from "../utils/jewelleryRoutes";
import { resolveDiamondShapeFacetOption } from "../utils/diamondShapeListing";
import { resolveFancyColourFacetOption } from "../utils/fancyColourListing";
import { resolveCollectionFacetOption } from "../utils/collectionListing";
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
import { resolveActiveCategorySlugFromFilters, resolveMainCategoryUrlKeyFromDrawerSelection } from "../utils/plpCategoryNav";
import type { JewelleryCategory, JewelleryFilterState } from "../types";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type {
  NormalizedProductLandingHero,
  NormalizedProductLandingTrustBadge,
} from "@/services/product-landing/product-landing-page.types";

type JewelleryProductPageProps = {
  initialListing?: JewelleryListingProductsData;
  prefetchedCategoryUrlKey?: string | null;
  hero?: NormalizedProductLandingHero | null;
  trustBadges?: NormalizedProductLandingTrustBadge[];
};

/** Clears drawer filters while keeping URL-driven listing params (occasion, shape, etc.). */
function createClearedDrawerFilterState(
  current: JewelleryFilterState,
): JewelleryFilterState {
  return {
    ...createEmptyFilterState(),
    occasion: current.occasion,
    diamondShape: current.diamondShape,
    fancyColour: current.fancyColour,
    collection: current.collection,
  };
}

const JewelleryProductPage = ({
  initialListing,
  prefetchedCategoryUrlKey,
  hero,
  trustBadges = [],
}: JewelleryProductPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryUrlKeyFromRoute =
    typeof params?.categoryUrl === "string" ? decodeURIComponent(params.categoryUrl) : null;
  const occasionSlug = searchParams?.get("occasion");
  const diamondShapeSlug = searchParams?.get("diamondShape");
  const fancyColourSlug = searchParams?.get("fancyColour");
  const collectionSlug = searchParams?.get("collection");
  const categorySlugFromUrl = searchParams?.get("category");
  const minPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("minPrice"));
  const maxPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("maxPrice"));

  const [selectedCategoryUrlKey, setSelectedCategoryUrlKey] = useState<string | null>(() =>
    resolveSelectedCategoryUrlKey(pathname, categoryUrlKeyFromRoute, searchParams?.toString()),
  );

  const [sortValue, setSortValue] = useState(DEFAULT_JEWELLERY_LISTING_SORT);
  const [filters, setFilters] = useState<JewelleryFilterState>(() => {
    const initial = createEmptyFilterState();
    if (occasionSlug?.trim()) {
      initial.occasion = occasionSlug.trim();
    }
    if (collectionSlug?.trim()) {
      initial.collection = collectionSlug.trim();
    }
    return initial;
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: navData } = useMagentoJewelleryNav();
  const navCategories = navData?.categories ?? [];
  const facetsSyncedRef = useRef(false);
  const lastFacetsSyncedCategoryRef = useRef<string | null>(selectedCategoryUrlKey);
  const lastOccasionSlugRef = useRef<string | null>(null);
  const lastDiamondShapeSlugRef = useRef<string | null>(null);
  const lastFancyColourSlugRef = useRef<string | null>(null);
  const lastCollectionSlugRef = useRef<string | null>(null);
  const lastPriceParamsRef = useRef<string | null>(null);
  const lastFacetPriceBoundsRef = useRef("");
  const suppressFacetUrlSyncRef = useRef(false);
  const awaitingClearListingRef = useRef(false);
  const plpTtfbReportedRef = useRef(false);
  const plpPrefetchReportedRef = useRef(false);
  const [listingResetNonce, setListingResetNonce] = useState(0);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const initialListingParams =
    initialListing && prefetchedCategoryUrlKey !== undefined
      ? createJewelleryListingPrefetchParams(prefetchedCategoryUrlKey, collectionSlug)
      : undefined;

  const {
    products,
    totalCount,
    facets,
    isLoading,
    isSearching,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useMagentoJewelleryListing({
    categoryUrlKey: selectedCategoryUrlKey,
    sortValue,
    filters,
    pageSize: PAGE_SIZE,
    initialListing,
    initialListingParams,
    listingResetNonce,
  });

  useEffect(() => {
    if (!shouldSyncCategoryFromRouterPathname(pathname)) {
      return;
    }

    setSelectedCategoryUrlKey(
      resolveSelectedCategoryUrlKey(pathname, categoryUrlKeyFromRoute, searchParams?.toString()),
    );
  }, [pathname, categoryUrlKeyFromRoute, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (!hasCollectionListingContext(params)) {
      return;
    }

    const pathCategoryUrlKey = resolveCategoryUrlKeyFromPathname(window.location.pathname);
    if (!pathCategoryUrlKey) {
      return;
    }

    replaceJewelleryListingUrl(pathCategoryUrlKey, params);
    setSelectedCategoryUrlKey(pathCategoryUrlKey);
    lastFacetsSyncedCategoryRef.current = pathCategoryUrlKey;
    facetsSyncedRef.current = true;
  }, []);

  useEffect(() => {
    const syncCategoryFromBrowserUrl = () => {
      const currentPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const preserved = preserveJewelleryListingSearchParams(params);
      const collectionFromUrl = preserved.get("collection")?.trim() ?? "";

      const nextUrlKey = hasCollectionListingContext(preserved)
        ? resolveCategoryUrlKeyFromQueryParam(params.get("category"))
        : isJewelleryCategoryPath(currentPath)
          ? resolveCategoryUrlKeyFromPathname(currentPath)
          : null;

      if (!hasCollectionListingContext(preserved) && !isJewelleryCategoryPath(currentPath)) {
        return;
      }

      setSelectedCategoryUrlKey(nextUrlKey);
      lastFacetsSyncedCategoryRef.current = nextUrlKey;
      facetsSyncedRef.current = true;

      if (nextUrlKey === null) {
        setFilters({
          ...createEmptyFilterState(),
          ...(collectionFromUrl ? { collection: collectionFromUrl } : {}),
        });
      } else {
        setFilters((current) => createClearedDrawerFilterState(current));
      }
    };

    window.addEventListener("popstate", syncCategoryFromBrowserUrl);
    return () => window.removeEventListener("popstate", syncCategoryFromBrowserUrl);
  }, []);

  const navigateToCategory = useCallback(
    (urlKey?: string | null) => {
      const nextUrlKey = urlKey?.trim() || null;
      setSelectedCategoryUrlKey(nextUrlKey);

      const preservedSearchParams = preserveJewelleryListingSearchParams(
        searchParams?.toString() ?? window.location.search,
      );
      const collectionFromUrl = preservedSearchParams.get("collection")?.trim() ?? "";

      if (nextUrlKey === null) {
        setFilters({
          ...createEmptyFilterState(),
          ...(collectionFromUrl ? { collection: collectionFromUrl } : {}),
        });
      } else {
        setFilters((current) => createClearedDrawerFilterState(current));
      }

      lastFacetsSyncedCategoryRef.current = nextUrlKey;
      facetsSyncedRef.current = true;
      replaceJewelleryListingUrl(nextUrlKey, preservedSearchParams);
    },
    [searchParams],
  );

  useEffect(() => {
    markJewelleryPlpNavigation();

    if (!plpTtfbReportedRef.current) {
      plpTtfbReportedRef.current = true;
      reportJewelleryPlpTtfb();
    }
  }, [selectedCategoryUrlKey]);

  useEffect(() => {
    if (plpPrefetchReportedRef.current || !initialListing) {
      return;
    }

    plpPrefetchReportedRef.current = true;
    reportJewelleryPlpProductsReady({
      source: "prefetch",
      productCount: initialListing.products.length,
      categoryUrlKey: prefetchedCategoryUrlKey ?? selectedCategoryUrlKey,
      durationMs: 0,
    });
  }, [initialListing, prefetchedCategoryUrlKey, selectedCategoryUrlKey]);

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

  const activeNavCategory = useMemo(
    () => navCategories.find((category) => category.urlKey === selectedCategoryUrlKey) ?? null,
    [navCategories, selectedCategoryUrlKey],
  );
  const categoryFilterHeading =
    selectedCategoryUrlKey && activeNavCategory && activeNavCategory.children.length > 0
      ? `${activeNavCategory.label} Categories:`
      : null;

  const activeCategory = useMemo(() => {
    if (selectedCategoryUrlKey) {
      const fromSelected = parseJewelleryCategorySlug(selectedCategoryUrlKey);
      return fromSelected ?? "all";
    }

    const fromDrawerCategory = resolveActiveCategorySlugFromFilters(
      filters,
      facets,
      navCategories,
    );

    return fromDrawerCategory ?? "all";
  }, [selectedCategoryUrlKey, filters, facets, navCategories]);

  const resetPlpListingScope = useCallback(() => {
    suppressFacetUrlSyncRef.current = true;
    awaitingClearListingRef.current = true;
    setSelectedCategoryUrlKey(null);
    lastFacetsSyncedCategoryRef.current = null;
    lastCollectionSlugRef.current = null;
    lastOccasionSlugRef.current = null;
    lastDiamondShapeSlugRef.current = null;
    lastFancyColourSlugRef.current = null;
    lastPriceParamsRef.current = "|";
    facetsSyncedRef.current = true;
    replaceJewelleryListingUrl(null, new URLSearchParams());

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname ?? JEWELLERY_PATH;
    if (currentPath !== JEWELLERY_PATH && currentPath !== `${JEWELLERY_PATH}/`) {
      router.replace(JEWELLERY_PATH, { scroll: false });
    }

    setListingResetNonce((nonce) => nonce + 1);
  }, [pathname, router]);

  useEffect(() => {
    if (!awaitingClearListingRef.current || isLoading) {
      return;
    }

    awaitingClearListingRef.current = false;
    suppressFacetUrlSyncRef.current = true;
  }, [isLoading]);

  useEffect(() => {
    if (suppressFacetUrlSyncRef.current) {
      suppressFacetUrlSyncRef.current = false;
      return;
    }

    if (awaitingClearListingRef.current) {
      return;
    }

    if (!hasMagentoFilterFacets(facets)) {
      return;
    }

    const liveUrlParams = readJewelleryListingUrlParams(searchParams?.toString());
    const liveOccasionSlug = liveUrlParams.get("occasion");
    const liveDiamondShapeSlug = liveUrlParams.get("diamondShape");
    const liveFancyColourSlug = liveUrlParams.get("fancyColour");
    const liveCollectionSlug = liveUrlParams.get("collection");
    const liveMinPriceFromUrl = parseGiftFinderPriceParam(liveUrlParams.get("minPrice"));
    const liveMaxPriceFromUrl = parseGiftFinderPriceParam(liveUrlParams.get("maxPrice"));

    const occasionOption = resolveOccasionFacetOption(liveOccasionSlug, facets.occasions);
    const occasionChanged = lastOccasionSlugRef.current !== (liveOccasionSlug ?? null);
    lastOccasionSlugRef.current = liveOccasionSlug ?? null;

    const diamondShapeOption = resolveDiamondShapeFacetOption(
      liveDiamondShapeSlug,
      facets.diamondShapes,
    );
    const diamondShapeChanged =
      lastDiamondShapeSlugRef.current !== (liveDiamondShapeSlug ?? null);
    lastDiamondShapeSlugRef.current = liveDiamondShapeSlug ?? null;

    const fancyColourOption = resolveFancyColourFacetOption(
      liveFancyColourSlug,
      facets.fancyColours,
    );
    const fancyColourChanged =
      lastFancyColourSlugRef.current !== (liveFancyColourSlug ?? null);
    lastFancyColourSlugRef.current = liveFancyColourSlug ?? null;

    const collectionOption = resolveCollectionFacetOption(
      liveCollectionSlug,
      facets.collections,
    );
    const collectionChanged = lastCollectionSlugRef.current !== (liveCollectionSlug ?? null);
    lastCollectionSlugRef.current = liveCollectionSlug ?? null;

    const priceParamsKey = `${liveMinPriceFromUrl}|${liveMaxPriceFromUrl}`;
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
      if (collectionOption) {
        nextDraft.collection = collectionOption.value;
      } else if (liveCollectionSlug?.trim()) {
        nextDraft.collection = liveCollectionSlug.trim();
      }
      return applyGiftFinderPriceToFilterState(
        nextDraft,
        facets,
        liveMinPriceFromUrl,
        liveMaxPriceFromUrl,
      );
    };

    const facetPriceBoundsKey = `${facets.minPrice}|${facets.maxPrice}`;
    const categoryChanged = lastFacetsSyncedCategoryRef.current !== selectedCategoryUrlKey;
    const facetBoundsChanged = lastFacetPriceBoundsRef.current !== facetPriceBoundsKey;

    if (!facetsSyncedRef.current || categoryChanged || facetBoundsChanged) {
      facetsSyncedRef.current = true;
      lastFacetsSyncedCategoryRef.current = selectedCategoryUrlKey;
      lastFacetPriceBoundsRef.current = facetPriceBoundsKey;
      const nextDraft = reconcileJewelleryPriceFilterState(
        buildFiltersFromUrl(filters),
        facets,
      );
      setFilters(nextDraft);
      return;
    }

    if (
      occasionChanged ||
      diamondShapeChanged ||
      fancyColourChanged ||
      collectionChanged ||
      priceParamsChanged
    ) {
      setFilters((current) =>
        reconcileJewelleryPriceFilterState(buildFiltersFromUrl(current), facets),
      );
    }
  }, [facets, selectedCategoryUrlKey, searchParams]);

  const handleCategoryChange = useCallback(
    (category: JewelleryCategory) => {
      navigateToCategory(category.urlKey);
    },
    [navigateToCategory],
  );

  const handleApplyFilters = useCallback(
    (nextFilters: JewelleryFilterState) => {
      // All-jewellery drawer: selecting one main category should behave like the tabs
      // so the next open shows that category's subfilters (not the mixed main list).
      if (!selectedCategoryUrlKey) {
        const mainCategoryUrlKey = resolveMainCategoryUrlKeyFromDrawerSelection(
          nextFilters.categories,
          facets,
          navCategories,
        );

        if (mainCategoryUrlKey) {
          setFilters({ ...nextFilters, categories: [] });
          setIsFilterOpen(false);
          navigateToCategory(mainCategoryUrlKey);
          return;
        }
      }

      const clearedToDefault =
        hasMagentoFilterFacets(facets) && !hasActiveFilters(nextFilters, facets);

      if (clearedToDefault) {
        setFilters(createEmptyFilterState());
        setIsFilterOpen(false);
        resetPlpListingScope();
        return;
      }

      setFilters(nextFilters);
      setIsFilterOpen(false);

      if (pathname) {
        const params = readJewelleryListingUrlParams(searchParams?.toString());
        applyJewelleryPriceSearchParams(params, nextFilters, facets);

        if (hasCollectionListingContext(params) || nextFilters.collection.trim()) {
          replaceJewelleryListingUrl(selectedCategoryUrlKey, params);
        } else {
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }
      }
    },
    [
      selectedCategoryUrlKey,
      facets,
      navCategories,
      occasionSlug,
      pathname,
      router,
      searchParams,
      navigateToCategory,
      resetPlpListingScope,
    ],
  );

  const handleClearFilters = useCallback(() => {
    handleApplyFilters(createEmptyFilterState());
  }, [handleApplyFilters]);

  const showFilterEmptyState =
    !isLoading && products.length === 0 && hasActiveFilters(filters, facets);

  const metalPurityQuery = useMemo(
    () => getSelectedMetalPurityQuery(filters.metalPurities, facets),
    [filters.metalPurities, facets],
  );

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  return (
    <div className="pb-0 md:pb-0">
      {hero ? <JewelleryHeroSection {...hero} /> : null}
      <JewelleryCategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <JewelleryProductToolbar
        productCount={totalCount}
        isSearching={isSearching}
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
            metalPurityQuery={metalPurityQuery}
          />
        )}
      </section>

      {!isSearching && !isLoading && totalCount > 0 ? (
        <JewelleryLoadMoreSection
          visibleCount={products.length}
          totalCount={totalCount}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
        />
      ) : null}

      <ScrollReveal delayMs={0}>
        <JewelleryGuaranteesSection trustBadges={trustBadges} />
      </ScrollReveal>

      <JewelleryFilterDrawer
        open={isFilterOpen}
        appliedFilters={filters}
        facets={facets}
        categoryFilterHeading={categoryFilterHeading}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />

      {isLoadingMore ? <span className="sr-only" aria-live="polite">Loading more products</span> : null}
    </div>
  );
};

export default JewelleryProductPage;
