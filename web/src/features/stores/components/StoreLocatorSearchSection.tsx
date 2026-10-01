"use client";

import SearchIcon from "@/assets/Icons/SearchIcon";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import { invalidFieldContainerClassName } from "@/shared/utils/formValidation";
import {
  storeLocatorDefaultSearchPlaceholder,
  storeLocatorSearchFigmaSpec,
} from "../data/storeLocatorContent";
import { sanitizeStoreLocatorSearchInput } from "../utils/storeLocatorFilters";
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

const StoreLocatorSearchSection = ({
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder,
  pincodeError,
}: StoreLocatorSearchSectionProps) => {
  const placeholder =
    searchPlaceholder?.trim() || storeLocatorDefaultSearchPlaceholder;
  const errorMessage = pincodeError?.trim() || undefined;
  const { searchMaxWidth, searchHeight } = storeLocatorSearchFigmaSpec;

  return (
    <section
      aria-label="Find a showroom"
      className="flex flex-col items-center justify-center border-b border-neutral300 px-4 py-6 md:px-0 md:pb-10 md:pt-16"
    >
      <div
        className="flex w-full flex-col items-center"
        style={{ maxWidth: searchMaxWidth }}
      >
        <div className="flex w-full flex-col gap-2">
          <label className="relative block w-full">
            <span className="sr-only">{placeholder}</span>
            <div
              className={cn(
                "flex w-full items-center gap-2 bg-[#F2F2F2] p-3",
                errorMessage && invalidFieldContainerClassName,
              )}
              style={{ minHeight: searchHeight }}
            >
              <SearchIcon className="size-6 shrink-0 text-darkblack" />
              <input
                type="text"
                autoComplete="off"
                value={searchQuery}
                onChange={(event) =>
                  onSearchQueryChange(sanitizeStoreLocatorSearchInput(event.target.value))
                }
                placeholder={placeholder}
                aria-label={placeholder}
                aria-invalid={errorMessage ? true : undefined}
                aria-describedby={
                  errorMessage ? "store-locator-pincode-error" : undefined
                }
                className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack placeholder:font-normal placeholder:text-gray600 focus:outline-none"
              />
            </div>
          </label>
          <FormFieldError
            id="store-locator-pincode-error"
            message={errorMessage}
          />
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorSearchSection;
