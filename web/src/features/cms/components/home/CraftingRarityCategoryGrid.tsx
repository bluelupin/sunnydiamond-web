"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { resolveCategoryNavImages } from "@/shared/utils/responsiveCmsImage";
import { buildJewelleryHref, parseJewelleryCategorySlug } from "@/features/jewellery-product/utils/jewelleryRoutes";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";
import {
  CategoryGridSkeleton,
} from "@/features/cms/components/home/CraftingRarityCategoryGridSkeleton";

const IMAGE_QUALITY = 75;
const hoverTransitionClassName =
  "motion-safe:transition-[padding,opacity,color] motion-safe:duration-500 motion-safe:ease-in-out";
const hoverImageTransitionClassName =
  "motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-in-out";

type CraftingRarityCategoryCardProps = {
  category: CategoryNavigationItem;
};

const CraftingRarityCategoryCard = ({ category }: CraftingRarityCategoryCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [loadHoverImage, setLoadHoverImage] = useState(false);
  const [hoverImageReady, setHoverImageReady] = useState({
    key: "",
    mobile: false,
    desktop: false,
  });
  const prefetchHoverImage = useCallback(() => {
    setLoadHoverImage(true);
  }, []);

  const slug = category?.slug ?? "";
  const parsedCategory = parseJewelleryCategorySlug(slug);
  const categoryLink =
    category?.cta?.url ??
    category?.cta?.to ??
    (parsedCategory ? buildJewelleryHref(parsedCategory) : "");
  const openInNewTab = category?.cta?.openInNewTab === true;

  const {
    title,
    desktopImageUrl,
    mobileImageUrl,
    hoverDesktopImageUrl,
    hoverMobileImageUrl,
    imageAlt,
    desktopImageAlt,
    mobileImageAlt,
    hoverAlt,
    hoverDesktopAlt,
    hoverMobileAlt,
    hasDistinctHover,
  } = resolveCategoryNavImages(category);

  const hasProductImage = Boolean(desktopImageUrl || mobileImageUrl);
  const hoverImageKey = `${hoverDesktopImageUrl ?? ""}|${hoverMobileImageUrl ?? ""}`;

  useEffect(() => {
    if (!hasDistinctHover || loadHoverImage || !cardRef.current ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setLoadHoverImage(true);
        observer.disconnect();
      }
    }, { rootMargin: "150px" });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasDistinctHover, loadHoverImage]);

  const handleHoverImageLoad = useCallback((image: HTMLImageElement, variant: "mobile" | "desktop" | "shared") => {
    const decoded = typeof image.decode === "function" ? image.decode() : Promise.resolve();
    void decoded.then(() => {
      setHoverImageReady((previous) => {
        const current = previous.key === hoverImageKey
          ? previous
          : { key: hoverImageKey, mobile: false, desktop: false };
        return {
          key: hoverImageKey,
          mobile: current.mobile || variant === "mobile" || variant === "shared",
          desktop: current.desktop || variant === "desktop" || variant === "shared",
        };
      });
    }).catch(() => {
      // Leave the original image visible if the optimized image cannot decode.
    });
  }, [hoverImageKey]);

  const canCrossfadeMobile = hasDistinctHover && hoverImageReady.key === hoverImageKey && hoverImageReady.mobile;
  const canCrossfadeDesktop = hasDistinctHover && hoverImageReady.key === hoverImageKey && hoverImageReady.desktop;

  if (!categoryLink) {
    return null;
  }

  return (
    <Link
      ref={cardRef}
      href={categoryLink}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex aspect-square h-full w-full flex-col items-center justify-between overflow-hidden bg-gray300",
        "px-4 pt-4 md:pt-8 lg:px-6 lg:pt-12",
        canCrossfadeMobile && "max-md:hover:px-0",
        canCrossfadeDesktop && "md:hover:px-0",
        hoverTransitionClassName,
      )}
      onPointerEnter={hasDistinctHover ? prefetchHoverImage : undefined}
      onFocus={hasDistinctHover ? prefetchHoverImage : undefined}
    >
      {hasDistinctHover && hoverDesktopImageUrl && loadHoverImage ? (
        <ResponsiveImage
          desktopSrc={hoverDesktopImageUrl}
          mobileSrc={hoverMobileImageUrl || hoverDesktopImageUrl}
          alt={hoverAlt}
          desktopAlt={hoverDesktopAlt}
          mobileAlt={hoverMobileAlt}
          width={600}
          height={600}
          quality={IMAGE_QUALITY}
          sizes="(max-width: 768px) 50vw, 25vw"
          onImageLoad={handleHoverImageLoad}
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover opacity-0",
            hoverImageTransitionClassName,
            canCrossfadeMobile && "max-md:group-hover:opacity-100 max-md:group-hover:delay-150 max-md:group-focus-visible:opacity-100 max-md:group-focus-visible:delay-150",
            canCrossfadeDesktop && "md:group-hover:opacity-100 md:group-hover:delay-150 md:group-focus-visible:opacity-100 md:group-focus-visible:delay-150",
          )}
        />
      ) : null}

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[38%] min-h-[88px] bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0",
          hoverImageTransitionClassName,
          canCrossfadeMobile && "max-md:group-hover:opacity-100 max-md:group-focus-visible:opacity-100",
          canCrossfadeDesktop && "md:group-hover:opacity-100 md:group-focus-visible:opacity-100",
        )}
      />

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden lg:max-h-[303px] md:max-h-[250px] lg:max-w-[303px] md:max-w-[250px] max-h-[176px] max-w-[133px] h-full w-full">
        {hasProductImage && desktopImageUrl ? (
          <ResponsiveImage
            desktopSrc={desktopImageUrl}
            mobileSrc={mobileImageUrl || desktopImageUrl}
            alt={imageAlt}
            desktopAlt={desktopImageAlt}
            mobileAlt={mobileImageAlt}
            width={600}
            height={600}
            quality={IMAGE_QUALITY}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "max-h-full max-w-full object-contain",
              hoverImageTransitionClassName,
              canCrossfadeMobile && "max-md:group-hover:opacity-0 max-md:group-focus-visible:opacity-0",
              canCrossfadeDesktop && "md:group-hover:opacity-0 md:group-focus-visible:opacity-0",
            )}
          />
        ) : null}
      </div>
      <div className="relative z-10 w-full shrink-0 pb-4 md:pb-10 lg:pb-[51px]">
        <span
          className={cn(
            "relative block text-center font-gill text-base font-normal leading-110 text-darkblack md:text-lg lg:text-xl",
            hoverTransitionClassName,
            canCrossfadeMobile && "max-md:group-hover:text-white max-md:group-focus-visible:text-white",
            canCrossfadeDesktop && "md:group-hover:text-white md:group-focus-visible:text-white",
          )}
        >
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

const CraftingRarityCategoryGrid = ({
  categories,
  isLoading = false,
}: CraftingRarityCategoryGridProps) => {
  if (isLoading) {
    return <CategoryGridSkeleton />;
  }

  const visibleCategories = categories.filter((category) => category?.showField !== false);

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <section className="grid w-full grid-cols-2 gap-3 px-4 md:grid-cols-4 md:px-0 lg:mt-12 md:mt-10 mt-8">
        {visibleCategories.map((category) => (
          <Reveal
            direction="up"
            key={category?.id ?? category?.slug ?? category?.title}
            className="aspect-square w-full xl:h-[424px] lg:h-[380px] md:h-[250px] h-[226px]"
          >
            <CraftingRarityCategoryCard category={category} />
          </Reveal>
        ))}
    </section>
  );
};

export default CraftingRarityCategoryGrid;
