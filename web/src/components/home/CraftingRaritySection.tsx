"use client";

import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { useFadeIn } from "@/hooks/use-fade-in";
import { getImageSrc } from "@/lib/utils/image";

import ringsProduct from "@/assets/category-rings-transparent.png";
import earringsProduct from "@/assets/category-earrings-transparent.png";
import braceletsProduct from "@/assets/category-bracelets-transparent.png";
import necklacesProduct from "@/assets/category-necklaces-transparent.png";
import ringsModel from "@/assets/category-rings-model.jpg";
import earringsModel from "@/assets/category-earrings-model.jpg";
import braceletsModel from "@/assets/category-bracelets-model.jpg";
import necklacesModel from "@/assets/category-necklaces-model.jpg";

const categories = [
  { label: "RINGS", slug: "Rings", product: ringsProduct, model: ringsModel },
  { label: "EARRINGS", slug: "Earrings", product: earringsProduct, model: earringsModel },
  { label: "BRACELETS", slug: "Bracelets", product: braceletsProduct, model: braceletsModel },
  { label: "NECKLACE", slug: "Necklaces", product: necklacesProduct, model: necklacesModel },
];

if (typeof window !== "undefined") {
  [ringsModel, earringsModel, braceletsModel, necklacesModel].forEach((src) => {
    const img = new Image();
    img.src = getImageSrc(src);
  });
}

const CraftingRaritySection = ({ id }: { id?: string }) => {
  const ref = useFadeIn();

  return (
    <section id={id} ref={ref} className="bg-white pb-3 flex flex-col gap-6 md:gap-8 lg:gap-10">
      <div className="relative overflow-hidden neckLaceArcContainer">
        <div className="relative max-w-[1440px] mx-auto w-full md:h-433 sm:h-465 h-465 py-6 sm:py-10 md:py-16 lg:py-20 px-6 md:px-10 lg:px-16 flex lg:items-center items-end">
          <div className="relative z-10 max-w-560">
            <h2 className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] text-darkblack mb-40 leading-[100%] tracking-[0%]">
              Crafting rarity into timeless brilliance
            </h2>
            <Link
              href="/products"
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
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-gray300 flex flex-col flex-shrink-0 w-240 md:w-auto h-60 lg:h-260 xl:h-420 snap-start overflow-hidden"
            >
              <OptimizedImage
                src={cat.model}
                alt=""
                width={640}
                height={800}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div className="relative flex-1 flex items-center justify-center overflow-hidden p-6 md:p-10 transition-opacity duration-500 group-hover:opacity-0">
                <OptimizedImage
                  src={cat.product}
                  alt={`${cat.label.toLowerCase()} collection`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative pb-6 md:pb-8 text-center z-10">
                <span className="font-gill text-base lg:text-xl tracking-[1.8%] uppercase text-darkblack font-normal opacity-60 group-hover:opacity-100 group-hover:text-white transition-colors duration-500">
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

export default CraftingRaritySection;
