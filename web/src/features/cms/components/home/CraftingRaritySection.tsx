"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type { CategoryNavigationImage, CategoryNavigationItem } from "@/types/homepage/categoryNavigation";

interface CraftingRaritySectionProps {
  id?: string;
}

const CraftingRaritySection = ({ id }: CraftingRaritySectionProps) => {
  const ref = useFadeIn();

  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const hero = shellData?.homepage?.hero || shellData?.hero;
  const subtitle = hero?.subtitle ?? "";
  const secondaryCtaUrl = hero?.secondaryCta?.url ?? "";
  const secondaryCtaLabel = hero?.secondaryCta?.label ?? "";

  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const categories = Array.isArray(shoppingData?.categoryNavigation)
    ? [...shoppingData.categoryNavigation]
      .filter((item) => item?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    : [];

  if (isShellLoading || isShoppingLoading) {
    return (
      <section id={id} ref={ref} className="bg-white pb-3 flex flex-col gap-6 md:gap-8 lg:gap-10" aria-busy="true">
        <div className="relative overflow-hidden neckLaceArcContainer">
          <div className="container relative md:h-433 sm:h-465 h-465 py-6 sm:py-10 md:py-16 lg:py-20 flex lg:items-center items-end">
            <div className="relative z-10 max-w-560">
              <div className="h-10 w-[min(520px,90%)] bg-gray200 rounded mb-10" aria-hidden />
              <div className="h-12 w-44 bg-gray200 rounded" aria-hidden />
            </div>
          </div>
        </div>
        <div className="md:px-3 pl-3">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:grid md:grid-cols-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-gray300 flex flex-col flex-shrink-0 w-240 md:w-auto h-60 lg:h-260 xl:h-420 snap-start overflow-hidden">
                <div className="w-full h-full bg-gray200/70" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id={id} ref={ref} className="bg-white pb-3 flex flex-col gap-6 md:gap-8 lg:gap-10">
      <div className="relative overflow-hidden neckLaceArcContainer">
        <div className="container relative md:h-433 sm:h-465 h-465 py-6 sm:py-10 md:py-16 lg:py-20 flex lg:items-center items-end">
          <div className="relative z-10 max-w-560">
            <h2 className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] text-darkblack mb-40 leading-[100%] tracking-[0%]">
              {isShellLoading ? (
                <span className="inline-block h-5 w-56 bg-white/20 rounded" aria-hidden />
              ) : (
                subtitle
              )}
            </h2>
            {!isShellLoading ? (
              <Link
                href={secondaryCtaUrl}
                className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-8 h-50 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
              >
                <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  {secondaryCtaLabel}
                </span>
              </Link>
            ) : (
              <div className="h-12 w-40 bg-white/20 rounded animate-pulse" />
            )}

          </div>
        </div>
      </div>
      {
        categories.length > 0 ?
          <div className="md:px-3 pl-3">
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:grid md:grid-cols-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
              {categories.map((cat) => {
                const title = cat?.title ?? cat?.label ?? cat?.cta?.label ?? "";
                const slug = cat?.slug ?? "";
                const categoryLink =
                  cat?.cta?.url ?? cat?.cta?.to ??
                  (slug ? `/products?category=${encodeURIComponent(slug)}` : "/products");

                const categoryImage = cat?.image as CategoryNavigationImage | undefined;
                const hoverImage = cat?.hoverImage as CategoryNavigationImage | undefined;

                const desktopImageUrl = resolveCmsMediaUrl(categoryImage?.desktopImage ?? categoryImage);
                const mobileImageUrl = resolveCmsMediaUrl(categoryImage?.mobileImage ?? categoryImage);
                const hoverDesktopImageUrl = resolveCmsMediaUrl(hoverImage?.desktopImage ?? hoverImage);
                const hoverMobileImageUrl = resolveCmsMediaUrl(hoverImage?.mobileImage ?? hoverImage);

                const imageAlt =
                  resolveCmsAltText(categoryImage?.desktopImage ?? categoryImage) ??
                  resolveCmsAltText(categoryImage?.mobileImage ?? categoryImage) ??
                  title;
                const hoverAlt =
                  resolveCmsAltText(hoverImage?.desktopImage ?? hoverImage) ??
                  resolveCmsAltText(hoverImage?.mobileImage ?? hoverImage) ??
                  imageAlt;

                return (
                  <Link
                    key={cat?.id ?? slug ?? title}
                    href={categoryLink}
                    className="group relative bg-gray300 flex flex-col flex-shrink-0 w-240 md:w-auto h-60 lg:h-260 xl:h-420 snap-start overflow-hidden"
                  >
                    <div className="relative flex-1 flex items-center justify-center overflow-hidden p-6 md:p-10 transition-opacity duration-500 group-hover:opacity-0">
                      {(desktopImageUrl || mobileImageUrl) && (
                        <ResponsiveImage
                          desktopSrc={desktopImageUrl || ""}
                          mobileSrc={mobileImageUrl}
                          alt={imageAlt}
                          priority
                          width={512}
                          height={512}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />)}
                    </div>
                    {(hoverDesktopImageUrl || hoverMobileImageUrl) && (
                      <ResponsiveImage
                        desktopSrc={hoverDesktopImageUrl || ""}
                        mobileSrc={hoverMobileImageUrl}
                        alt={hoverAlt}
                        priority
                        width={512}
                        height={512}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                      />
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    />
                    {!(desktopImageUrl || mobileImageUrl) && (
                      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-6 md:p-10 transition-opacity duration-500 group-hover:opacity-0">

                        <span className="text-center text-base lg:text-xl tracking-[1.8%] uppercase text-darkblack font-normal opacity-60 group-hover:opacity-100 group-hover:text-white transition-colors duration-500">
                          {title}
                        </span>
                      </div>
                    )}
                    <div className="relative pb-6 md:pb-8 text-center z-10">
                      <span className="font-gill text-base lg:text-xl tracking-[1.8%] uppercase text-darkblack font-normal opacity-60 group-hover:opacity-100 group-hover:text-white transition-colors duration-500">
                        {title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          :
          <p className="text-center p-20">NO Categories Yet!</p>
      }
    </section>
  );
};

export default CraftingRaritySection;
