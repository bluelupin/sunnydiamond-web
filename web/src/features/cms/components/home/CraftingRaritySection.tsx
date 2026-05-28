"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useCategoryNavigationSection } from "@/hooks/homepage/useCategoryNavigationSection";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { useHeroSection } from "@/hooks/homepage/useHeroSection";
interface CraftingRaritySectionProps {
  id?: string;
}

const CraftingRaritySection = ({ id }: CraftingRaritySectionProps) => {
  const ref = useFadeIn();
  const { data: heroData, isLoading: isHeroLoading } = useHeroSection();
  const { data, isLoading } = useCategoryNavigationSection();
  const hero = heroData?.hero;
  if (isLoading) {
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
  const items = Array.isArray(data?.categoryNavigation)
    ? [...data.categoryNavigation]
      .filter((item) => item?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    : [];

  if (!hero?.subtitle || items.length === 0) {
    return null;
  }

  return (
    <section id={id} ref={ref} className="bg-white pb-3 flex flex-col gap-6 md:gap-8 lg:gap-10">
      <div className="relative overflow-hidden neckLaceArcContainer">
        <div className="container relative md:h-433 sm:h-465 h-465 py-6 sm:py-10 md:py-16 lg:py-20 flex lg:items-center items-end">
          <div className="relative z-10 max-w-560">
            <h2 className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] text-darkblack mb-40 leading-[100%] tracking-[0%]">
              {isHeroLoading ? (
                <span className="inline-block h-5 w-56 bg-white/20 rounded" aria-hidden />
              ) : (
                hero?.subtitle ?? ""
              )}
            </h2>
            <Link
              href="/"
              className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-8 h-50 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
            >
              <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Explore Products
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="md:px-3 pl-3">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:grid md:grid-cols-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {items.map((cat) => {
            const title = cat?.title ?? cat?.label ?? "";
            const slug = cat?.slug ?? "";
            const modelUrl = getCmsAssetUrl(cat?.model?.data?.attributes?.url);
            const productUrl = getCmsAssetUrl(cat?.product?.data?.attributes?.url);
            // if (!title || !modelUrl || !productUrl) return null;
            return (
              <Link
                key={cat?.id ?? slug ?? title}
                href={slug ? `/products?category=${encodeURIComponent(slug)}` : "/products"}
                className="group relative bg-gray300 flex flex-col flex-shrink-0 w-240 md:w-auto h-60 lg:h-260 xl:h-420 snap-start overflow-hidden"
              >
                {/* <OptimizedImage
                  src={modelUrl}
                  alt=""
                  width={640}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                /> */}
                <div aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />
                <div className="relative flex-1 flex items-center justify-center overflow-hidden p-6 md:p-10 transition-opacity duration-500 group-hover:opacity-0">
                  {/* <OptimizedImage
                    src={productUrl}
                    alt={`${title.toLowerCase()} collection`}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  /> */}
                </div>
                <div className="relative pb-6 md:pb-8 text-center z-10">
                  <span className="font-gill text-base lg:text-xl tracking-[1.8%] uppercase text-darkblack font-normal opacity-60 group-hover:opacity-100 group-hover:text-white transition-colors duration-500">
                    {title}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default CraftingRaritySection;
