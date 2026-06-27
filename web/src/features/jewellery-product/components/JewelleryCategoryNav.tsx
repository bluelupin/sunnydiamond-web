"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { jewelleryCategories } from "../data/categories";
import { categoryIconSrc } from "../data/categoryIcons";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav
      aria-label="Jewellery categories"
      className="border-b-[0.5px] border-neutral300 bg-white"
    >
      <div className="overflow-x-auto scrollbar-none lg:overflow-visible">
        <ul
          className={cn(
            "flex w-max items-center",
            "gap-[12px] px-[16px] py-[24px]",
            "lg:mx-auto lg:min-w-full lg:justify-center lg:gap-[32px] lg:p-[40px]",
          )}
        >
          {jewelleryCategories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-[56px] flex-col items-center justify-center gap-[8px] lg:w-[86px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                  )}
                >
                  <span className="flex size-[24px] shrink-0 items-center justify-center overflow-hidden lg:size-[40px]">
                    <Image
                      src={categoryIconSrc[category.slug]}
                      alt=""
                      width={40}
                      height={40}
                      className="size-full object-contain"
                      aria-hidden
                    />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap font-gill text-[14px] leading-110 lg:text-[16px]",
                      isActive ? "font-semibold text-[#4D4D4D] lg:text-darkblack" : "font-normal text-neutral400",
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
