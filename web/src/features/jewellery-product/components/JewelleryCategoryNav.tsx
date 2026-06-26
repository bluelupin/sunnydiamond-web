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
      <div className="overflow-x-auto scrollbar-none">
        <ul className="mx-auto flex w-max min-w-full items-center justify-center gap-[32px] p-40">
          {jewelleryCategories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className="flex w-86 flex-col items-center justify-center gap-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                >
                  <span className="relative size-10 shrink-0 overflow-hidden">
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
