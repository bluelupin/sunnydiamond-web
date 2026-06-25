"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import CarouselChevronLeft from "@/assets/Icons/CarouselChevronLeft";
import CarouselChevronRight from "@/assets/Icons/CarouselChevronRight";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { getImageSrc } from "@/shared/utils/image";
import {
  ALANKARA_MOBILE_PRODUCT_CROP,
  ALANKARA_THUMBNAIL_CROPS,
  type AlankaraCollectionProduct,
  type AlankaraCollectionProps,
  type AlankaraThumbnailCrop,
} from "./alankaraCollection.types";

const DEFAULT_PRODUCT_CTA = "Shop Now";
const SLIDE_DURATION_MS = 500;

function CarouselNavButton({
  direction,
  disabled,
  onClick,
  variant,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  variant: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const label = direction === "prev" ? "Previous product" : "Next product";
  const Icon = direction === "prev" ? CarouselChevronLeft : CarouselChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
        isMobile ? "size-6" : "size-[25px] px-[3px] py-1",
        disabled ? "cursor-not-allowed opacity-100" : "hover:opacity-70",
      )}
    >
      <Icon
        disabled={disabled}
        strokeWidth={isMobile ? 1 : 1.5}
        className={isMobile ? "size-6" : "h-[17px] w-[18px]"}
      />
    </button>
  );
}

function ProductSlideImage({
  product,
  variant,
  priority,
}: {
  product: AlankaraCollectionProduct;
  variant: "desktop" | "mobile";
  priority?: boolean;
}) {
  const imageSrc = getImageSrc(product.image) || "";

  if (variant === "mobile") {
    return (
      <Image
        src={imageSrc}
        alt={product.name}
        fill
        sizes="271px"
        priority={priority}
        className="max-w-none object-cover"
        style={ALANKARA_MOBILE_PRODUCT_CROP}
      />
    );
  }

  return (
    <OptimizedImage
      src={imageSrc}
      alt={product.name}
      width={720}
      height={800}
      priority={priority}
      className="size-full object-cover"
    />
  );
}

const defaultThumbnailCrop = ALANKARA_THUMBNAIL_CROPS.first;

function AlankaraProductThumbnail({
  src,
  productName,
  isActive,
  onClick,
  cropStyle = defaultThumbnailCrop,
}: {
  src: string;
  productName: string;
  isActive: boolean;
  onClick: () => void;
  cropStyle?: AlankaraThumbnailCrop;
}) {
  return (
    <button
      type="button"
      aria-label={`View ${productName}`}
      aria-current={isActive}
      onClick={onClick}
      className={cn(
        "box-border size-[140px] bg-[#F4F3EE] p-3 transition-opacity",
        isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
      )}
    >
      <div className="relative size-full overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[143px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={src}
            alt=""
            fill
            sizes="116px"
            className="max-w-none object-cover"
            style={cropStyle}
          />
        </div>
      </div>
    </button>
  );
}

function CollectionHeroPanel({
  title,
  description,
  desktopImage,
  mobileImage,
  imageAlt,
  collectionCta,
  priority,
  variant,
}: {
  title: string;
  description?: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  collectionCta?: AlankaraCollectionProps["collectionCta"];
  priority?: boolean;
  variant: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isMobile ? "h-[540px] w-full" : "h-[800px] w-full",
      )}
    >
      <ResponsiveImage
        desktopSrc={desktopImage}
        mobileSrc={mobileImage}
        alt={imageAlt}
        priority={priority}
        width={isMobile ? 375 : 720}
        height={isMobile ? 540 : 800}
        quality={90}
        className="size-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] from-0% to-[rgba(0,0,0,0)] to-[53.563%]"
      />

      <div
        className={cn(
          "absolute text-white",
          isMobile
            ? "inset-x-0 top-[323px] flex flex-col items-center gap-6 px-4 text-center"
            : "bottom-10 left-10 flex max-w-[418px] flex-col gap-5",
        )}
      >
        <div className={cn("flex flex-col", isMobile ? "items-center gap-3" : "gap-5")}>
          <h2
            className={cn(
              "font-larken font-light leading-[110%]",
              isMobile ? "text-[32px]" : "text-[48px] leading-none",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "font-gill font-light text-white",
                isMobile
                  ? "max-w-[343px] text-base leading-[110%]"
                  : "text-[20px] leading-[1.2] tracking-[0.2px]",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {isMobile && collectionCta ? (
          <Link
            href={collectionCta.href}
            className="inline-flex items-center justify-center border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-[110%] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {collectionCta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ProductCarouselPanel({
  products,
  defaultProductCtaLabel,
  variant,
}: {
  products: AlankaraCollectionProduct[];
  defaultProductCtaLabel: string;
  variant: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, pointerId: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = products.length;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < total - 1;

  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(Math.max(0, total - 1));
    }
  }, [activeIndex, total]);

  const go = useCallback(
    (direction: -1 | 1) => {
      if (isAnimating || total <= 1) return;

      const next = activeIndex + direction;
      if (next < 0 || next >= total) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        setIsAnimating(true);
        window.setTimeout(() => setIsAnimating(false), SLIDE_DURATION_MS);
      }

      setActiveIndex(next);
    },
    [activeIndex, isAnimating, total],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || total <= 1 || isAnimating) return;
    trackRef.current.setPointerCapture(event.pointerId);
    dragState.current = {
      active: true,
      startX: event.clientX,
      deltaX: 0,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    let deltaX = event.clientX - dragState.current.startX;
    if (activeIndex === 0 && deltaX > 0) deltaX = 0;
    if (activeIndex === total - 1 && deltaX < 0) deltaX = 0;
    dragState.current.deltaX = deltaX;
    setDragOffset(deltaX);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const { deltaX } = dragState.current;
    dragState.current.active = false;
    try {
      trackRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }
    setIsDragging(false);
    setDragOffset(0);
    const threshold = 48;
    if (deltaX <= -threshold && canGoNext) go(1);
    else if (deltaX >= threshold && canGoPrev) go(-1);
  };

  if (!total) return null;

  const activeProduct = products[activeIndex];
  const slideOffsetPercent = total > 0 ? (activeIndex * 100) / total : 0;
  const slideTransform = `translateX(calc(-${slideOffsetPercent}% + ${isDragging ? dragOffset : 0}px))`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray300",
        isMobile ? "mx-auto size-[343px] px-9 py-[40px]" : "h-[800px] w-full",
      )}
    >
      {!isMobile ? (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "flex h-full will-change-transform motion-reduce:transition-none",
              !isDragging && "transition-transform duration-500 ease-in-out",
            )}
            style={{
              width: `${total * 100}%`,
              transform: slideTransform,
            }}
          >
            {products.map((product, index) => (
              <div
                key={String(product.id)}
                className="relative h-full shrink-0"
                style={{ width: `${100 / total}%` }}
              >
                <ProductSlideImage
                  product={product}
                  variant="desktop"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {isMobile ? (
        <div className="absolute inset-x-4 top-[251px] z-20 flex items-center justify-between">
          <CarouselNavButton
            direction="prev"
            variant="mobile"
            disabled={!canGoPrev}
            onClick={() => go(-1)}
          />
          <CarouselNavButton
            direction="next"
            variant="mobile"
            disabled={!canGoNext}
            onClick={() => go(1)}
          />
        </div>
      ) : null}

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Collection products"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative flex h-full flex-col items-center justify-center",
          total > 1 && !isAnimating
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "",
          isMobile ? "gap-6" : "",
        )}
      >
        {!isMobile ? (
          <div className="absolute left-40 top-[380px] z-10 flex w-[640px] flex-col gap-[92px]">
            <div className="relative h-10 w-full shrink-0">
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <CarouselNavButton
                  direction="prev"
                  variant="desktop"
                  disabled={!canGoPrev}
                  onClick={() => go(-1)}
                />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <CarouselNavButton
                  direction="next"
                  variant="desktop"
                  disabled={!canGoNext}
                  onClick={() => go(1)}
                />
              </div>
            </div>

            <div className="flex w-[180px] flex-col items-center gap-4 text-center">
              <p className="font-gill text-[20px] font-normal leading-110 text-darkblack">
                {activeProduct.name}
              </p>
              <Link
                href={activeProduct.href}
                className="btn-slide-up relative inline-flex h-14 w-full items-center justify-center overflow-hidden border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
              >
                {activeProduct.ctaLabel || defaultProductCtaLabel}
              </Link>
            </div>
          </div>
        ) : null}

        {isMobile ? (
          <div
            className={cn(
              "relative aspect-[134/115] min-h-0 w-full flex-[1_0_0] overflow-hidden",
              total > 1 ? "touch-pan-y" : "",
            )}
          >
            <div
              className={cn(
                "flex h-full will-change-transform motion-reduce:transition-none",
                !isDragging && "transition-transform duration-500 ease-in-out",
              )}
              style={{
                width: `${total * 100}%`,
                transform: slideTransform,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={String(product.id)}
                  className="relative h-full shrink-0"
                  style={{ width: `${100 / total}%` }}
                >
                  <ProductSlideImage
                    product={product}
                    variant="mobile"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {isMobile ? (
          <div className="flex shrink-0 flex-col items-center gap-4 text-center">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              {activeProduct.name}
            </p>
            <Link
              href={activeProduct.href}
              className="btn-slide-up relative inline-flex h-14 items-center justify-center overflow-hidden border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
            >
              {activeProduct.ctaLabel || defaultProductCtaLabel}
            </Link>
          </div>
        ) : null}
      </div>

      {!isMobile && total > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-[5.6px] overflow-x-auto px-6">
          {products.map((product, index) => {
            const thumbSrc = getImageSrc(product.thumbnailImage ?? product.image) || "";
            const isActive = index === activeIndex;
            return (
              <AlankaraProductThumbnail
                key={String(product.id)}
                src={thumbSrc}
                productName={product.name}
                isActive={isActive}
                cropStyle={product.thumbnailCrop}
                onClick={() => {
                  if (index === activeIndex || isAnimating) return;
                  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  if (!reduceMotion) {
                    setIsAnimating(true);
                    window.setTimeout(() => setIsAnimating(false), SLIDE_DURATION_MS);
                  }
                  setActiveIndex(index);
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function AlankaraCollection({
  id,
  title,
  description,
  collectionImage,
  collectionImageMobile,
  collectionCta,
  products,
  defaultProductCtaLabel = DEFAULT_PRODUCT_CTA,
  priority = false,
  className,
  "aria-label": ariaLabel,
}: AlankaraCollectionProps) {
  const desktopHero = getImageSrc(collectionImage) || "";
  const mobileHero =
    getImageSrc(collectionImageMobile ?? collectionImage) || desktopHero;

  if (!products.length) return null;

  return (
    <section
      id={id}
      aria-label={ariaLabel || title}
      className={cn("w-full bg-white", className)}
    >
      <div className="hidden lg:grid lg:grid-cols-2 lg:max-w-[1440px] lg:mx-auto">
        <ScrollReveal delayMs={0}>
          <CollectionHeroPanel
            title={title}
            description={description}
            desktopImage={desktopHero}
            mobileImage={mobileHero}
            imageAlt={title}
            priority={priority}
            variant="desktop"
          />
        </ScrollReveal>
        <ScrollReveal delayMs={100}>
          <ProductCarouselPanel
            products={products}
            defaultProductCtaLabel={defaultProductCtaLabel}
            variant="desktop"
          />
        </ScrollReveal>
      </div>

      <div className="relative mx-auto w-full max-w-[375px] pb-10 lg:hidden">
        <ScrollReveal delayMs={0}>
          <CollectionHeroPanel
            title={title}
            description={description}
            desktopImage={desktopHero}
            mobileImage={mobileHero}
            imageAlt={title}
            collectionCta={collectionCta}
            priority={priority}
            variant="mobile"
          />
        </ScrollReveal>
        <ScrollReveal delayMs={100} className="relative z-10 -mt-[51px] flex justify-center">
          <ProductCarouselPanel
            products={products}
            defaultProductCtaLabel={defaultProductCtaLabel}
            variant="mobile"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default AlankaraCollection;
