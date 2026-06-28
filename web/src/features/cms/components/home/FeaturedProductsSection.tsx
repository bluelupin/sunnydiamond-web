"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
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

const FEATURED_CAROUSEL_COUNT = 3;

function getFallbackItems(): FeaturedCarouselItem[] {
  return getFeaturedProducts().slice(0, FEATURED_CAROUSEL_COUNT).map((product, index) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    href: `/product/${product.id}`,
    image: moreForYouTransparentImages[index % moreForYouTransparentImages.length],
  }));
}

function normalizeCarouselItems(cmsItems: FeaturedCarouselItem[]): FeaturedCarouselItem[] {
  const fallbacks = getFallbackItems();

  if (cmsItems.length === 0) {
    return fallbacks;
  }

  if (cmsItems.length >= FEATURED_CAROUSEL_COUNT) {
    return cmsItems.slice(0, FEATURED_CAROUSEL_COUNT);
  }

  const merged = [...cmsItems];
  for (const fallback of fallbacks) {
    if (merged.length >= FEATURED_CAROUSEL_COUNT) break;
    if (!merged.some((item) => String(item.id) === String(fallback.id))) {
      merged.push(fallback);
    }
  }

  return merged.slice(0, FEATURED_CAROUSEL_COUNT);
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
        className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl"
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

const DRAG_THRESHOLD_PX = 48;

function FeaturedProductsCarousel({
  items,
  ctaLabel,
  sectionLabel,
}: {
  items: FeaturedCarouselItem[];
  ctaLabel: string;
  sectionLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, pointerId: 0 });
  const dragSurfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length === 0) return;
    setActiveIndex((current) => {
      if (current >= items.length) return items.length >= 3 ? 1 : 0;
      return current;
    });
  }, [items.length]);

  const scrollTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length],
  );

  const onCarouselKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (items.length < 3) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollTo(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollTo(activeIndex + 1);
      }
    },
    [activeIndex, items.length, scrollTo],
  );

  const showSidePeeks = items.length >= 3;

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (items.length < 3) return;
      if ((event.target as HTMLElement).closest("button, a")) return;

      dragSurfaceRef.current?.setPointerCapture(event.pointerId);
      dragState.current = {
        active: true,
        startX: event.clientX,
        deltaX: 0,
        pointerId: event.pointerId,
      };
      setIsDragging(true);
    },
    [items.length],
  );

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = event.clientX - dragState.current.startX;
    dragState.current.deltaX = deltaX;
    setDragOffset(deltaX);
  }, []);

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState.current.active) return;

      const { deltaX } = dragState.current;
      dragState.current.active = false;

      try {
        dragSurfaceRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        /* noop */
      }

      setIsDragging(false);
      setDragOffset(0);

      if (deltaX <= -DRAG_THRESHOLD_PX) scrollTo(activeIndex + 1);
      else if (deltaX >= DRAG_THRESHOLD_PX) scrollTo(activeIndex - 1);
    },
    [activeIndex, scrollTo],
  );

  if (items.length === 0) return null;

  const prevIndex = showSidePeeks
    ? (activeIndex - 1 + items.length) % items.length
    : activeIndex;
  const nextIndex = showSidePeeks
    ? (activeIndex + 1) % items.length
    : activeIndex;
  const activeItem = items[activeIndex];
  const prevItem = items[prevIndex];
  const nextItem = items[nextIndex];

  const dragSurfaceClassName = cn(
    showSidePeeks && "touch-pan-y select-none",
    showSidePeeks && (isDragging ? "cursor-grabbing" : "cursor-grab"),
  );

  const dragSurfaceProps = showSidePeeks
    ? {
        ref: dragSurfaceRef,
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
      }
    : { ref: dragSurfaceRef };

  const centerImageDragStyle = isDragging
    ? { transform: `translate(calc(-50% + ${dragOffset}px), -50%)` }
    : undefined;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      tabIndex={0}
      onKeyDown={onCarouselKeyDown}
      {...dragSurfaceProps}
      className={cn(
        "relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:overflow-visible",
        dragSurfaceClassName,
      )}
    >
      {/* Desktop — Figma 684:2930: center card + left/right peeks */}
      <div className="relative mx-auto hidden w-full max-w-1360 md:block md:min-h-[411px]">
        {showSidePeeks ? (
          <div className="pointer-events-none absolute left-[-220px] top-0 h-[259px] w-[600px] overflow-hidden opacity-60">
            <div className="relative h-[410px] w-full">
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
        ) : null}

        <div className="relative mx-auto flex w-[600px] flex-col items-center">
          <div className="relative w-full">
            <div className="relative h-[259px] w-full overflow-hidden">
              <div
                className="absolute left-1/2 top-1/2 size-[774px] -translate-x-1/2 -translate-y-1/2"
                style={centerImageDragStyle}
              >
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  quality={IMAGE_QUALITY}
                  className="object-contain"
                  sizes="774px"
                />
              </div>
            </div>

            <div className="relative z-20 mx-auto flex w-[487px] max-w-[calc(100%-48px)] items-center justify-between lg:absolute lg:inset-x-0 lg:top-[130px] lg:mx-auto">
              <button
                type="button"
                aria-label="Previous product"
                disabled={!showSidePeeks}
                onClick={() => scrollTo(activeIndex - 1)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <LeftArrow className="h-[17px] w-[18px]" />
              </button>
              <button
                type="button"
                aria-label="Next product"
                disabled={!showSidePeeks}
                onClick={() => scrollTo(activeIndex + 1)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <RightArrow className="h-[17px] w-[18px]" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <p className="font-gill text-20 leading-110 text-darkblack">{activeItem.name}</p>
              {typeof activeItem.price === "number" ? (
                <p className="font-gill text-20 font-normal leading-110 text-darkblack">
                  <span aria-hidden>₹ </span>
                  {formatPrice(activeItem.price)}
                </p>
              ) : null}
            </div>
            <Link
              href={activeItem.href}
              className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {showSidePeeks ? (
          <div className="pointer-events-none absolute right-[-220px] top-0 h-[259px] w-[600px] overflow-hidden opacity-60">
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
        ) : null}
      </div>

      {/* Mobile — Figma 684:3238 */}
      <div className="relative h-[303px] w-full md:hidden">
        {showSidePeeks ? (
          <>
            <div className="absolute left-0 top-0 h-[237px] w-[160px] overflow-hidden opacity-60">
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

            <div className="absolute right-0 top-0 h-[237px] w-[160px] overflow-hidden opacity-60">
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
          </>
        ) : null}

        <div className="absolute left-1/2 top-0 flex w-full max-w-[260px] -translate-x-1/2 flex-col items-center">
          <div className="relative w-full">
            <div className="relative h-[170px] w-full overflow-hidden">
              <div
                className="absolute left-1/2 top-1/2 size-[min(489px,120vw)] -translate-x-1/2 -translate-y-1/2"
                style={centerImageDragStyle}
              >
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  quality={IMAGE_QUALITY}
                  className="object-contain"
                  sizes="489px"
                />
              </div>
            </div>

            <div className="relative z-20 mx-auto mt-2 flex w-full max-w-[303px] items-center justify-between">
              <button
                type="button"
                aria-label="Previous product"
                disabled={!showSidePeeks}
                onClick={() => scrollTo(activeIndex - 1)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <LeftArrow className="h-[17px] w-[18px]" />
              </button>
              <button
                type="button"
                aria-label="Next product"
                disabled={!showSidePeeks}
                onClick={() => scrollTo(activeIndex + 1)}
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <RightArrow className="h-[17px] w-[18px]" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <p className="font-gill text-base leading-110 text-darkblack">{activeItem.name}</p>
              {typeof activeItem.price === "number" ? (
                <p className="font-gill text-base font-normal leading-110 text-darkblack">
                  <span aria-hidden>₹ </span>
                  {formatPrice(activeItem.price)}
                </p>
              ) : null}
            </div>
            <Link
              href={activeItem.href}
              className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              {ctaLabel}
            </Link>
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

    return normalizeCarouselItems(mapped);
  }, [featuredProductsData?.products]);

  if (isShoppingLoading) {
    return (
      <section
        id={id}
        className="px-4 py-100 lg:px-40"
        aria-label="Featured diamond carousel"
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 overflow-visible lg:gap-40">
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
      className="px-4 py-100 lg:px-40"
      aria-label="Featured diamond carousel"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 overflow-visible lg:gap-40">
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
