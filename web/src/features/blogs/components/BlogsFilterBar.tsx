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
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("limit");

    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    const query = params.toString();
    router.push(query ? `/blogs?${query}` : "/blogs", { scroll: false });
  };

  return (
    <div className="mx-auto w-full max-w-1440 px-4 pt-10 md:px-10 md:pt-16">
      <div className="flex flex-col items-start gap-4 md:h-[38px] md:flex-row md:items-center md:justify-between md:gap-0">
        <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
          {filterLabel}
        </p>
        <div
          className="-mx-4 flex w-full items-center gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:w-auto md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
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
                  "shrink-0 px-4 py-2 text-center font-gill font-normal leading-110 whitespace-nowrap",
                  "text-t4-regular md:text-base",
                  isSelected
                    ? "max-md:bg-darkblack max-md:text-white bg-gray300 text-darkblack"
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
