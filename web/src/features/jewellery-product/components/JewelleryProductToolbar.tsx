"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";
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
    <div className="container hidden flex-col gap-4 py-6 md:flex md:flex-row md:items-center md:justify-between md:py-8">
      <p className="font-gill text-sm md:text-base text-darkblack/80 tracking-[1%]">
        {productCount.toLocaleString("en-IN")} Products
      </p>

      <div className="flex items-center gap-6 md:gap-10">
        <button
          type="button"
          onClick={onFilterOpen}
          className="inline-flex items-center gap-2 font-gill text-sm md:text-base uppercase tracking-[1.8%] text-darkblack hover:text-primary transition-colors"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={18} strokeWidth={1.5} />
          Filter
        </button>

        <label className="inline-flex items-center gap-2 font-gill text-sm md:text-base uppercase tracking-[1.8%] text-darkblack">
          <span>Sort By</span>
          <span className="relative inline-flex items-center">
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="appearance-none bg-transparent pr-6 font-gill text-sm md:text-base uppercase tracking-[1.8%] text-darkblack cursor-pointer focus:outline-none"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-0" aria-hidden />
          </span>
        </label>
      </div>
    </div>
  );
};

export default JewelleryProductToolbar;
