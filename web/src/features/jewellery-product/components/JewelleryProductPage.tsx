"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import JewelleryHeroSection from "./JewelleryHeroSection";
import JewelleryCategoryNav from "./JewelleryCategoryNav";
import JewelleryProductToolbar from "./JewelleryProductToolbar";
import JewelleryProductGrid from "./JewelleryProductGrid";
import JewelleryLoadMoreSection from "./JewelleryLoadMoreSection";
import JewelleryGuaranteesSection from "./JewelleryGuaranteesSection";
import JewelleryProductGridSkeleton from "./skeletons/JewelleryProductGridSkeleton";
import { createDefaultFilterState, createEmptyFilterState, DEFAULT_JEWELLERY_LISTING_SORT, PAGE_SIZE, hasMagentoFilterFacets } from "../data/filters";
import {
  buildJewelleryCategoryHref,
  parseJewelleryCategorySlug,
} from "../utils/jewelleryRoutes";
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
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import type { JewelleryCategory, JewelleryCategorySlug, JewelleryFilterState } from "../types";
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
  const minPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("minPrice"));
  const maxPriceFromUrl = parseGiftFinderPriceParam(searchParams?.get("maxPrice"));

  const [activeCategory, setActiveCategory] = useState<JewelleryCategorySlug>(categoryFromUrl);
  const [sortValue, setSortValue] = useState(DEFAULT_JEWELLERY_LISTING_SORT);
  const [filters, setFilters] = useState<JewelleryFilterState>(() => createEmptyFilterState());
  const [draftFilters, setDraftFilters] = useState<JewelleryFilterState>(() => createEmptyFilterState());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const facetsSyncedRef = useRef(false);
  const lastOccasionSlugRef = useRef<string | null>(null);
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

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    if (!hasMagentoFilterFacets(facets)) {
      return;
    }

    const occasionOption = resolveOccasionFacetOption(occasionSlug, facets.occasions);
    const occasionChanged = lastOccasionSlugRef.current !== (occasionSlug ?? null);
    lastOccasionSlugRef.current = occasionSlug ?? null;

    const priceParamsKey = `${minPriceFromUrl}|${maxPriceFromUrl}`;
    const priceParamsChanged = lastPriceParamsRef.current !== priceParamsKey;
    lastPriceParamsRef.current = priceParamsKey;

    const buildFiltersFromUrl = () => {
      let nextDraft = createDefaultFilterState(facets);
      if (occasionOption) {
        nextDraft.occasion = occasionOption.value;
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
      setDraftFilters(nextDraft);
      setFilters(nextDraft);
      return;
    }

    if (occasionChanged || priceParamsChanged) {
      const nextDraft = buildFiltersFromUrl();
      setDraftFilters(nextDraft);
      setFilters(nextDraft);
    }
  }, [facets, occasionSlug, minPriceFromUrl, maxPriceFromUrl]);

  const handleCategoryChange = useCallback(
    (category: JewelleryCategory) => {
      setActiveCategory(category.slug);
      router.replace(buildJewelleryCategoryHref(category.urlKey), { scroll: false });
    },
    [router],
  );

  const handleApplyFilters = (nextFilters: JewelleryFilterState) => {
    setFilters(nextFilters);
    setDraftFilters(nextFilters);
    setIsFilterOpen(false);
  };

  const handleOpenFilters = () => {
    void import("./JewelleryFilterDrawer");
    setDraftFilters(
      hasMagentoFilterFacets(facets)
        ? { ...createDefaultFilterState(facets), ...filters }
        : filters,
    );
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
        ) : (
          <JewelleryProductGrid
            products={products}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </section>

      <ScrollReveal delayMs={40}>
        <JewelleryLoadMoreSection
          visibleCount={products.length}
          totalCount={totalCount}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
        />
      </ScrollReveal>

      <ScrollReveal delayMs={0}>
        <JewelleryGuaranteesSection />
      </ScrollReveal>

      <JewelleryFilterDrawer
        open={isFilterOpen}
        filters={draftFilters}
        facets={facets}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />

      {isLoadingMore ? <span className="sr-only" aria-live="polite">Loading more products</span> : null}
    </div>
  );
};

export default JewelleryProductPage;
