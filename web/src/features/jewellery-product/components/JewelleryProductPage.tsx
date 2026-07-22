"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import JewelleryHeroSection from "./JewelleryHeroSection";
import JewelleryCategoryNav from "./JewelleryCategoryNav";
import JewelleryProductToolbar from "./JewelleryProductToolbar";
import JewelleryProductGrid from "./JewelleryProductGrid";
import JewelleryLoadMoreSection from "./JewelleryLoadMoreSection";
import JewelleryGuaranteesSection from "./JewelleryGuaranteesSection";
import JewelleryFilterDrawer from "./JewelleryFilterDrawer";
import { createDefaultFilterState, createEmptyFilterState, PAGE_SIZE, hasMagentoFilterFacets } from "../data/filters";
import {
  buildJewelleryCategoryHref,
  parseJewelleryCategorySlug,
} from "../utils/jewelleryRoutes";
import { resolveOccasionFacetOption } from "../utils/occasionListing";
import { useMagentoJewelleryListing } from "@/hooks/magento/useMagentoJewelleryListing";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import type { JewelleryCategory, JewelleryCategorySlug, JewelleryFilterState } from "../types";

const JewelleryProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryUrlKey =
    typeof params?.categoryUrl === "string" ? decodeURIComponent(params.categoryUrl) : null;
  const categoryFromPath = parseJewelleryCategorySlug(categoryUrlKey);
  const categoryFromQuery = parseJewelleryCategorySlug(searchParams?.get("category") ?? null);
  const categoryFromUrl = categoryFromPath ?? categoryFromQuery ?? "all";
  const occasionSlug = searchParams?.get("occasion");

  const [activeCategory, setActiveCategory] = useState<JewelleryCategorySlug>(categoryFromUrl);
  const [sortValue, setSortValue] = useState("featured");
  const [filters, setFilters] = useState<JewelleryFilterState>(() => createEmptyFilterState());
  const [draftFilters, setDraftFilters] = useState<JewelleryFilterState>(() => createEmptyFilterState());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const facetsSyncedRef = useRef(false);
  const lastOccasionSlugRef = useRef<string | null>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();

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
  });

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

    if (!facetsSyncedRef.current || occasionChanged) {
      facetsSyncedRef.current = true;
      const nextFilters = createDefaultFilterState(facets);
      if (occasionOption) {
        nextFilters.occasion = occasionOption.value;
      }
      setDraftFilters(nextFilters);
      setFilters(nextFilters);
      return;
    }

    if (occasionOption) {
      setFilters((current) =>
        current.occasion === occasionOption.value
          ? current
          : { ...current, occasion: occasionOption.value },
      );
    }
  }, [facets, occasionSlug]);

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
        {isLoading ? null : (
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
