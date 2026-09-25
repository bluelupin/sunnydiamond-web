"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import type { FeaturedCarouselItem } from "@/features/cms/components/home/FeaturedProductsCarousel";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import "slick-carousel/slick/slick.css";

type SliderWithInner = Slider & {
  innerSlider?: {
    onWindowResized?: () => void;
  };
};

const CENTER_PADDING_RULES = [
  { maxWidth: 480, padding: "100px" },
  { maxWidth: 640, padding: "120px" },
  { maxWidth: 768, padding: "150px" },
  { maxWidth: 1024, padding: "200px" },
  { maxWidth: 1280, padding: "270px" },
  { maxWidth: 1440, padding: "350px" },
  { maxWidth: 1600, padding: "400px" },
] as const;

const DEFAULT_CENTER_PADDING = "800px";

function resolveCenterPadding(width: number): string {
  for (const rule of CENTER_PADDING_RULES) {
    if (width <= rule.maxWidth) {
      return rule.padding;
    }
  }

  return DEFAULT_CENTER_PADDING;
}

function useEducationCenterPadding() {
  const [centerPadding, setCenterPadding] = useState(DEFAULT_CENTER_PADDING);

  useEffect(() => {
    const sync = () => {
      setCenterPadding(resolveCenterPadding(window.innerWidth));
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return centerPadding;
}

function normalizeIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

type EducationCenterModeSliderProps = {
  items: FeaturedCarouselItem[];
  ctaLabel: string;
  showCta?: boolean;
};

export default function EducationCenterModeSlider({
  items,
  ctaLabel,
  showCta = true,
}: EducationCenterModeSliderProps) {
  const sliderRef = useRef<Slider>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const centerPadding = useEducationCenterPadding();

  const refreshSlider = useCallback(() => {
    const slider = sliderRef.current as SliderWithInner | null;
    slider?.innerSlider?.onWindowResized?.();
  }, []);

  useEffect(() => {
    refreshSlider();
  }, [refreshSlider, centerPadding, items.length]);

  const handleAfterChange = useCallback(
    (current: number) => {
      setActiveIndex(normalizeIndex(current, items.length));
    },
    [items.length],
  );

  const goPrev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, []);

  const goNext = useCallback(() => {
    sliderRef.current?.slickNext();
  }, []);

  const settings = useMemo<Settings>(
    () => ({
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding,
      slidesToShow: 1,
      speed: 500,
      afterChange: handleAfterChange,
    }),
    [centerPadding, handleAfterChange],
  );

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex] ?? items[0];
  const canNavigate = items.length > 1;

  return (
    <div className="slider-container centerModeSliderComponent relative w-full overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {items.map((item) => (
          <div key={String(item.id)}>
            <div className="flex w-full items-center justify-center">
              <div className="h-[120px] w-[120px] sm:h-[170px] sm:w-[170px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px] xl:h-[300px] xl:w-[300px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={300}
                  quality={75}
                  className="h-full w-full object-contain"
                  sizes="(max-width: 767px) 170px, 300px"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="content-section mx-auto mt-3 flex w-full max-w-[300px] flex-col items-center gap-4 text-center md:gap-6">
        <div className="flex flex-col items-center gap-4 md:min-h-0">
          {activeItem.name ? (
            <p
              className={cn(
                "font-gill text-base font-normal leading-110 text-darkblack md:text-xl",
                productNameDisplayClassName,
              )}
            >
              {activeItem.name}
            </p>
          ) : null}
        </div>
        {showCta && (activeItem.ctaLabel || ctaLabel) && activeItem.href ? (
          <Link
            href={activeItem.href}
            className="group relative flex h-14 min-w-[122px] items-center justify-center overflow-hidden border-[1px] border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 hover:border-neutral300"
          >
            <div className="absolute left-0 top-full h-14 w-full bg-darkblack transition-all duration-300 group-hover:top-0" />
            <span className="relative text-darkblack transition-all duration-300 group-hover:text-white">
              {activeItem.ctaLabel || ctaLabel}
            </span>
          </Link>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 z-20 flex -translate-y-1/2 justify-center top-[60px] md:top-[100px] lg:top-[125px] xl:top-[150px]">
        <div className="pointer-events-auto flex w-[216px] items-center justify-between sm:w-[387px] md:w-[400px] lg:w-[487px]">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={!canNavigate}
            onClick={goPrev}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                d="M20.25 12H3.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 5.25L3.75 12L10.5 18.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!canNavigate}
            onClick={goNext}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                d="M3.75 12H20.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 5.25L20.25 12L13.5 18.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
