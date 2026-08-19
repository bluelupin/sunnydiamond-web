"use client";

import SearchIcon from "@/assets/Icons/SearchIcon";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import {
  storeLocatorSearchFigmaSpec,
  type StoreLocatorStateFilter,
} from "../data/storeLocatorContent";
import StoreLocatorStateIcon, {
  StoreLocatorStateIconDesktop,
} from "./StoreLocatorStateIcon";
import type { NormalizedStoreLocatorLocationFilter } from "@/services/store-locator/store-locator-page.types";

type StoreLocatorSearchSectionProps = {
  searchQuery: string;
  selectedState: string | null;
  onSearchQueryChange: (value: string) => void;
  onSelectedStateChange: (state: string | null) => void;
  searchPlaceholder?: string | null;
  locationFilters?: NormalizedStoreLocatorLocationFilter[];
  /** Figma invalid-pincode error under the search field. */
  pincodeError?: string | null;
};

function mapCmsFiltersToStateFilters(
  filters: NormalizedStoreLocatorLocationFilter[],
): StoreLocatorStateFilter[] {
  return filters.map((filter) => ({
    id: filter.id,
    label: filter.label,
    iconUrl: filter.iconUrl,
    iconAlt: filter.iconAlt,
    iconWidth: 64,
    iconHeight: 64,
    mobileIconWidth: 40,
    mobileIconHeight: 40,
  }));
}

const StoreLocatorSearchSection = ({
  searchQuery,
  selectedState,
  onSearchQueryChange,
  onSelectedStateChange,
  searchPlaceholder,
  locationFilters,
  pincodeError,
}: StoreLocatorSearchSectionProps) => {
  const placeholder = searchPlaceholder?.trim() || "";
  const stateFilters =
    locationFilters && locationFilters.length > 0
      ? mapCmsFiltersToStateFilters(locationFilters)
      : [];
  const errorMessage = pincodeError?.trim() || undefined;

  return (
    <section
      aria-label="Find a showroom"
      className="px-4 py-6 md:border-b md:border-neutral300 md:px-0 md:py-10"
    >
      <div className="mx-auto flex w-full max-w-[676px] flex-col gap-6 md:items-center">
        <div className="flex w-full flex-col gap-2">
          <label className="relative block w-full">
            <span className="sr-only">{placeholder || "Search showrooms"}</span>
            <div className="flex h-14 w-full items-center gap-2 bg-aboutInactive p-3">
              <SearchIcon className="size-6 shrink-0 text-darkblack" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={placeholder}
                aria-invalid={errorMessage ? true : undefined}
                aria-describedby={errorMessage ? "store-locator-pincode-error" : undefined}
                className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack placeholder:font-normal placeholder:text-gray600 focus:outline-none"
              />
            </div>
          </label>
          <FormFieldError id="store-locator-pincode-error" message={errorMessage} />
        </div>

        {stateFilters.length > 0 ? (
          <div
            className="flex h-14 items-center gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:h-auto md:gap-8 [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Filter by state"
          >
            {stateFilters.map((state) => {
              // Prefer CMS label for filtering — showroom.state is a full name
              // (e.g. "Kerala"), while CMS `value` is often a short code ("KL").
              const cmsFilter = locationFilters?.find((item) => item.id === state.id);
              const filterValue = cmsFilter?.label ?? state.label;
              const isSelected =
                selectedState === filterValue ||
                selectedState === cmsFilter?.value ||
                selectedState === state.label;

              return (
                <button
                  key={state.id}
                  type="button"
                  role="listitem"
                  aria-pressed={isSelected}
                  onClick={() =>
                    onSelectedStateChange(isSelected ? null : filterValue)
                  }
                  className={cn(
                    "flex h-14 shrink-0 flex-col items-center justify-between transition-opacity hover:opacity-80 md:h-auto md:justify-center md:gap-2",
                    isSelected && "opacity-100",
                  )}
                  style={{ width: storeLocatorSearchFigmaSpec.stateItemWidth }}
                >
                  <StoreLocatorStateIcon state={state} variant="mobile" />
                  <StoreLocatorStateIconDesktop state={state} />
                  <span className="whitespace-nowrap font-gill text-sm font-normal leading-110 text-neutral500 md:text-base">
                    {state.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default StoreLocatorSearchSection;
