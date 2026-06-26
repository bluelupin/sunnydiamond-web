"use client";

import { useMemo, useState } from "react";
import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { LazyAnimatedSection } from "@/shared/ui/LazyAnimatedSection";
import JewelleryHeroSection from "./JewelleryHeroSection";
import JewelleryCategoryNav from "./JewelleryCategoryNav";
import JewelleryProductToolbar from "./JewelleryProductToolbar";
import JewelleryProductGrid from "./JewelleryProductGrid";
import JewelleryLoadMoreSection from "./JewelleryLoadMoreSection";
import JewelleryGuaranteesSection from "./JewelleryGuaranteesSection";
import JewelleryFilterDrawer from "./JewelleryFilterDrawer";
import { jewelleryListingProducts } from "../data/products";
import { defaultFilterState, PAGE_SIZE } from "../data/filters";
import { filterJewelleryProducts, sortJewelleryProducts } from "../utils/productFilters";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import type { JewelleryCategorySlug, JewelleryFilterState } from "../types";

const JewelleryProductPage = () => {
  const [activeCategory, setActiveCategory] = useState<JewelleryCategorySlug>("rings");
  const [sortValue, setSortValue] = useState("featured");
  const [filters, setFilters] = useState<JewelleryFilterState>(defaultFilterState);
  const [draftFilters, setDraftFilters] = useState<JewelleryFilterState>(defaultFilterState);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const filteredProducts = useMemo(
    () => sortJewelleryProducts(filterJewelleryProducts(jewelleryListingProducts, activeCategory, filters), sortValue),
    [activeCategory, filters, sortValue],
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleCategoryChange = (slug: JewelleryCategorySlug) => {
    setActiveCategory(slug);
    setVisibleCount(PAGE_SIZE);
  };

  const handleApplyFilters = (nextFilters: JewelleryFilterState) => {
    setFilters(nextFilters);
    setDraftFilters(nextFilters);
    setVisibleCount(PAGE_SIZE);
    setIsFilterOpen(false);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  return (
    <>
      <JewelleryHeroSection />
      <JewelleryCategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <JewelleryProductToolbar
        productCount={filteredProducts.length}
        sortValue={sortValue}
        onSortChange={setSortValue}
        onFilterOpen={() => {
          setDraftFilters(filters);
          setIsFilterOpen(true);
        }}
      />

      <section className="w-full bg-gray200 pb-0 md:pb-10">
        <JewelleryProductGrid
          products={visibleProducts}
          isWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      <ScrollReveal delayMs={40}>
        <JewelleryLoadMoreSection
          visibleCount={visibleProducts.length}
          totalCount={filteredProducts.length}
          hasMore={hasMore}
          onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
        />
      </ScrollReveal>

      <ScrollReveal delayMs={0}>
        <JewelleryGuaranteesSection />
      </ScrollReveal>

      <LazyAnimatedSection animate revealDelayMs={80} rootMargin="120px 0px 120px 0px">
        <TrustBadgeSection />
      </LazyAnimatedSection>

      <JewelleryFilterDrawer
        open={isFilterOpen}
        filters={draftFilters}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
};

export default JewelleryProductPage;
