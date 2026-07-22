"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { LazyInView } from "@/shared/ui/LazyInView";
import Reveal from "@/shared/Animation/Reveal";
import type { CraftingRarityCategory } from "@/features/cms/data/craftingRarityCategories";

type CraftingRarityCategoryCardProps = {
  category: CraftingRarityCategory;
};

const CraftingRarityCategoryCard = ({ category }: CraftingRarityCategoryCardProps) => {
  return (
    <Link
      href={category.href}
      className="group relative flex aspect-square h-full w-full flex-col items-center justify-between overflow-hidden bg-gray300"
    >
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pt-4 max-h-[303px] max-w-[303px] lg:px-6 lg:pt-6">
        {category.imageSrc ? (
          <OptimizedImage
            src={category.imageSrc}
            alt={category.label}
            width={303}
            height={303}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="max-h-full max-w-full object-contain"
          />
        ) : null}
      </div>
      <div className="relative z-10 w-full shrink-0 pb-4 pt-2 lg:pb-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-3 bottom-0 -z-10 w-full bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="relative block text-center font-gill text-base font-normal leading-110 text-darkblack motion-safe:transition-colors motion-safe:duration-500 group-hover:text-white group-focus-visible:text-white lg:text-xl">
          {category.label}
        </span>
      </div>
    </Link>
  );
};

type CraftingRarityCategoryGridProps = {
  categories: CraftingRarityCategory[];
  isLoading?: boolean;
};

const CategoryGridSkeleton = () => (
  <div className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12">
    {[0, 1, 2, 3].map((index) => (
      <div key={index} className="aspect-square animate-pulse bg-gray200" aria-hidden />
    ))}
  </div>
);

const CraftingRarityCategoryGrid = ({
  categories,
  isLoading = false,
}: CraftingRarityCategoryGridProps) => {
  if (isLoading) {
    return <CategoryGridSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <Reveal as="p" direction="up" className="px-4 py-20 text-center font-gill text-base text-neutral500 lg:px-10">
        No categories available.
      </Reveal>
    );
  }

  return (
    <LazyInView
      className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12"
      fallback={<CategoryGridSkeleton />}
    >
      {categories.map((category) => (
        <Reveal
          direction="up"
          key={category.id}
          className="aspect-square w-full xl:h-[424px]"
        >
          <CraftingRarityCategoryCard category={category} />
        </Reveal>
      ))}
    </LazyInView>
  );
};

export default CraftingRarityCategoryGrid;
