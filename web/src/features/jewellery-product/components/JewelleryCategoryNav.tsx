"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { jewelleryCategories } from "../data/categories";
import { categoryIconSrc } from "../data/categoryIcons";
import { jewelleryListingCategoryNavSpec } from "../data/content";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

const { padding, itemWidth, itemGap, navGap, iconSize } = jewelleryListingCategoryNavSpec;

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav
      aria-label="Jewellery categories"
      className="border-b-[0.5px] border-neutral300 bg-white"
    >
      <div className="overflow-x-auto scrollbar-none">
        <ul
          className="mx-auto flex w-max min-w-full items-center justify-center"
          style={{
            gap: `${navGap}px`,
            padding: `${padding}px`,
          }}
        >
          {jewelleryCategories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className="flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                  style={{
                    width: `${itemWidth}px`,
                    gap: `${itemGap}px`,
                  }}
                >
                  <span
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: `${iconSize}px`,
                      height: `${iconSize}px`,
                    }}
                  >
                    <Image
                      src={categoryIconSrc[category.slug]}
                      alt=""
                      width={iconSize}
                      height={iconSize}
                      className="size-full object-contain"
                      aria-hidden
                    />
                  </span>

                  <span
                    className={cn(
                      "whitespace-nowrap font-gill text-base leading-110",
                      isActive ? "font-semibold text-darkblack" : "font-normal text-gray600",
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
