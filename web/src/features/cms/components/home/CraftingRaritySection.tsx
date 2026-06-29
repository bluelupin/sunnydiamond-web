"use client";

import Image from "next/image";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { resolveCategoryNavImages } from "@/shared/utils/responsiveCmsImage";
import fallBackImage from "@/assets/fallBackImage.png";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";
import { cn } from "@/shared/utils/cn";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { useMemo } from "react";
import Reveal from "@/shared/Animation/Reveal";

interface CraftingRaritySectionProps {
  id?: string;
}
const CRAFTING_RARITY_NECKLACE = "/images/home/crafting-rarity-necklace.png";
const IMAGE_QUALITY = 90;
const CategoryCard = ({ cat }: { cat: CategoryNavigationItem }) => {
  const slug = cat?.slug ?? "";
  const categoryLink =
    cat?.cta?.url ??
    cat?.cta?.to ??
    (slug ? `/products?category=${encodeURIComponent(slug)}` : "/products");

  const {
    title,
    desktopImageUrl,
    mobileImageUrl,
    hoverDesktopImageUrl,
    hoverMobileImageUrl,
    imageAlt,
    hoverAlt,
    hasDistinctHover,
  } = resolveCategoryNavImages(cat);

  const hasProductImage = Boolean(desktopImageUrl || mobileImageUrl);

  return (
    <Link
      href={categoryLink}
      className="group relative flex aspect-square h-full w-full flex-col items-center justify-between overflow-hidden bg-gray300"
    >
      {hasDistinctHover &&
        <ResponsiveImage
          desktopSrc={hoverDesktopImageUrl || fallBackImage}
          mobileSrc={hoverMobileImageUrl || hoverDesktopImageUrl || fallBackImage}
          alt={hoverAlt}
          width={600}
          height={600}
          quality={IMAGE_QUALITY}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      }

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 lg:px-6 lg:pt-6 pt-4 max-w-[303px] max-h-[303px]">
        {hasProductImage &&
          <ResponsiveImage
            desktopSrc={desktopImageUrl || fallBackImage}
            mobileSrc={mobileImageUrl || desktopImageUrl || fallBackImage}
            alt={imageAlt}
            width={600}
            height={600}
            quality={IMAGE_QUALITY}
            className={`max-h-full max-w-full object-contain transition-opacity duration-500${hasDistinctHover ? " group-hover:opacity-0" : ""}`}
          />
        }
      </div>
      <div className="relative z-10 shrink-0 pt-2 pb-4 lg:pb-12 w-full">
        <span
          aria-hidden
          className="w-full pointer-events-none absolute inset-x-0 -top-3 bottom-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="relative block text-center font-gill text-base font-normal leading-110 text-darkblack motion-safe:transition-colors motion-safe:duration-500 group-hover:text-white group-focus-visible:text-white lg:text-xl">
          {title}
        </span>
      </div>
    </Link>
  );
};

function CraftingRarityCopyBlock({
  subtitleLines,
  secondaryCtaUrl,
  secondaryCtaLabel,
}: {
  subtitleLines: string[];
  secondaryCtaUrl: string;
  secondaryCtaLabel: string;
}) {
  return (
    <PageContainer className="px-4 md:px-8 lg:px-[40px] 2xl:px-[60px]">
      <div className="lg:h-432 h-390 w-full max-w-640 flex flex-col items-start sm:justify-center justify-end lg:gap-[40px] md:gap-8 gap-6">
        <Reveal as="h2" direction="up"
          className="lg:text-5xl sm:text-4xl text-32 font-larken font-light leading-110 text-darkblack"
        >
          {subtitleLines.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className="block"
            >
              {line}
            </span>
          ))}
        </Reveal>
        {secondaryCtaUrl &&
          <Reveal direction="up">
            <Link href={secondaryCtaUrl} className="relative after:bg-darkMagenta after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack hover:border-darkMagenta sm:pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:text-darkMagenta">
              {secondaryCtaLabel}
            </Link>
          </Reveal>
        }
      </div>
    </PageContainer>
  );
}

const CraftingRaritySection = ({ id }: CraftingRaritySectionProps) => {
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const hero = shellData?.homepage?.hero || shellData?.hero;
  const subtitle = String(hero?.subtitle ?? "");

  const subtitleLines = useMemo(() => {
    if (!subtitle.trim()) return [];

    // Preferred: allow editors to control line breaks from CMS
    if (subtitle.includes("\n")) {
      return subtitle
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    // Fallback for current content
    const breakAfter = "Crafting rarity";

    if (subtitle.startsWith(breakAfter)) {
      return [
        breakAfter,
        subtitle.slice(breakAfter.length).trim(),
      ];
    }

    return [subtitle];
  }, [subtitle]);
  const secondaryCtaUrl = hero?.secondaryCta?.url ?? hero?.secondaryCta?.to ?? "/products";
  const secondaryCtaLabel = hero?.secondaryCta?.label ?? "Explore Products";

  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const categories = Array.isArray(shoppingData?.categoryNavigation)
    ? [...shoppingData.categoryNavigation]
      .filter((item) => item?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    : [];

  const isLoading = isShellLoading || isShoppingLoading;

  if (isLoading) {
    return (
      <section
        id={id}
        className="w-full bg-white pb-16 lg:pb-0"
        aria-busy="true"
        aria-label="Crafting rarity section loading"
      >
        <div className="relative overflow-hidden h-390 md:h-420 lg:h-432">
          <div
            className={cn(
              "absolute bottom-0 flex max-w-[549px] flex-col gap-[24px] left-[16px] lg:bottom-auto lg:top-[132px] lg:gap-[40px]",
              "lg:left-[max(40px,calc(100vw*40/1440))]",
            )}
          >
            <div className="h-[106px] w-[min(549px,90vw)] animate-pulse rounded bg-gray200" aria-hidden />
            <div className="h-[19px] w-[134px] animate-pulse rounded bg-gray200" aria-hidden />
          </div>
        </div>
        <div className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square animate-pulse bg-gray200" aria-hidden />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="w-full bg-white md:pb-12 pb-16">
      <div className="relative overflow-hidden h-390 md:h-420 lg:h-432">
        <Reveal direction="up"
          className="pointer-events-none absolute right-[-29px] top-[-83px] size-[419px] lg:right-[2%] lg:top-[-204px] lg:size-[664px]"
        >
          <div className="relative h-full w-full rotate-[-13.91deg]">
            <Image
              src={CRAFTING_RARITY_NECKLACE}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              className="object-contain"
              sizes="(max-width: 1024px) 346px, 664px"
            />
          </div>
        </Reveal>
        <CraftingRarityCopyBlock
          subtitleLines={subtitleLines}
          secondaryCtaUrl={secondaryCtaUrl}
          secondaryCtaLabel={secondaryCtaLabel}
        />
      </div>

      {categories.length > 0 ? (
        <div className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12">
          {categories.map((cat, index) => (
            <Reveal direction="up"
              key={cat?.id ?? cat?.slug ?? cat?.title}
              className="aspect-square w-full xl:h-[424px]"
            >
              <CategoryCard cat={cat} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal as="p" direction="up" className="px-4 lg:px-[40px] py-20 text-center font-gill text-base text-neutral500">
          NO Categories Yet!
        </Reveal>
      )}
    </section>
  );
};

export default CraftingRaritySection;
