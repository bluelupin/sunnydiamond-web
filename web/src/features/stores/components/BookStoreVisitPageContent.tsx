"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";
import StoreLocatorHeroSection from "./StoreLocatorHeroSection";
import StoreLocatorSearchSection from "./StoreLocatorSearchSection";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import {
  filterBookStoreVisitStores,
  getStoreLocatorPincodeSearchError,
} from "@/features/stores/utils/storeLocatorFilters";
import type { NormalizedStoreLocatorPage } from "@/services/store-locator/store-locator-page.types";

type BookStoreVisitPageContentProps = {
  page?: NormalizedStoreLocatorPage | null;
};

const BookStoreVisitPageContent = ({ page }: BookStoreVisitPageContentProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const initialStores = useMemo(
    () => (page?.showrooms ?? []).map(mapStoreLocatorShowroomToBookStoreVisit),
    [page?.showrooms],
  );

  const filteredStores = useMemo(
    () => filterBookStoreVisitStores(initialStores, searchQuery, selectedState),
    [initialStores, searchQuery, selectedState],
  );

  const pincodeError = useMemo(
    () => getStoreLocatorPincodeSearchError(searchQuery, filteredStores.length > 0),
    [filteredStores.length, searchQuery],
  );

  return (
    <>
      <StoreLocatorHeroSection hero={page?.hero} />
      <StoreLocatorSearchSection
        searchQuery={searchQuery}
        selectedState={selectedState}
        onSearchQueryChange={setSearchQuery}
        onSelectedStateChange={setSelectedState}
        searchPlaceholder={page?.searchPlaceholder}
        locationFilters={page?.locationFilters}
        pincodeError={pincodeError}
      />
      <BookStoreVisitPanel
        variant="page"
        onBack={() => router.back()}
        storeSearchQuery={searchQuery}
        storeStateFilter={selectedState}
        initialStores={initialStores}
        getDirectionsLabel={page?.getDirectionsLabel}
        noResultsMessage={page?.noResultsMessage}
      />
    </>
  );
};

export default BookStoreVisitPageContent;
