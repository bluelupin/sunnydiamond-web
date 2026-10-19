"use client";

import { useCallback } from "react";
import JewelleryListingEmptyState from "@/features/jewellery-product/components/JewelleryListingEmptyState";
import { searchListingEmptyStateContent } from "@/features/jewellery-product/data/content";
import { JEWELLERY_PATH } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { scrollToTopBeforeClientNavigation } from "@/shared/utils/navigation";

type SearchNoResultsProps = {
  query: string;
};

/** R-PS-6: search PLP empty — same shell as filter empty via JewelleryListingEmptyState. */
export default function SearchNoResults({ query }: SearchNoResultsProps) {
  const { title, clearSearchLabel } = searchListingEmptyStateContent;

  const handleClearSearch = useCallback(() => {
    scrollToTopBeforeClientNavigation();
  }, []);

  return (
    <JewelleryListingEmptyState
      title={title}
      description={`We couldn't find a match for "${query}". Try different filters or explore the full collection.`}
      onClearFilters={handleClearSearch}
      clearFiltersHref={JEWELLERY_PATH}
      clearFiltersLabel={clearSearchLabel}
      showFilterIcon={false}
    />
  );
}
