"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import JewelleryListingEmptyState from "@/features/jewellery-product/components/JewelleryListingEmptyState";
import { searchListingEmptyStateContent } from "@/features/jewellery-product/data/content";
import { JEWELLERY_PATH } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { scrollToTopBeforeClientNavigation } from "@/shared/utils/navigation";

type SearchNoResultsProps = {
  query: string;
};

/** R-PS-6: search PLP empty — same shell as filter empty via JewelleryListingEmptyState. */
export default function SearchNoResults({ query }: SearchNoResultsProps) {
  const router = useRouter();
  const { title, clearSearchLabel } = searchListingEmptyStateContent;

  const handleClearSearch = useCallback(() => {
    scrollToTopBeforeClientNavigation();
    router.push(JEWELLERY_PATH);
  }, [router]);

  return (
    <JewelleryListingEmptyState
      title={title}
      description={`We couldn't find a match for "${query}". Try a different spelling or browse all jewellery.`}
      onClearFilters={handleClearSearch}
      clearFiltersLabel={clearSearchLabel}
      showFilterIcon={false}
    />
  );
}
