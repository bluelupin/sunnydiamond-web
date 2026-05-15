 "use client";

import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { homeContent } from "@/data/content";
import { useFadeIn } from "@/hooks/use-fade-in";
import type { StaticImageData } from "next/image";

import occasionFestival from "@/assets/section6-card1.webp";
import occasionCocktail from "@/assets/section6-card2.webp";
import occasionWedding from "@/assets/section6-card3.webp";

const imageMap: Record<string, string | StaticImageData> = {
  festival: occasionFestival,
  cocktail: occasionCocktail,
  wedding: occasionWedding,
};

const CategoryGrid = ({ id }: { id?: string }) => {
  const { categories } = homeContent;
  const ref = useFadeIn();

  return (
    <section id={id} ref={ref} className="bg-gray200 py-10 sm:py-16 md:py-20">
      <div className="md:px-3">
        <h2 className="md:mb-10 mb-8 lg:text-5xl md:text-4xl text-32 font-larken font-light tracking-[0%] leading-[100%] text-black text-center">
          {categories.title}
        </h2>

        {/* Mobile: horizontal scroll | Desktop: 3-column full-width grid */}
        <div
          className="flex md:gap-4 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {categories.items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?occasion=${cat.slug}`}
              className="group relative overflow-hidden flex-shrink-0 w-[78%] snap-start md:w-auto h-350 md:h-auto lg:h-620 transition-shadow duration-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <OptimizedImage
                src={imageMap[cat.slug]}
                alt={`${cat.label.toLowerCase()} jewellery collection`}
                width={800}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 md:bottom-6 flex items-center justify-center">
                <span className="text-base sm:text-lg md:text-xl tracking-[0.3em] uppercase text-gray200 font-gill font-normal tracking-[1.8%] text-center leading-[100%]">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
