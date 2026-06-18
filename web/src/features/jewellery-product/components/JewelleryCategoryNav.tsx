"use client";

import { cn } from "@/shared/utils/cn";
import { jewelleryCategories } from "../data/categories";
import { categoryIconMap } from "./CategoryIcons";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav
      aria-label="Jewellery categories"
      className="border-b border-gray600/40 bg-white"
    >
      <div className="container">
        <ul className="flex items-start gap-6 md:gap-10 overflow-x-auto py-6 md:py-8 scrollbar-none">
          {jewelleryCategories.map((category) => {
            const Icon = categoryIconMap[category.slug];
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className="group flex flex-col items-center gap-3 min-w-[72px] md:min-w-[88px]"
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border transition-colors",
                      isActive
                        ? "border-darkblack text-darkblack bg-gray200"
                        : "border-transparent text-darkblack/70 bg-gray200/60 group-hover:border-gray600",
                    )}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                  </span>
                  <span
                    className={cn(
                      "font-gill text-xs md:text-sm uppercase tracking-[1.8%] whitespace-nowrap",
                      isActive ? "text-darkblack font-normal" : "text-darkblack/60 font-light",
                    )}
                  >
                    {category.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default JewelleryCategoryNav;
