"use client";

import { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { categoryIconSrc } from "../data/categoryIcons";
import { mapMagentoCategoriesToPlpNav } from "../utils/plpCategoryNav";
import { useMagentoJewelleryNav } from "@/hooks/magento/useMagentoJewelleryNav";
import type { JewelleryCategory, JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (category: JewelleryCategory) => void;
}

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  const { data } = useMagentoJewelleryNav();
  const categories = useMemo(
    () => (data?.categories ? mapMagentoCategoriesToPlpNav(data.categories) : []),
    [data?.categories],
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Jewellery categories"
      className="border-b-[0.5px] border-neutral300 bg-white"
    >
      <div className="overflow-x-auto scrollbar-none md:overflow-visible">
        <ul
          className={cn(
            "flex w-max items-center",
            "px-4",
            "md:w-full md:max-w-full md:justify-between",
            "lg:justify-center lg:gap-8 md:gap-6 gap-3 lg:py-[40px] md:py-8 py-6",
          )}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0 md:flex md:flex-1 md:justify-center lg:flex-none">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-[56px] flex-col items-center justify-center gap-[8px] md:w-full md:max-w-[86px] lg:w-[86px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden lg:size-10">
                    {(() => {
                      const Icon = categoryIconSrc[category.slug];
                      return <Icon className={cn("size-full text-current",
                        isActive ? "text-neutral500 lg:text-darkblack" : "text-gray600",
                      )} aria-hidden />;
                    })()}
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap font-gill text-sm leading-110 lg:text-base",
                      isActive ? "font-semibold text-neutral500 lg:text-darkblack" : "font-normal text-gray600",
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
