"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { LazyInView } from "@/shared/ui/LazyInView";
import Reveal from "@/shared/Animation/Reveal";
import { resolveCategoryNavImages } from "@/shared/utils/responsiveCmsImage";
import { buildJewelleryHref, JEWELLERY_PATH, parseJewelleryCategorySlug } from "@/features/jewellery-product/utils/jewelleryRoutes";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";
const IMAGE_QUALITY = 75;

type CraftingRarityCategoryCardProps = {
  category: CategoryNavigationItem;
};

const CraftingRarityCategoryCard = ({ category }: CraftingRarityCategoryCardProps) => {
  const [loadHoverImage, setLoadHoverImage] = useState(false);
  const prefetchHoverImage = useCallback(() => {
    setLoadHoverImage(true);
  }, []);

  const slug = category?.slug ?? "";
  const parsedCategory = parseJewelleryCategorySlug(slug);
  const categoryLink =
    category?.cta?.url ??
    category?.cta?.to ??
    (parsedCategory ? buildJewelleryHref(parsedCategory) : JEWELLERY_PATH);

  const {
    title,
    desktopImageUrl,
    mobileImageUrl,
    hoverDesktopImageUrl,
    hoverMobileImageUrl,
    imageAlt,
    hoverAlt,
    hasDistinctHover,
  } = resolveCategoryNavImages(category);

  const hasProductImage = Boolean(desktopImageUrl || mobileImageUrl);

  return (
    <Link
      href={categoryLink}
      className="group relative flex aspect-square h-full w-full flex-col items-center justify-between overflow-hidden bg-gray300"
      onPointerEnter={hasDistinctHover ? prefetchHoverImage : undefined}
      onFocus={hasDistinctHover ? prefetchHoverImage : undefined}
    >
      {hasDistinctHover && hoverDesktopImageUrl && loadHoverImage ? (
        <ResponsiveImage
          desktopSrc={hoverDesktopImageUrl}
          mobileSrc={hoverMobileImageUrl || hoverDesktopImageUrl}
          alt={hoverAlt}
          width={600}
          height={600}
          quality={IMAGE_QUALITY}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : null}

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pt-4 max-h-[303px] max-w-[303px] lg:px-6 lg:pt-6">
        {hasProductImage && desktopImageUrl ? (
          <ResponsiveImage
            desktopSrc={desktopImageUrl}
            mobileSrc={mobileImageUrl || desktopImageUrl}
            alt={imageAlt}
            width={600}
            height={600}
            quality={IMAGE_QUALITY}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`max-h-full max-w-full object-contain transition-opacity duration-500${hasDistinctHover ? " group-hover:opacity-0" : ""}`}
          />
        ) : null}
      </div>
      <div className="relative z-10 w-full shrink-0 pb-4 pt-2 lg:pb-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-3 bottom-0 -z-10 w-full bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="relative block text-center font-gill text-base font-normal leading-110 text-darkblack motion-safe:transition-colors motion-safe:duration-500 group-hover:text-white group-focus-visible:text-white lg:text-xl">
          {title}
        </span>
      </div>
    </Link>
  );
};

type CraftingRarityCategoryGridProps = {
  categories: CategoryNavigationItem[];
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
    return null;
  }

  return (
    <LazyInView
      className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12"
      fallback={<CategoryGridSkeleton />}
    >
      {categories.map((category) => (
        <Reveal
          direction="up"
          key={category?.id ?? category?.slug ?? category?.title}
          className="aspect-square w-full xl:h-[424px]"
        >
          <CraftingRarityCategoryCard category={category} />
        </Reveal>
      ))}
    </LazyInView>
  );
};

export default CraftingRarityCategoryGrid;
