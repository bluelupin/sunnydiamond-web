"use client";

import { blogsPageContent } from "../data/content";
import type { BlogCategoryId } from "../types";

type BlogsFilterBarProps = {
  selectedCategory: BlogCategoryId;
  onSelectCategory: (category: BlogCategoryId) => void;
};

const BlogsFilterBar = ({ selectedCategory, onSelectCategory }: BlogsFilterBarProps) => {
  const { filterLabel, categories } = blogsPageContent;

  return (
    <div className="mx-auto w-full max-w-1440 px-4 pt-16 md:px-10">
      <div
        className="flex min-h-[38px] flex-col gap-4 md:h-[38px] md:flex-row md:items-center md:justify-between md:gap-0"
      >
        <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
          {filterLabel}
        </p>
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:pb-0 [&::-webkit-scrollbar]:hidden"
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
                onClick={() => onSelectCategory(category.id)}
                className="shrink-0 bg-gray300 px-4 py-2 text-center font-gill text-base font-normal leading-110 text-darkblack"
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
