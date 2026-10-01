"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import type { BlogCategory } from "../types";
import { parseBlogsCategoryFromSearchParams } from "../utils/blogsListingQuery";

type BlogsFilterBarProps = {
  filterLabel: string;
  categories: BlogCategory[];
};

const BlogsFilterBar = ({ filterLabel, categories }: BlogsFilterBarProps) => {
  const searchParams = useSearchParams();
  const rawCategory = searchParams?.get("category") ?? "all";
  // Same fallback as the listing: an unknown category shows All, so highlight All.
  const selectedCategory = parseBlogsCategoryFromSearchParams(
    { category: searchParams?.get("category") ?? undefined },
    categories,
  );

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === rawCategory) {
      return;
    }

    const params = new URLSearchParams();

    if (categoryId !== "all") {
      params.set("category", categoryId);
    }

    const query = params.toString();
    // All posts are already on the client; a history entry keeps the URL, Back/Forward and
    // useSearchParams in sync without a server round trip.
    window.history.pushState(null, "", query ? `/blogs?${query}` : "/blogs");
  };

  return (
    <div className="mx-auto w-full 2xl:max-w-1920 max-w-1440 max-md:pl-4 max-md:pr-0 md:px-8 lg:px-10 2xl:px-[60px] pt-6 md:pt-10 lg:pt-16 md:pb-0 pb-6">
      <div className="flex flex-col items-start md:h-[38px] md:py-[2px] md:flex-row md:items-center md:justify-between gap-4">
        <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
          {filterLabel}
        </p>
        <div
          className="flex w-full items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:w-auto md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Blog categories"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="listitem"
                aria-pressed={isSelected}
                onClick={() => handleSelectCategory(category.id)}
                className={cn(
                  "shrink-0 px-4 md:h-[34px] h-[31px] flex justify-center items-center text-center font-gill font-normal leading-110 whitespace-nowrap",
                  "text-sm md:text-base",
                  isSelected
                    ? "bg-[#D1B57A] text-darkblack"
                    : "bg-gray300 text-darkblack",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogsFilterBar;
