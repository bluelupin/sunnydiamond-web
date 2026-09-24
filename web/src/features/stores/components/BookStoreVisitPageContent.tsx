"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";
import StoreLocatorHeroSection from "./StoreLocatorHeroSection";
import StoreLocatorSearchSection from "./StoreLocatorSearchSection";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import {
  filterBookStoreVisitStores,
  getStoreLocatorPincodeSearchError,
  shouldShowPincodeMatchResults,
  shouldSuggestNearbyStores,
} from "@/features/stores/utils/storeLocatorFilters";
import type { NormalizedStoreLocatorPage } from "@/services/store-locator/store-locator-page.types";

type BookStoreVisitPageContentProps = {
  page?: NormalizedStoreLocatorPage | null;
  isShowroomsLoading?: boolean;
};

const BookStoreVisitPageContent = ({
  page,
  isShowroomsLoading = false,
}: BookStoreVisitPageContentProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const initialStores = useMemo(
    () => (page?.showrooms ?? []).map(mapStoreLocatorShowroomToBookStoreVisit),
    [page?.showrooms],
  );

  const pincodeError = useMemo(
    () => getStoreLocatorPincodeSearchError(searchQuery, page?.invalidPincodeMessage),
    [searchQuery, page?.invalidPincodeMessage],
  );

  const handleSelectedStateChange = (state: string | null) => {
    setSelectedState(state?.trim() ? state.trim() : null);
  };

  // Spec §1.2 #2 — on match, highlight the corresponding state tab.
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query || pincodeError) return;

    const filtered = filterBookStoreVisitStores(initialStores, searchQuery, null);
    if (filtered.length === 0) return;
    if (
      shouldSuggestNearbyStores(searchQuery, filtered.length) ||
      getStoreLocatorPincodeSearchError(searchQuery, page?.invalidPincodeMessage)
    ) {
      return;
    }

    const isPincodeMatch = shouldShowPincodeMatchResults(searchQuery, filtered.length);
    const isLocationMatch = !/^\d+$/.test(query) && filtered.length > 0;
    if (!isPincodeMatch && !isLocationMatch) return;

    const matchedState = filtered[0]?.state?.trim();
    if (!matchedState) return;

    // Prefer the CMS filter label when it matches (e.g. Delhi → New Delhi).
    const matchedNorm =
      matchedState.toLowerCase() === "delhi" ? "new delhi" : matchedState.toLowerCase();
    const filterLabel = page?.locationFilters?.find((filter) => {
      const label = filter.label?.trim().toLowerCase() ?? "";
      return label === matchedNorm || label === matchedState.toLowerCase();
    })?.label?.trim();

    setSelectedState(filterLabel || matchedState);
  }, [searchQuery, initialStores, pincodeError, page?.invalidPincodeMessage, page?.locationFilters]);

  const showSearchSection = Boolean(
    page?.searchPlaceholder || (page?.locationFilters?.length ?? 0) > 0,
  );

  return (
    <>
      {page?.hero ? <StoreLocatorHeroSection hero={page.hero} /> : null}
      {showSearchSection ? (
        <StoreLocatorSearchSection
          searchQuery={searchQuery}
          selectedState={selectedState}
          onSearchQueryChange={setSearchQuery}
          onSelectedStateChange={handleSelectedStateChange}
          searchPlaceholder={page?.searchPlaceholder}
          locationFilters={page?.locationFilters}
          pincodeError={pincodeError}
        />
      ) : null}
      <BookStoreVisitPanel
        variant="page"
        onBack={() => router.back()}
        storeSearchQuery={searchQuery}
        storeStateFilter={selectedState}
        initialStores={initialStores}
        isShowroomsLoading={isShowroomsLoading}
        getDirectionsLabel={page?.getDirectionsLabel}
        noResultsMessage={page?.noResultsMessage}
        invalidPincodeMessage={page?.invalidPincodeMessage}
        listCopy={page?.listCopy}
      />
    </>
  );
};

export default BookStoreVisitPageContent;
