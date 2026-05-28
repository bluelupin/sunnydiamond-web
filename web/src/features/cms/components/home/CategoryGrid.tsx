 "use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useOccasionsTeaser } from "@/hooks/homepage/useOccasionsTeaser";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";

interface CategoryGridProps {
  id?: string;
}

const CategoryGrid = ({ id }: CategoryGridProps) => {
  const { data, isLoading } = useOccasionsTeaser();
  const occasions = data?.occasionsTeaser ?? null;
  const ref = useFadeIn();

  if (isLoading) {
    return (
      <section id={id} ref={ref} className="bg-gray200 py-6 sm:py-10 md:py-16 lg:py-20" aria-busy="true">
        <div className="md:px-3 pl-3">
          <div className="md:mb-10 mb-8 h-10 w-80 bg-gray300 rounded mx-auto" aria-hidden />
          <div
            className="flex md:gap-4 gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative overflow-hidden flex-shrink-0 w-[78%] snap-start md:w-auto h-[320px] bg-gray300/70 rounded" aria-hidden />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const title = occasions?.title?.trim();
  const items = Array.isArray(occasions?.items)
    ? [...occasions.items]
      .filter((i) => i?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    : [];

  if (!title || items.length === 0) return null;

  return (
    <section id={id} ref={ref} className="bg-gray200 py-6 sm:py-10 md:py-16 lg:py-20">
      <div className="md:px-3 pl-3">
        <h2 className="md:mb-10 mb-8 lg:text-5xl md:text-4xl text-32 font-larken font-light tracking-[0%] leading-[100%] text-black text-center">
          {title}
        </h2>

        {/* Mobile: horizontal scroll | Desktop: 3-column full-width grid */}
        <div
          className="flex md:gap-4 gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {items.map((cat) => {
            const slug = cat?.slug ?? "";
            const label = cat?.label?.trim() ?? "";
            const imgUrl = getCmsAssetUrl(cat?.image?.data?.attributes?.url);
            if (!slug || !label || !imgUrl) return null;
            return (
              <Link
                key={cat?.id ?? slug}
                href={`/products?occasion=${encodeURIComponent(slug)}`}
                className="group relative overflow-hidden flex-shrink-0 w-[78%] snap-start md:w-auto h-auto transition-shadow duration-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <OptimizedImage
                  src={imgUrl}
                  alt={`${label.toLowerCase()} jewellery collection`}
                  width={800}
                  height={1024}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-5 md:bottom-6 flex items-center justify-center">
                  <span className="text-base sm:text-lg md:text-xl uppercase text-gray200 font-gill font-normal tracking-[1.8%] text-center leading-[100%]">
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
