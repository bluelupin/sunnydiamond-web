"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageSrc } from "@/shared/utils/image";
import { cn } from "@/shared/utils/cn";
import type { ProductDetailContent } from "@/features/products/types/productDetail";
import { DetailOutlineLink } from "./shared";

type ProductDetailPairWithSectionProps = {
  pairWith: ProductDetailContent["pairWith"];
};

const ProductDetailPairWithSection = ({ pairWith }: ProductDetailPairWithSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = pairWith.items;

  const scrollTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const normalized = (index + items.length) % items.length;
      setActiveIndex(normalized);
    },
    [items.length],
  );

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <section aria-labelledby="pair-it-with-heading" className="py-16 lg:py-[104px]">
      <h2
        id="pair-it-with-heading"
        className="mb-11 px-5 font-larken text-[40px] font-light leading-110 text-darkblack md:px-8 lg:px-10 lg:text-48"
      >
        Pair it With
      </h2>

      <div className="grid lg:grid-cols-2">
        <div className="relative h-[420px] overflow-hidden lg:h-[800px]">
          <Image
            src={pairWith.collectionImage}
            alt={pairWith.collectionTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 720px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-10 px-10 text-white">
            <h3 className="font-larken text-[40px] font-light leading-none lg:text-48">{pairWith.collectionTitle}</h3>
            <p className="mt-5 max-w-[418px] font-gill text-xl font-light leading-[1.2] tracking-[0.2px]">
              {pairWith.collectionDescription}
            </p>
          </div>
        </div>

        <div className="relative h-[420px] overflow-hidden lg:h-[800px]">
          <Image
            src={getImageSrc(activeItem.image) ?? ""}
            alt={activeItem.name}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1024px) 100vw, 720px"
          />

          <div className="absolute inset-x-0 top-[380px] flex flex-col items-center gap-[92px] px-10">
            <div className="flex w-full max-w-[640px] items-center justify-between">
              <button
                type="button"
                aria-label="Previous product"
                onClick={() => scrollTo(activeIndex - 1)}
                className="inline-flex size-10 items-center justify-center"
              >
                <ChevronLeft size={25} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                aria-label="Next product"
                onClick={() => scrollTo(activeIndex + 1)}
                className="inline-flex size-10 items-center justify-center"
              >
                <ChevronRight size={25} strokeWidth={1.25} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-gill text-xl leading-110 text-darkblack">{activeItem.name}</p>
              <DetailOutlineLink href={activeItem.href} className="min-w-[132px]">
                Shop Now
              </DetailOutlineLink>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-[5.6px] overflow-x-auto px-6 pb-0">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`View ${item.name}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "bg-gray300 px-4 py-6 transition-opacity",
                  index === activeIndex ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              >
                <div className="relative size-[98px] overflow-hidden">
                  <Image
                    src={getImageSrc(item.image) ?? ""}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="98px"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPairWithSection;
