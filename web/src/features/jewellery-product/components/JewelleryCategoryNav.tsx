"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { jewelleryCategories } from "../data/categories";
import { categoryIconSrc } from "../data/categoryIcons";
import {
  jewelleryListingCategoryNavMobileSpec,
  jewelleryListingCategoryNavSpec,
} from "../data/content";
import type { JewelleryCategorySlug } from "../types";

interface JewelleryCategoryNavProps {
  activeCategory: JewelleryCategorySlug;
  onCategoryChange: (slug: JewelleryCategorySlug) => void;
}

type CategoryNavItemProps = {
  category: (typeof jewelleryCategories)[number];
  isActive: boolean;
  onSelect: () => void;
  iconSize: number;
  itemWidth: number;
  itemGap: number;
  labelFontSize: number;
  activeLabelColor: string;
  inactiveLabelColor: string;
};

const CategoryNavItem = ({
  category,
  isActive,
  onSelect,
  iconSize,
  itemWidth,
  itemGap,
  labelFontSize,
  activeLabelColor,
  inactiveLabelColor,
}: CategoryNavItemProps) => (
  <li className="shrink-0">
    <button
      type="button"
      onClick={onSelect}
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
          "whitespace-nowrap font-gill leading-110",
          isActive ? "font-semibold" : "font-normal",
        )}
        style={{
          fontSize: `${labelFontSize}px`,
          color: isActive ? activeLabelColor : inactiveLabelColor,
        }}
      >
        {category.label}
      </span>
    </button>
  </li>
);

const JewelleryCategoryNav = ({ activeCategory, onCategoryChange }: JewelleryCategoryNavProps) => {
  return (
    <nav
      aria-label="Jewellery categories"
      className="border-b-[0.5px] border-neutral300 bg-white"
    >
      <div className="overflow-x-auto scrollbar-none lg:overflow-visible">
        <ul
          className="flex w-max items-center lg:hidden"
          style={{
            gap: `${jewelleryListingCategoryNavMobileSpec.navGap}px`,
            paddingLeft: `${jewelleryListingCategoryNavMobileSpec.paddingX}px`,
            paddingRight: `${jewelleryListingCategoryNavMobileSpec.paddingX}px`,
            paddingTop: `${jewelleryListingCategoryNavMobileSpec.paddingY}px`,
            paddingBottom: `${jewelleryListingCategoryNavMobileSpec.paddingY}px`,
          }}
        >
          {jewelleryCategories.map((category) => (
            <CategoryNavItem
              key={category.slug}
              category={category}
              isActive={activeCategory === category.slug}
              onSelect={() => onCategoryChange(category.slug)}
              iconSize={jewelleryListingCategoryNavMobileSpec.iconSize}
              itemWidth={jewelleryListingCategoryNavMobileSpec.itemWidth}
              itemGap={jewelleryListingCategoryNavMobileSpec.itemGap}
              labelFontSize={jewelleryListingCategoryNavMobileSpec.labelFontSize}
              activeLabelColor={jewelleryListingCategoryNavMobileSpec.activeLabelColor}
              inactiveLabelColor={jewelleryListingCategoryNavMobileSpec.inactiveLabelColor}
            />
          ))}
        </ul>

        <ul
          className="mx-auto hidden w-max min-w-full items-center justify-center lg:flex"
          style={{
            gap: `${jewelleryListingCategoryNavSpec.navGap}px`,
            padding: `${jewelleryListingCategoryNavSpec.padding}px`,
          }}
        >
          {jewelleryCategories.map((category) => (
            <CategoryNavItem
              key={category.slug}
              category={category}
              isActive={activeCategory === category.slug}
              onSelect={() => onCategoryChange(category.slug)}
              iconSize={jewelleryListingCategoryNavSpec.iconSize}
              itemWidth={jewelleryListingCategoryNavSpec.itemWidth}
              itemGap={jewelleryListingCategoryNavSpec.itemGap}
              labelFontSize={jewelleryListingCategoryNavSpec.labelFontSize}
              activeLabelColor={jewelleryListingCategoryNavSpec.activeLabelColor}
              inactiveLabelColor={jewelleryListingCategoryNavSpec.inactiveLabelColor}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default JewelleryCategoryNav;
