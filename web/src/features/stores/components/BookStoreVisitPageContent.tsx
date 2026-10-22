"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StoreLocatorBookStoreVisitPanelLazy from "./StoreLocatorBookStoreVisitPanelLazy";
import StoreLocatorHeroSection from "./StoreLocatorHeroSection";
import StoreLocatorSearchSection from "./StoreLocatorSearchSection";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import {
  filterBookStoreVisitStores,
  getStoreLocatorPinGeoLookupFieldError,
  getStoreLocatorPincodeSearchError,
  shouldShowPincodeMatchResults,
  shouldSuggestNearbyStores,
  type StoreLocatorPinGeoLookupOutcome,
} from "@/features/stores/utils/storeLocatorFilters";
import type { NearbySearchState } from "@/features/stores/hooks/useNearbySearchPoint";
import {
  DEFAULT_NEAREST_STORE_RADIUS_KM,
  type NormalizedStoreLocatorPage,
} from "@/services/store-locator/store-locator-page.types";
import { useNearbySearchPoint } from "@/features/stores/hooks/useNearbySearchPoint";
import { nearestStores } from "@/features/stores/utils/geo";

type BookStoreVisitPageContentProps = {
  page?: NormalizedStoreLocatorPage | null;
  isShowroomsLoading?: boolean;
};

function pinGeoLookupOutcome(nearbyPoint: NearbySearchState): StoreLocatorPinGeoLookupOutcome {
  switch (nearbyPoint.status) {
    case "loading":
      return "loading";
    case "found":
      return "found";
    case "pin-failed":
      return nearbyPoint.kind === "not-found" || nearbyPoint.kind === "invalid"
        ? "unknown-pin"
        : "unavailable";
    default:
      return "idle";
  }
}

const BookStoreVisitPageContent = ({
  page,
  isShowroomsLoading = false,
}: BookStoreVisitPageContentProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [pincodeInputCommitted, setPincodeInputCommitted] = useState(false);

  const initialStores = useMemo(
    () => (page?.showrooms ?? []).map(mapStoreLocatorShowroomToBookStoreVisit),
    [page?.showrooms],
  );

  const radiusKm = page?.nearestStoreRadiusKm ?? DEFAULT_NEAREST_STORE_RADIUS_KM;
  const { state: nearbyPoint, lookupPin, reset: resetNearbyPoint } = useNearbySearchPoint();

  // State 4 (valid PIN, no text match): measure real distances from the PIN.
  const handleSearchQueryChange = (query: string) => {
    setPincodeInputCommitted(false);
    setSearchQuery(query);
    const textMatches = filterBookStoreVisitStores(initialStores, query, null).length;
    if (shouldSuggestNearbyStores(query, textMatches)) {
      void lookupPin(query.trim());
    } else {
      resetNearbyPoint();
    }
  };

  const nearbyStores = useMemo(() => {
    const heading = `Showrooms near ${searchQuery.trim()}`;
    if (nearbyPoint.status === "loading") return { loading: true, results: [], heading };
    if (nearbyPoint.status !== "found") return undefined;
    return {
      loading: false,
      results: nearestStores(initialStores, nearbyPoint.point, radiusKm),
      heading,
    };
  }, [nearbyPoint, initialStores, radiusKm, searchQuery]);

  const pincodeError = useMemo(() => {
    const invalidMessage = page?.invalidPincodeMessage;
    const formatError = getStoreLocatorPincodeSearchError(searchQuery, invalidMessage, {
      pincodeInputCommitted,
    });
    if (formatError) {
      return formatError;
    }

    const textMatches = filterBookStoreVisitStores(initialStores, searchQuery, null).length;
    const geoError = getStoreLocatorPinGeoLookupFieldError(
      searchQuery,
      textMatches,
      pinGeoLookupOutcome(nearbyPoint),
      invalidMessage,
    );
    return geoError;
  }, [
    searchQuery,
    page?.invalidPincodeMessage,
    pincodeInputCommitted,
    nearbyPoint,
    initialStores,
  ]);

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
      getStoreLocatorPincodeSearchError(searchQuery, page?.invalidPincodeMessage, {
        pincodeInputCommitted,
      })
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
  }, [
    searchQuery,
    initialStores,
    pincodeError,
    pincodeInputCommitted,
    page?.invalidPincodeMessage,
    page?.locationFilters,
  ]);

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
          onSearchQueryChange={handleSearchQueryChange}
          onSelectedStateChange={handleSelectedStateChange}
          searchPlaceholder={page?.searchPlaceholder}
          locationFilters={page?.locationFilters}
          pincodeError={pincodeError}
          onPincodeValidationCommit={() => setPincodeInputCommitted(true)}
        />
      ) : null}
      <StoreLocatorBookStoreVisitPanelLazy
        variant="page"
        onBack={() => router.back()}
        storeSearchQuery={searchQuery}
        storeStateFilter={selectedState}
        initialStores={initialStores}
        isShowroomsLoading={isShowroomsLoading}
        getDirectionsLabel={page?.getDirectionsLabel}
        noResultsMessage={page?.noResultsMessage}
        invalidPincodeMessage={page?.invalidPincodeMessage}
        pincodeInputCommitted={pincodeInputCommitted}
        storeLocatorPincodeFieldError={pincodeError}
        listCopy={page?.listCopy}
        nearbyStores={nearbyStores}
      />
    </>
  );
};

export default BookStoreVisitPageContent;
