"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import type { BlogCategory } from "../types";

type BlogsFilterBarProps = {
  filterLabel: string;
  categories: BlogCategory[];
};

const BlogsFilterBar = ({ filterLabel, categories }: BlogsFilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams?.get("category") ?? "all";

  const handleSelectCategory = (categoryId: string) => {
    const params = new URLSearchParams();

    if (categoryId !== "all") {
      params.set("category", categoryId);
    }

    const query = params.toString();
    router.push(query ? `/blogs?${query}` : "/blogs", { scroll: false });
  };

  return (
    <div className="mx-auto w-full 2xl:max-w-1920 max-w-1440 max-md:pl-4 max-md:pr-0 md:px-8 lg:px-10 2xl:px-[60px] pt-6 md:pt-10 lg:pt-16 md:pb-0 pb-10">
      <div className="flex flex-col items-start md:h-[38px] py-[2px] md:flex-row md:items-center md:justify-between gap-4">
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
                    ? "bg-darkblack text-white"
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
