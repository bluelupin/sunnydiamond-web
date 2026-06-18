"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import { DetailOutlineLink } from "./shared";

type ProductDetailMoreForYouSectionProps = {
  items: MoreForYouCarouselItem[];
};

const ProductDetailMoreForYouSection = ({ items }: ProductDetailMoreForYouSectionProps) => {
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
    <section aria-labelledby="more-for-you-heading" className="py-104">
      <PageContainer>
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-40">
          <h2
            id="more-for-you-heading"
            className="w-full text-center font-larken text-48 font-light leading-110 text-darkblack"
          >
            More for You
          </h2>

          <div className="relative h-[373px] w-full overflow-hidden">
            {/* Left peek */}
            <div className="pointer-events-none absolute left-[-220px] top-0 hidden h-[259px] w-[600px] overflow-hidden lg:block">
              <div className="relative h-[410px] w-full mix-blend-luminosity">
                <div className="absolute left-[calc(50%-61px)] top-[calc(50%-71px)] size-[434px]">
                  <Image
                    src={prevItem.image}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="434px"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            {/* Center featured slide */}
            <div className="absolute left-1/2 top-0 flex w-full max-w-[600px] -translate-x-1/2 flex-col items-center lg:w-[600px]">
              <div className="relative h-[259px] w-full overflow-hidden">
                <div className="absolute left-1/2 top-1/2 size-[min(774px,90vw)] -translate-x-1/2 -translate-y-1/2 lg:size-[774px]">
                  <Image
                    src={activeItem.image}
                    alt={activeItem.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 90vw, 774px"
                    priority={false}
                  />
                </div>

                <div className="absolute left-1/2 top-1/2 flex w-[min(487px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
                  <button
                    type="button"
                    aria-label="Previous recommendation"
                    onClick={() => scrollTo(activeIndex - 1)}
                    className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                  >
                    <LeftArrow className="h-[17px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next recommendation"
                    onClick={() => scrollTo(activeIndex + 1)}
                    className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                  >
                    <RightArrow className="h-[17px] w-[18px]" />
                  </button>
                </div>
              </div>

              <div className="mt-[12px] flex flex-col items-center gap-[24px]">
                <p className="font-gill text-20 leading-110 text-darkblack">{activeItem.name}</p>
                <DetailOutlineLink href={activeItem.href} className="min-w-[122px] uppercase">
                  Discover
                </DetailOutlineLink>
              </div>
            </div>

            {/* Right peek */}
            <div className="pointer-events-none absolute right-[-220px] top-0 hidden h-[259px] w-[600px] overflow-hidden lg:block">
              <div className="relative h-[240px] w-full">
                <div className="absolute left-[calc(50%+75px)] top-[calc(50%+15px)] size-[426px] -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={nextItem.image}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="426px"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default ProductDetailMoreForYouSection;
