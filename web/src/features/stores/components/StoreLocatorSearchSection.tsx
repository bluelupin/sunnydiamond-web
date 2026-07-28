"use client";

import Image from "next/image";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { cn } from "@/shared/utils/cn";
import {
  storeLocatorPageContent,
} from "../data/storeLocatorContent";

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
      className="border-b border-neutral300 py-10"
    >
      <div
        className="mx-auto flex w-full max-w-[676px] flex-col gap-6 px-4 md:px-0"
      >
        <label className="relative block">
          <span className="sr-only">{search.placeholder}</span>
          <div className="flex h-14 items-center gap-2 bg-aboutInactive p-3">
            <SearchIcon className="size-6 shrink-0 text-darkblack" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={search.placeholder}
              className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack placeholder:text-gray600 focus:outline-none"
            />
          </div>
        </label>

        <div
          className="flex gap-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  "flex w-[86px] shrink-0 flex-col items-center justify-center gap-2 transition-opacity",
                  isSelected ? "opacity-100" : "opacity-100 hover:opacity-80",
                )}
              >
                <div className="flex h-16 items-center justify-center">
                  <Image
                    src={state.iconSrc}
                    alt=""
                    width={state.iconWidth}
                    height={state.iconHeight}
                    aria-hidden
                    className="max-h-16 w-auto"
                  />
                </div>
                <span className="font-gill text-base font-normal leading-110 text-neutral500">
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
