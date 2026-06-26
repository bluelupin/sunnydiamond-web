"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { getFeaturedProducts } from "@/features/products/data/products";
import { moreForYouTransparentImages } from "@/features/products/data/moreForYouContent";

const IMAGE_QUALITY = 90;

/** Recommended transparent product PNG/WebP for CMS + fallbacks. */
export const FEATURED_PRODUCTS_IMAGE_SPEC = {
  /** Primary center slide — Figma display ~774px; upload 2× for retina. */
  width: 1600,
  height: 1600,
  aspectRatio: "1:1" as const,
  format: "PNG or WebP with transparent background",
  notes:
    "Center the product with ~12–15% padding on all sides so side peeks and object-contain crops stay clean.",
} as const;

const FALLBACK_TITLE = "Your Diamond Awaits";
const FALLBACK_DESCRIPTION =
  "Traditional mastery bringing every diamond to radiant, eternal life.";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

type FeaturedCarouselItem = {
  id: string | number;
  name: string;
  price: number | null;
  image: string;
  href: string;
};

interface FeaturedProductsSectionProps {
  id?: string;
}

function getFallbackItems(): FeaturedCarouselItem[] {
  return getFeaturedProducts().slice(0, 6).map((product, index) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    href: `/product/${product.id}`,
    image: moreForYouTransparentImages[index % moreForYouTransparentImages.length],
  }));
}

function FeaturedProductsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center lg:gap-4">
      <ScrollReveal
        as="h2"
        delayMs={0}
        className="font-larken text-32 font-light leading-110 text-darkblack lg:text-48"
      >
        {title}
      </ScrollReveal>
      <ScrollReveal
        delayMs={80}
        className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 lg:max-w-none lg:text-20"
      >
        {description}
      </ScrollReveal>
    </div>
  );
}

function FeaturedProductsCarousel({
  items,
  ctaLabel,
  sectionLabel,
}: {
  items: FeaturedCarouselItem[];
  ctaLabel: string;
  sectionLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length],
  );

  if (items.length === 0) return null;

  const prevIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;
  const activeItem = items[activeIndex];
  const prevItem = items[prevIndex];
  const nextItem = items[nextIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      className="relative h-[303px] w-full overflow-hidden lg:h-[411px]"
    >
      <div className="absolute left-0 top-0 h-[237px] w-[160px] overflow-hidden opacity-60 lg:hidden">
        <div className="relative mx-auto size-[262px] translate-x-[28px] -translate-y-[72px]">
          <Image
            src={prevItem.image}
            alt=""
            fill
            quality={IMAGE_QUALITY}
            className="object-contain"
            sizes="262px"
            aria-hidden
          />
        </div>
      </div>

      <div className="absolute right-0 top-0 h-[237px] w-[160px] overflow-hidden opacity-60 lg:hidden">
        <div className="relative mx-auto size-[262px] translate-x-[28px] -translate-y-[72px]">
          <Image
            src={nextItem.image}
            alt=""
            fill
            quality={IMAGE_QUALITY}
            className="object-contain"
            sizes="262px"
            aria-hidden
          />
        </div>
      </div>

      <div className="pointer-events-none absolute left-[-220px] top-0 hidden h-[259px] w-[600px] overflow-hidden lg:block">
        <div className="relative h-[410px] w-full mix-blend-luminosity">
          <div className="absolute left-[calc(50%-61px)] top-[calc(50%-71px)] size-[434px]">
            <Image
              src={prevItem.image}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              className="object-contain"
              sizes="434px"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 flex w-full max-w-[260px] -translate-x-1/2 flex-col items-center lg:w-[600px] lg:max-w-[600px]">
        <div className="relative w-full">
          <div className="relative h-[170px] w-full overflow-hidden lg:h-[259px]">
            <div className="absolute left-1/2 top-1/2 size-[min(489px,120vw)] -translate-x-1/2 -translate-y-1/2 lg:size-[774px]">
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                fill
                quality={IMAGE_QUALITY}
                className="object-contain"
                sizes="(max-width: 1024px) 489px, 774px"
              />
            </div>
          </div>

          <div className="relative z-20 mx-auto mt-2 flex w-full max-w-[303px] items-center justify-between lg:absolute lg:inset-x-0 lg:top-1/2 lg:mt-0 lg:w-[487px] lg:max-w-[calc(100%-48px)] lg:-translate-y-1/2">
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => scrollTo(activeIndex - 1)}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <LeftArrow className="h-[17px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => scrollTo(activeIndex + 1)}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <RightArrow className="h-[17px] w-[18px]" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-4 lg:mt-3 lg:gap-6">
          <div className="flex flex-col items-center gap-4 lg:gap-4">
            <p className="font-gill text-base leading-110 text-darkblack lg:text-20">
              {activeItem.name}
            </p>
            {typeof activeItem.price === "number" ? (
              <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-20">
                <span aria-hidden>₹ </span>
                {formatPrice(activeItem.price)}
              </p>
            ) : null}
          </div>
          <Link
            href={activeItem.href}
            className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack lg:h-14"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[-220px] top-0 hidden h-[259px] w-[600px] overflow-hidden lg:block">
        <div className="relative h-[240px] w-full">
          <div className="absolute left-[calc(50%+75px)] top-[calc(50%+15px)] size-[426px] -translate-x-1/2 -translate-y-1/2">
            <Image
              src={nextItem.image}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              className="object-contain"
              sizes="426px"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeaturedProductsSection = ({ id }: FeaturedProductsSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredProductsData =
    shoppingData?.homepage?.featuredProductsSection || shoppingData?.featuredProductsSection;

  const sectionTitle = featuredProductsData?.sectionTitle?.trim() || FALLBACK_TITLE;
  const description = featuredProductsData?.description?.trim() || FALLBACK_DESCRIPTION;
  const ctaLabel = featuredProductsData?.cta?.label?.trim() || "Discover";

  const items = useMemo(() => {
    const products = Array.isArray(featuredProductsData?.products)
      ? featuredProductsData.products
      : [];

    const mapped: FeaturedCarouselItem[] = products
      .map((product, index) => ({
        id: product?.id ?? index,
        name: product?.name ?? "",
        price: typeof product?.price === "number" ? product.price : null,
        image: getCmsAssetUrl(product?.image?.data?.attributes?.url) || "",
        href: `/product/${product?.id ?? ""}`,
      }))
      .filter((product) => Boolean(product.name) && Boolean(product.image));

    return mapped.length ? mapped : getFallbackItems();
  }, [featuredProductsData?.products]);

  if (isShoppingLoading) {
    return (
      <section
        id={id}
        className="overflow-hidden bg-white px-4 py-16 lg:px-40 lg:py-104"
        aria-label="Featured diamond carousel"
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 lg:gap-40">
          <div className="flex w-full flex-col items-center gap-3 text-center lg:gap-4">
            <div className="h-[35px] w-[283px] animate-pulse rounded bg-gray200 lg:h-[53px] lg:w-[424px]" aria-hidden />
            <div className="h-[36px] w-[306px] animate-pulse rounded bg-gray200 lg:h-[22px] lg:w-[517px]" aria-hidden />
          </div>
          <div className="relative h-[303px] w-full lg:h-[411px]">
            <div className="absolute left-1/2 top-0 h-[170px] w-[260px] -translate-x-1/2 animate-pulse rounded bg-gray200 lg:h-[259px] lg:w-[600px]" aria-hidden />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className="overflow-hidden bg-white px-4 py-16 lg:px-40 lg:py-104"
      aria-label="Featured diamond carousel"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 lg:gap-40">
        <FeaturedProductsHeader title={sectionTitle} description={description} />
        <FeaturedProductsCarousel
          items={items}
          ctaLabel={ctaLabel}
          sectionLabel={sectionTitle}
        />
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
