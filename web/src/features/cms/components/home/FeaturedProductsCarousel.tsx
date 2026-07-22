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

type SlideCropVariant = "center" | "left-peek" | "right-peek";

function mobilePeekCropClassName(desktopCropClassName: string) {
  return cn(
    desktopCropClassName,
    "max-md:left-[-15px] max-md:top-[-37px] max-md:size-[230px] max-md:translate-x-0 max-md:translate-y-0",
  );
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

function normalizeIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

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
  const cropClassName =
    variant === "center"
      ? "flex items-center justify-center size-[774px] max-md:size-[155px] max-md:translate-x-0 max-md:translate-y-0"
      : variant === "left-peek"
        ? mobilePeekCropClassName("flex items-center justify-start absolute left-[22px] top-[-83px] size-[434px]")
        : mobilePeekCropClassName("flex items-center justify-end absolute left-[162px] top-[-78px] size-[426px]");

  const sizes =
    variant === "center" ? "(max-width: 767px) 430px, 774px" : "(max-width: 767px) 230px, 434px";

  return (
    <div className="featured-slide-viewport flex items-center justify-center">
      <div className={cropClassName}>
        <div className="relative md:w-[258px] w-[260px] md:h-[258px] h-[154px] w-[154px] border border-gray-200">
          <Image
            src={src}
            alt={alt}
            fill
            quality={90}
            className="size-full object-contain"
            sizes={sizes}
            priority={priority}
          />
        </div>
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
        "featured-products-slider",
        !showInfinite && "featured-products-slider--single",
      ),
      centerMode: showInfinite,
      infinite: showInfinite,
      initialSlide: initialIndex,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      arrows: false,
      dots: false,
      swipe: showInfinite,
      draggable: showInfinite,
      focusOnSelect: false,
      variableWidth: true,
      centerPadding: "0px",
      beforeChange: handleBeforeChange,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            centerPadding: "calc((100vw - 260px) / 2 - 80px)",
          },
        },
        {
          breakpoint: 640,
          settings: {
            centerPadding: "calc((100vw - 200px) / 2 - 60px)",
          },
        },
      ],
    }),
    [handleBeforeChange, initialIndex, showInfinite],
  );

  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!showInfinite) return;
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
      className="relative w-full outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
    >
      {/* Figma 684:3238 — 303px mobile track; desktop unchanged */}
      <div className="relative h-auto w-full overflow-hidden md:h-auto">
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

        {/* Desktop arrows — Figma 684:2937 @ top 117.5px, width 487px */}
        <div className="pointer-events-none absolute inset-x-0 top-[117.5px] z-20 hidden justify-center md:flex">
          <div className="pointer-events-auto flex w-[487px] max-w-[calc(100%-48px)] items-center justify-between">
            <button
              type="button"
              aria-label="Previous product"
              disabled={!showInfinite}
              onClick={goPrev}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <LeftArrow className="h-[17px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              disabled={!showInfinite}
              onClick={goNext}
              className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <RightArrow className="h-[17px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product details + mobile arrows — Figma 684:2940 / 684:3238 */}
      <div className="mx-auto flex w-[200px] flex-col items-center gap-3 sm:w-[260px] md:w-[600px] md:gap-3">
        <div className="relative z-20 flex w-full max-w-[303px] items-center justify-between md:hidden">
          <button
            type="button"
            aria-label="Previous product"
            disabled={!showInfinite}
            onClick={goPrev}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <LeftArrow className="h-[17px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Next product"
            disabled={!showInfinite}
            onClick={goNext}
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <RightArrow className="h-[17px] w-[18px]" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 text-center md:gap-6 mt-3">
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
            className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
