"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
import { cn } from "@/shared/utils/cn";
import "slick-carousel/slick/slick.css";
import "./featuredProductsCarousel.css";

export type FeaturedCarouselItem = {
  id: string | number;
  name: string;
  price: number | null;
  image: string;
  href: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

function normalizeIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

type SlideCropVariant = "center" | "left-peek" | "right-peek";

function getSlideVariant(
  slideIndex: number,
  activeIndex: number,
  total: number,
): SlideCropVariant {
  if (total <= 1) return "center";

  const slide = normalizeIndex(slideIndex, total);
  const active = normalizeIndex(activeIndex, total);
  if (slide === active) return "center";

  const prev = normalizeIndex(active - 1, total);
  const next = normalizeIndex(active + 1, total);
  if (slide === prev) return "left-peek";
  if (slide === next) return "right-peek";
  return "center";
}

function CarouselSlideImage({
  src,
  alt,
  variant,
  priority,
}: {
  src: string;
  alt: string;
  variant: SlideCropVariant;
  priority?: boolean;
}) {
  return (
    <div className="featured-slide-viewport">
      <div
        className={cn(
          "featured-slide-image",
          variant === "left-peek" && "featured-slide-image--left",
          variant === "right-peek" && "featured-slide-image--right",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={75}
          className="size-full object-contain"
          sizes="(max-width: 767px) 170px, 258px"
          priority={priority}
        />
      </div>
    </div>
  );
}

export default function FeaturedProductsCarousel({
  items,
  ctaLabel,
  sectionLabel,
}: {
  items: FeaturedCarouselItem[];
  ctaLabel: string;
  sectionLabel: string;
}) {
  const sliderRef = useRef<Slider>(null);
  const initialIndex = items.length >= 3 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const showInfinite = items.length >= 3;
  const showThreeUp = items.length >= 3;
  const slidesToShow = showThreeUp ? 3 : items.length;
  const activeItem = items[normalizeIndex(activeIndex, items.length)] ?? items[0];

  const handleBeforeChange = useCallback(
    (_current: number, next: number) => {
      setActiveIndex(normalizeIndex(next, items.length));
    },
    [items.length],
  );

  const sliderSettings = useMemo<Settings>(
    () => ({
      className: cn(
        "center featured-products-slider",
        !showInfinite && "featured-products-slider--single",
        showThreeUp && "featured-products-slider--triple",
      ),
      centerMode: items.length > 1,
      infinite: showInfinite,
      centerPadding: "0px",
      slidesToShow,
      slidesToScroll: 1,
      speed: 500,
      initialSlide: initialIndex,
      arrows: false,
      dots: false,
      swipe: items.length > 1,
      draggable: items.length > 1,
      focusOnSelect: false,
      variableWidth: false,
      beforeChange: handleBeforeChange,
      ...(showThreeUp
        ? {
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  centerMode: true,
                  centerPadding: "0px",
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  centerMode: true,
                  centerPadding: "0px",
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  centerMode: true,
                  centerPadding: "0px",
                },
              },
            ],
          }
        : {}),
    }),
    [handleBeforeChange, initialIndex, items.length, showInfinite, showThreeUp, slidesToShow],
  );

  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (items.length <= 1) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="featured-products-carousel relative w-full max-w-full outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
    >
      <div className="featured-products-track relative w-full max-w-full">
        <Slider ref={sliderRef} {...sliderSettings}>
          {items.map((item, index) => (
            <div key={String(item.id)} className="featured-products-slide">
              <CarouselSlideImage
                src={item.image}
                alt={item.name}
                variant={getSlideVariant(index, activeIndex, items.length)}
                priority={index === initialIndex}
              />
            </div>
          ))}
        </Slider>

        {/* Desktop arrows — Figma 684:2937 */}
        <div className="pointer-events-none absolute inset-x-0 top-[117.5px] z-20 hidden justify-center md:flex">
          <div className="pointer-events-auto flex w-[487px] max-w-[calc(100%-48px)] items-center justify-between">
            <button
              type="button"
              aria-label="Previous product"
              disabled={items.length <= 1}
              onClick={goPrev}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <LeftArrow className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              disabled={items.length <= 1}
              onClick={goNext}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <RightArrow className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Product details + mobile arrows — width matches center slide */}
      <div className="featured-products-details flex flex-col items-center md:!w-[350px] !max-w-[350px] !w-full">
        <div className="relative top-16 z-20 flex w-full items-center justify-between md:hidden">
          <button
            type="button"
            aria-label="Previous product"
            disabled={items.length <= 1}
            onClick={goPrev}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <LeftArrow className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next product"
            disabled={items.length <= 1}
            onClick={goNext}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <RightArrow className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-3 flex flex-col items-center gap-4 text-center md:gap-6">
          <div className="flex flex-col items-center gap-4">
            <p className="font-gill text-base font-normal leading-110 text-darkblack md:text-xl">
              {activeItem.name}
            </p>
            {typeof activeItem.price === "number" ? (
              <p className="font-gill text-base font-normal leading-110 text-darkblack md:text-xl">
                <span aria-hidden>₹ </span>
                {formatPrice(activeItem.price)}
              </p>
            ) : null}
          </div>
          <Link
            href={activeItem.href}
            className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-none text-darkblack"
          >
            <span className="relative z-10">{ctaLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
