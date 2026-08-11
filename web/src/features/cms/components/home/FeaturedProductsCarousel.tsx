"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
import { cn } from "@/shared/utils/cn";
import "slick-carousel/slick/slick.css";
import "./featuredProductsCarousel.css";
import { learnAboutDiamondsRoute } from "@/features/education/data/content";
import { usePathname } from "next/navigation";

export type FeaturedCarouselItem = {
  id: string | number;
  name: string;
  price: number | null;
  image: string;
  href: string;
  /** Optional per-slide CTA label (falls back to section `ctaLabel`). */
  ctaLabel?: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

function normalizeIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/**
 * Slick disables track scrolling when slideCount <= slidesToShow.
 * Education tabs often have exactly 3 slides, so duplicate once (3 → 6)
 * to restore the same infinite scroll animation as larger product carousels.
 */
function buildRenderItems(items: FeaturedCarouselItem[]) {
  if (items.length !== 3) {
    return { renderItems: items, sourceCount: items.length };
  }

  return {
    sourceCount: 3,
    renderItems: [
      ...items.map((item, index) => ({ ...item, id: `${item.id}-a-${index}` })),
      ...items.map((item, index) => ({ ...item, id: `${item.id}-b-${index}` })),
    ],
  };
}

const CAROUSEL_TRANSITION_MS = 550;
const CAROUSEL_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

type SlideCropVariant = "center" | "left-peek" | "right-peek";

function getSlideVariant(
  slideIndex: number,
  centerIndex: number,
  total: number,
): SlideCropVariant {
  if (total <= 1) return "center";

  const slide = normalizeIndex(slideIndex, total);
  const center = normalizeIndex(centerIndex, total);
  if (slide === center) return "center";

  const prev = normalizeIndex(center - 1, total);
  const next = normalizeIndex(center + 1, total);
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
          variant === "center" && "featured-slide-image--center",
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

type SliderWithInner = Slider & {
  innerSlider?: { onWindowResized?: () => void };
};

export default function FeaturedProductsCarousel({
  items,
  ctaLabel,
  sectionLabel,
  showCta = true,
}: {
  items: FeaturedCarouselItem[];
  ctaLabel: string;
  sectionLabel: string;
  showCta?: boolean;
}) {
  const { renderItems, sourceCount } = useMemo(() => buildRenderItems(items), [items]);
  const sliderRef = useRef<Slider>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const refreshTimeoutRef = useRef<number | null>(null);
  const initialIndex = renderItems.length >= 3 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [centerVisualIndex, setCenterVisualIndex] = useState(initialIndex);
  const [isSliding, setIsSliding] = useState(false);
  const itemsKey = useMemo(
    () => renderItems.map((item) => String(item.id)).join("|"),
    [renderItems],
  );

  const showInfinite = renderItems.length > 3;
  const showThreeUp = renderItems.length >= 3;
  const slidesToShow = showThreeUp ? 3 : renderItems.length;
  const logicalActiveIndex = normalizeIndex(activeIndex, sourceCount);
  const activeItem = items[logicalActiveIndex] ?? items[0];
  const pathname = usePathname();
  const isEducationPage = pathname === learnAboutDiamondsRoute;
  const refreshSlider = useCallback(() => {
    const slider = sliderRef.current as SliderWithInner | null;
    slider?.innerSlider?.onWindowResized?.();
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current != null) {
      window.clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = window.setTimeout(() => {
      refreshTimeoutRef.current = null;
      refreshSlider();
    }, 120);
  }, [refreshSlider]);

  useLayoutEffect(() => {
    setActiveIndex(renderItems.length >= 3 ? 1 : 0);
    setCenterVisualIndex(renderItems.length >= 3 ? 1 : 0);
    setIsSliding(false);

    scheduleRefresh();
    const raf = requestAnimationFrame(scheduleRefresh);

    const onWindowResize = () => scheduleRefresh();
    window.addEventListener("resize", onWindowResize);

    const track = trackRef.current;
    let intersectionObserver: IntersectionObserver | undefined;
    if (track && typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            scheduleRefresh();
          }
        },
        { threshold: 0.08 },
      );
      intersectionObserver.observe(track);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWindowResize);
      intersectionObserver?.disconnect();
      if (refreshTimeoutRef.current != null) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [itemsKey, renderItems.length, scheduleRefresh]);

  const handleBeforeChange = useCallback(
    (_current: number, next: number) => {
      setIsSliding(true);
      setCenterVisualIndex(normalizeIndex(next, renderItems.length));
    },
    [renderItems.length],
  );

  const handleAfterChange = useCallback(
    (current: number) => {
      const index = normalizeIndex(current, renderItems.length);
      setActiveIndex(index);
      setCenterVisualIndex(index);
      setIsSliding(false);
    },
    [renderItems.length],
  );

  const handleInit = useCallback(() => {
    scheduleRefresh();
  }, [scheduleRefresh]);

  const sliderSettings = useMemo<Settings>(
    () => ({
      className: cn(
        "center featured-products-slider",
        !showInfinite && "featured-products-slider--single",
        showThreeUp && "featured-products-slider--triple",
      ),
      centerMode: sourceCount > 1,
      infinite: showInfinite,
      centerPadding: "0px",
      slidesToShow,
      slidesToScroll: 1,
      speed: CAROUSEL_TRANSITION_MS,
      cssEase: CAROUSEL_EASING,
      initialSlide: initialIndex,
      arrows: false,
      dots: false,
      swipe: sourceCount > 1,
      draggable: sourceCount > 1,
      waitForAnimate: true,
      focusOnSelect: false,
      variableWidth: false,
      beforeChange: handleBeforeChange,
      afterChange: handleAfterChange,
      onInit: handleInit,
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
    [
      handleAfterChange,
      handleBeforeChange,
      handleInit,
      initialIndex,
      showInfinite,
      showThreeUp,
      slidesToShow,
      sourceCount,
    ],
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
      className="featured-products-carousel relative w-full min-w-0 max-w-full outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
    >
      <div ref={trackRef} className="featured-products-track relative w-full max-w-full">
        <Slider key={itemsKey} ref={sliderRef} {...sliderSettings}>
          {renderItems.map((item, index) => (
            <div key={String(item.id)} className="featured-products-slide">
              <CarouselSlideImage
                src={item.image}
                alt={item.name}
                variant={getSlideVariant(index, centerVisualIndex, renderItems.length)}
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
      <div className="featured-products-details flex flex-col items-center">
        <div
          className={cn(
            "z-20 flex w-full items-center justify-between md:hidden ",
            isEducationPage ? "relative -top-[90px] !w-[200px]" : "absolute bottom-4 !w-[300px]",
          )}
        >
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

        <div
          className={cn(
            "mt-3 flex flex-col items-center gap-4 text-center transition-opacity duration-300 ease-out md:gap-6 !w-[300px]",
            isSliding && "opacity-60",
          )}
        >
          <div className="flex flex-col items-center gap-4 md:min-h-0">
            {activeItem.name ? (
              <p className="font-gill text-base font-normal leading-110 text-darkblack md:text-xl">
                {activeItem.name}
              </p>
            ) : null}
            {typeof activeItem.price === "number" ? (
              <p className="font-gill text-base font-normal leading-110 text-darkblack md:text-xl">
                <span aria-hidden>₹ </span>
                {formatPrice(activeItem.price)}
              </p>
            ) : null}
          </div>
          {showCta && (activeItem.ctaLabel || ctaLabel) && activeItem.href ? (
            <Link
              href={activeItem.href}
              className="btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-none text-darkblack"
            >
              <span className="relative z-10">{activeItem.ctaLabel || ctaLabel}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
