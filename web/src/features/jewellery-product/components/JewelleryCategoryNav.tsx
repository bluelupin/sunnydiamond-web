"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { jewelleryCategories } from "../data/categories";
import { categoryIconSrc } from "../data/categoryIcons";
import { categoryIconMap } from "./CategoryIcons";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav aria-label="Jewellery categories" className="border-b-[0.5px] border-neutral300 bg-white md:border-gray600/40">
      <div className="overflow-x-auto px-4 py-6 scrollbar-none md:container md:py-8">
        <ul className="flex w-max items-center gap-3 md:w-full md:gap-10">
          {jewelleryCategories.map((category) => {
            const Icon = categoryIconMap[category.slug];
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(category.slug)}
                  aria-pressed={isActive}
                  className="group flex w-14 flex-col items-center justify-center gap-2 md:min-w-[88px] md:gap-3"
                >
                  <span className="relative size-6 md:hidden">
                    <Image
                      src={categoryIconSrc[category.slug]}
                      alt=""
                      fill
                      className={cn(
                        "object-contain",
                        isActive ? "opacity-100" : "opacity-60",
                      )}
                      aria-hidden
                    />
                  </span>

                  <span
                    className={cn(
                      "hidden items-center justify-center rounded-full border transition-colors md:flex",
                      "h-14 w-14 md:h-16 md:w-16",
                      isActive
                        ? "border-darkblack bg-gray200 text-darkblack"
                        : "border-transparent bg-gray200/60 text-darkblack/70 group-hover:border-gray600",
                    )}
                  >
                    <Icon className="h-7 w-7 md:h-8 md:w-8" />
                  </span>

                  <span
                    className={cn(
                      "whitespace-nowrap font-gill text-sm leading-110 md:text-xs md:uppercase md:tracking-[1.8%]",
                      isActive
                        ? "font-semibold text-neutral500 md:font-normal md:text-darkblack"
                        : "font-normal text-gray600 md:font-light md:text-darkblack/60",
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
