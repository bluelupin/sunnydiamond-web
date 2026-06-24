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
    <section aria-labelledby="more-for-you-heading" className="px-4 py-16 lg:py-100">
      <PageContainer className="px-0 lg:px-4">
        <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 lg:gap-40">
          <div className="flex flex-col items-center gap-3 text-center lg:gap-0">
            <h2
              id="more-for-you-heading"
              className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-48"
            >
              <span className="lg:hidden">Your Diamond Awaits</span>
              <span className="hidden lg:inline">More for You</span>
            </h2>
            <p className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 lg:hidden">
              Traditional mastery bringing every diamond to radiant, eternal life.
            </p>
          </div>

          <div className="relative h-[237px] w-full overflow-hidden lg:h-[373px]">
            <div className="absolute left-0 top-0 h-[237px] w-[160px] overflow-hidden opacity-60 lg:hidden">
              <div className="relative mx-auto size-[262px] translate-x-[28px] -translate-y-[72px]">
                <Image
                  src={prevItem.image}
                  alt=""
                  fill
                  className="object-cover"
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
                  className="object-cover"
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
                    className="object-contain"
                    sizes="434px"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-0 flex w-full max-w-[260px] -translate-x-1/2 flex-col items-center lg:max-w-[600px] lg:w-[600px]">
              <div className="relative h-[170px] w-full overflow-hidden lg:h-[259px]">
                <div className="absolute left-1/2 top-1/2 size-[min(489px,120vw)] -translate-x-1/2 -translate-y-1/2 lg:size-[774px]">
                  <Image
                    src={activeItem.image}
                    alt={activeItem.name}
                    fill
                    className="object-contain lg:object-contain"
                    sizes="(max-width: 1024px) 90vw, 774px"
                    priority={false}
                  />
                </div>

                <div className="absolute left-1/2 top-1/2 flex w-[min(487px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 items-center justify-between max-lg:top-[calc(50%+89px)] max-lg:w-full max-lg:max-w-[311px] max-lg:gap-[255px]">
                  <button
                    type="button"
                    aria-label="Previous recommendation"
                    onClick={() => scrollTo(activeIndex - 1)}
                    className="pointer-events-auto inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                  >
                    <LeftArrow className="h-[17px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next recommendation"
                    onClick={() => scrollTo(activeIndex + 1)}
                    className="pointer-events-auto inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
                  >
                    <RightArrow className="h-[17px] w-[18px]" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-col items-center gap-4 lg:mt-[12px] lg:gap-[24px]">
                <p className="font-gill text-base leading-110 text-darkblack lg:text-20">{activeItem.name}</p>
                <DetailOutlineLink href={activeItem.href} className="min-w-[122px] uppercase max-lg:h-14">
                  Discover
                </DetailOutlineLink>
              </div>
            </div>

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
