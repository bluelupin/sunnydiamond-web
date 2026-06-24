"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { jewelleryCategories } from "../data/categories";
import { categoryIconSrc } from "../data/categoryIcons";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav aria-label="Jewellery categories" className="border-b-[0.5px] border-neutral300 bg-white">
      <PageContainer className="overflow-x-auto py-6 scrollbar-none md:py-10">
        <ul className="mx-auto flex w-max items-center gap-3 md:w-full md:justify-center md:gap-8">
          {jewelleryCategories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className="flex w-14 flex-col items-center justify-center gap-2 md:w-86 md:gap-2"
                >
                  <span className="relative size-6 md:size-10">
                    <Image
                      src={categoryIconSrc[category.slug]}
                      alt=""
                      fill
                      className={cn("object-contain", !isActive && "opacity-60 md:opacity-100")}
                      aria-hidden
                    />
                  </span>

                  <span
                    className={cn(
                      "whitespace-nowrap font-gill text-sm leading-110 md:text-base",
                      isActive
                        ? "font-semibold text-neutral500 md:font-semibold md:text-darkblack"
                        : "font-normal text-gray600 md:font-normal md:text-gray600",
                    )}
                  >
                    {category.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </nav>
  );
};

export default JewelleryCategoryNav;
