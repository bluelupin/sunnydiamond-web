"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { sortOptions } from "../data/filters";

interface JewelleryProductToolbarProps {
  productCount: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onFilterOpen: () => void;
}

const JewelleryProductToolbar = ({
  productCount,
  sortValue,
  onSortChange,
  onFilterOpen,
}: JewelleryProductToolbarProps) => {
  return (
    <div className="sticky top-0 z-20 hidden bg-white md:block">
      <PageContainer className="flex h-[94px] items-center justify-between">
        <p className="font-gill text-20 font-light leading-110 text-neutral500">
          {productCount.toLocaleString("en-IN")} Products
        </p>

        <div className="flex items-center gap-[56px]">
          <button
            type="button"
            onClick={onFilterOpen}
            className="inline-flex items-center gap-3 py-1.5 font-gill text-20 uppercase leading-110 text-darkblack transition-colors hover:text-primary"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={24} strokeWidth={1.5} />
            Filter
          </button>

          <label className="inline-flex items-center gap-3 px-3 py-2 font-gill text-20 uppercase leading-110 text-darkblack">
            <span>Sort By</span>
            <span className="relative inline-flex items-center">
              <select
                value={sortValue}
                onChange={(event) => onSortChange(event.target.value)}
                className="cursor-pointer appearance-none bg-transparent pr-8 font-gill text-20 uppercase leading-110 text-darkblack focus:outline-none"
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={24} className="pointer-events-none absolute right-0" aria-hidden />
            </span>
          </label>
        </div>
      </PageContainer>
    </div>
  );
};

export default JewelleryProductToolbar;
