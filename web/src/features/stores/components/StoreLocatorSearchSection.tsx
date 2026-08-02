"use client";

import SearchIcon from "@/assets/Icons/SearchIcon";
import { cn } from "@/shared/utils/cn";
import {
  storeLocatorPageContent,
  storeLocatorSearchFigmaSpec,
} from "../data/storeLocatorContent";
import StoreLocatorStateIcon, {
  StoreLocatorStateIconDesktop,
} from "./StoreLocatorStateIcon";

type StoreLocatorSearchSectionProps = {
  searchQuery: string;
  selectedState: string | null;
  onSearchQueryChange: (value: string) => void;
  onSelectedStateChange: (state: string | null) => void;
};

const StoreLocatorSearchSection = ({
  searchQuery,
  selectedState,
  onSearchQueryChange,
  onSelectedStateChange,
}: StoreLocatorSearchSectionProps) => {
  const { search } = storeLocatorPageContent;

  return (
    <section
      aria-label="Find a showroom"
      className="px-4 py-6 md:border-b md:border-neutral300 md:px-0 md:py-10"
    >
      <div className="mx-auto flex w-full max-w-[676px] flex-col gap-6 md:items-center">
        <label className="relative block w-full">
          <span className="sr-only">{search.placeholder}</span>
          <div className="flex h-14 w-full items-center gap-2 bg-aboutInactive p-3">
            <SearchIcon className="size-6 shrink-0 text-darkblack" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={search.placeholder}
              className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack placeholder:font-normal placeholder:text-gray600 focus:outline-none"
            />
          </div>
        </label>

        <div
          className="flex h-14 items-center gap-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:h-auto md:gap-8 [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Filter by state"
        >
          {search.stateFilters.map((state) => {
            const isSelected = selectedState === state.label;

            return (
              <button
                key={state.id}
                type="button"
                role="listitem"
                aria-pressed={isSelected}
                onClick={() =>
                  onSelectedStateChange(isSelected ? null : state.label)
                }
                className={cn(
                  "flex h-14 shrink-0 flex-col items-center justify-between transition-opacity hover:opacity-80 md:h-auto md:justify-center md:gap-2",
                  isSelected && "opacity-100",
                )}
                style={{ width: storeLocatorSearchFigmaSpec.stateItemWidth }}
              >
                <StoreLocatorStateIcon state={state} variant="mobile" />
                <StoreLocatorStateIconDesktop state={state} />
                <span
                  className="whitespace-nowrap font-gill text-sm font-normal leading-110 text-neutral500 md:text-base"
                >
                  {state.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorSearchSection;
