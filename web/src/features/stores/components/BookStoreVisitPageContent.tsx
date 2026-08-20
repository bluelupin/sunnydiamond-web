"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";
import StoreLocatorHeroSection from "./StoreLocatorHeroSection";
import StoreLocatorSearchSection from "./StoreLocatorSearchSection";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import { getStoreLocatorPincodeSearchError } from "@/features/stores/utils/storeLocatorFilters";
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
          onSelectedStateChange={setSelectedState}
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
