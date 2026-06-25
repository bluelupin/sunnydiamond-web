"use client";

import Image from "next/image";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import fallBackImage from "@/assets/fallBackImage.png";
import type { CategoryNavigationImage, CategoryNavigationItem } from "@/types/homepage/categoryNavigation";

interface CraftingRaritySectionProps {
  id?: string;
}

const CRAFTING_RARITY_NECKLACE = "/images/home/crafting-rarity-necklace.png";

const resolveCategoryImages = (cat: CategoryNavigationItem) => {
  const categoryImage = cat?.image as CategoryNavigationImage | undefined;
  const hoverImage = cat?.hoverImage as CategoryNavigationImage | undefined;

  const desktopImageUrl = resolveCmsMediaUrl(categoryImage?.desktopImage ?? categoryImage);
  const mobileImageUrl = resolveCmsMediaUrl(categoryImage?.mobileImage ?? categoryImage);
  const hoverDesktopImageUrl = resolveCmsMediaUrl(hoverImage?.desktopImage ?? hoverImage);
  const hoverMobileImageUrl = resolveCmsMediaUrl(hoverImage?.mobileImage ?? hoverImage);

  const title = cat?.title ?? cat?.label ?? cat?.cta?.label ?? "";
  const imageAlt =
    resolveCmsAltText(categoryImage?.desktopImage ?? categoryImage) ??
    resolveCmsAltText(categoryImage?.mobileImage ?? categoryImage) ??
    title;
  const hoverAlt =
    resolveCmsAltText(hoverImage?.desktopImage ?? hoverImage) ??
    resolveCmsAltText(hoverImage?.mobileImage ?? hoverImage) ??
    imageAlt;

  return {
    title,
    desktopImageUrl,
    mobileImageUrl,
    hoverDesktopImageUrl,
    hoverMobileImageUrl,
    imageAlt,
    hoverAlt,
  };
};

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
  } = resolveCategoryImages(cat);

  const hasHoverImage = Boolean(hoverDesktopImageUrl || hoverMobileImageUrl);
  const hasProductImage = Boolean(desktopImageUrl || mobileImageUrl);

  return (
    <Link
      href={categoryLink}
      className="group relative flex h-full w-full flex-col items-center overflow-hidden bg-[#F4F3EE] p-4 lg:h-[424px] lg:px-6 lg:py-12"
    >
      {hasHoverImage ? (
        <ResponsiveImage
          desktopSrc={hoverDesktopImageUrl || fallBackImage}
          mobileSrc={hoverMobileImageUrl || hoverDesktopImageUrl || fallBackImage}
          alt={hoverAlt}
          width={351}
          height={424}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : null}

      <div className="relative z-10 flex h-[176px] w-full items-center justify-center overflow-hidden lg:h-[303px]">
        {hasProductImage ? (
          <ResponsiveImage
            desktopSrc={desktopImageUrl || fallBackImage}
            mobileSrc={mobileImageUrl || desktopImageUrl || fallBackImage}
            alt={imageAlt}
            width={303}
            height={303}
            className="max-h-full max-w-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
        ) : null}
      </div>

      <div className="relative z-10 flex w-full items-center justify-center">
        <span className="text-center font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
          {title}
        </span>
      </div>
    </Link>
  );
};

const CraftingRaritySection = ({ id }: CraftingRaritySectionProps) => {
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const hero = shellData?.homepage?.hero || shellData?.hero;
  const subtitle = String(hero?.subtitle ?? "");
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
        className="bg-white pb-16 lg:pb-0"
        aria-busy="true"
        aria-label="Crafting rarity section loading"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 lg:gap-12 lg:px-10">
          <div className="relative h-[389px] overflow-hidden lg:h-[432px]">
            <div className="absolute bottom-0 left-0 flex max-w-[549px] flex-col gap-6 lg:bottom-auto lg:top-[132px] lg:gap-10">
              <div className="h-24 w-[min(420px,90vw)] animate-pulse rounded bg-gray200" aria-hidden />
              <div className="h-5 w-40 animate-pulse rounded bg-gray200" aria-hidden />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[226px] animate-pulse bg-gray200 lg:h-[424px]"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="bg-white pb-16 lg:pb-0">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 lg:gap-12 lg:px-10">
        <div className="relative h-[389px] overflow-hidden lg:h-[432px]">
          <ScrollReveal
            delayMs={60}
            className="pointer-events-none absolute right-[-29px] top-[-83px] size-[419px] lg:right-[2%] lg:top-[-204px] lg:size-[664px]"
          >
            <div className="relative h-full w-full rotate-[-13.91deg]">
              <Image
                src={CRAFTING_RARITY_NECKLACE}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 346px, 664px"
              />
            </div>
          </ScrollReveal>

          <div className="absolute bottom-0 left-0 z-10 flex w-full max-w-[640px] flex-col items-start gap-6 lg:bottom-auto lg:top-[132px] lg:gap-10">
            <ScrollReveal as="h2" delayMs={0} className="max-w-[549px] font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]">
              {subtitle.split("\n").map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {line}
                </span>
              ))}
            </ScrollReveal>

            {secondaryCtaUrl ? (
              <ScrollReveal delayMs={100}>
                <Link
                  href={secondaryCtaUrl}
                  className="border-b-[1.5px] border-darkblack pb-1 font-gill text-sm uppercase leading-110 text-darkblack"
                >
                  {secondaryCtaLabel}
                </Link>
              </ScrollReveal>
            ) : null}
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3">
            {categories.map((cat, index) => (
              <ScrollReveal key={cat?.id ?? cat?.slug ?? cat?.title} delayMs={120 + index * 80} className="h-full">
                <CategoryCard cat={cat} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delayMs={120}>
            <p className="py-20 text-center font-gill text-base text-neutral500">NO Categories Yet!</p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default CraftingRaritySection;
