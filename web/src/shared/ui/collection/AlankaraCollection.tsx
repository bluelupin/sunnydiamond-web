"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";
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

  const total = products.length;

  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  const go = useCallback(
    (direction: -1 | 1) => {
      if (total <= 1) return;
      setActiveIndex((prev) => (prev + direction + total) % total);
    },
    [total],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || total <= 1) return;
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
    const deltaX = event.clientX - dragState.current.startX;
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
    if (deltaX <= -threshold) go(1);
    else if (deltaX >= threshold) go(-1);
  };

  if (!total) return null;

  const activeProduct = products[activeIndex];
  const activeImage = getImageSrc(activeProduct.image) || "";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray300",
        isMobile ? "mx-auto size-[343px] px-9 py-[40px]" : "h-[800px] w-full",
      )}
    >
      {!isMobile ? (
        <div className="absolute inset-0 overflow-hidden">
          <OptimizedImage
            src={activeImage}
            alt={activeProduct.name}
            width={720}
            height={800}
            className="size-full object-cover transition-opacity duration-500"
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
          total > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "",
          isMobile ? "gap-6" : "gap-[92px] pt-[380px]",
        )}
        style={
          isMobile && isDragging
            ? { transform: `translateX(${dragOffset}px)` }
            : undefined
        }
      >
        <div
          className={cn(
            "flex items-center justify-between",
            isMobile ? "absolute left-4 top-[251px] w-[311px]" : "w-full max-w-[640px] px-2.5",
          )}
        >
          <button
            type="button"
            aria-label="Previous product"
            onClick={() => go(-1)}
            disabled={total <= 1}
            className="inline-flex size-6 items-center justify-center text-darkblack disabled:opacity-30 md:size-10"
          >
            <LeftArrow className="size-6 md:size-[25px]" />
          </button>
          <button
            type="button"
            aria-label="Next product"
            onClick={() => go(+1)}
            disabled={total <= 1}
            className="inline-flex size-6 items-center justify-center text-darkblack disabled:opacity-30 md:size-10"
          >
            <RightArrow className="size-6 md:size-[25px]" />
          </button>
        </div>

        {isMobile ? (
          <div className="relative aspect-[134/115] min-h-0 w-full flex-[1_0_0] overflow-hidden">
            <Image
              src={activeImage}
              alt={activeProduct.name}
              fill
              sizes="271px"
              className="max-w-none object-cover"
              style={ALANKARA_MOBILE_PRODUCT_CROP}
            />
          </div>
        ) : null}

        <div className="flex shrink-0 flex-col items-center gap-4 text-center">
          <p
            className={cn(
              "font-gill leading-110 text-darkblack",
              isMobile ? "text-base font-normal" : "text-[20px]",
            )}
          >
            {activeProduct.name}
          </p>
          <Link
            href={activeProduct.href}
            className="btn-slide-up relative inline-flex h-14 items-center justify-center overflow-hidden border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
          >
            {activeProduct.ctaLabel || defaultProductCtaLabel}
          </Link>
        </div>
      </div>

      {!isMobile && total > 1 ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-[5.6px] overflow-x-auto px-6">
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
                onClick={() => setActiveIndex(index)}
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
