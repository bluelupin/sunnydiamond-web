"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import CarouselChevronLeft from "@/assets/Icons/CarouselChevronLeft";
import CarouselChevronRight from "@/assets/Icons/CarouselChevronRight";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { getImageSrc } from "@/shared/utils/image";
import {
  ALANKARA_HERO_DESKTOP_CROP,
  ALANKARA_DEFAULT_ACTIVE_INDEX,
  ALANKARA_THUMBNAIL_CROPS,
  type AlankaraCollectionProduct,
  type AlankaraCollectionProps,
  type AlankaraThumbnailCrop,
} from "./alankaraCollection.types";
import PageContainer from "../layout/PageContainer";
import Reveal from "@/shared/Animation/Reveal";

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
        "pointer-events-auto inline-flex items-center justify-center text-darkblack transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
        isMobile ? "size-6 px-[3px] py-1" : "size-[25px] px-[3px] py-1",
        disabled ? "cursor-not-allowed opacity-100" : "hover:opacity-70",
      )}
    >
      <Icon
        disabled={disabled}
        strokeWidth={isMobile ? 1 : 1.5}
        className="h-[17px] w-[18px]"
      />
    </button>
  );
}

const DEFAULT_IMAGE_QUALITY = 90;

function CroppedFillImage({
  src,
  alt,
  cropStyle,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  cropStyle: AlankaraThumbnailCrop;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute" style={cropStyle}>
        <div className="relative size-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={DEFAULT_IMAGE_QUALITY}
            className={cn("object-cover", className)}
          />
        </div>
      </div>
    </div>
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
      <div className="relative size-full">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="180px"
          priority={priority}
          quality={DEFAULT_IMAGE_QUALITY}
          className="size-full scale-[2] object-contain object-center"
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={product.name}
      fill
      sizes="400px"
      priority={priority}
      quality={DEFAULT_IMAGE_QUALITY}
      className="scale-[2.3] object-cover object-center"
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
        "box-border shrink-0 bg-gray300 px-4 py-6 transition-opacity",
        isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
      )}
    >
      <div className="relative size-[98px] overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[121px] -translate-x-1/2 -translate-y-1/2">
          <CroppedFillImage
            src={src}
            alt=""
            cropStyle={cropStyle}
            sizes="116px"
            className="max-w-none"
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
        isMobile ? "h-[540px] w-full" : "group h-[800px] w-full",
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        {isMobile ? (
          <ResponsiveImage
            desktopSrc={desktopImage}
            mobileSrc={mobileImage}
            alt={imageAlt}
            priority={priority}
            width={375}
            height={540}
            quality={DEFAULT_IMAGE_QUALITY}
            className="size-full object-cover"
          />
        ) : (
          <CroppedFillImage
            src={desktopImage}
            alt={imageAlt}
            cropStyle={ALANKARA_HERO_DESKTOP_CROP}
            sizes="(min-width: 1920px) 50vw, 720px"
            priority={priority}
            className="max-w-none"
          />
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] from-0% to-[rgba(0,0,0,0)] to-[53.563%]"
      />

      <div
        className={cn(
          "absolute z-10 text-white",
          isMobile
            ? "inset-x-0 top-[323px] flex flex-col items-center gap-6 px-4 text-center"
            : "bottom-40 left-40 flex max-w-[418px] flex-col-reverse items-start",
        )}
      >
        {isMobile ? (
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-larken text-[32px] font-light leading-110">{title}</h2>
            {description ? (
              <p className="max-w-[343px] font-gill text-base font-light leading-110">
                {description}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            {collectionCta &&
              <Link
                href={collectionCta.href}
                className="pointer-events-none inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:pointer-events-auto group-hover:max-h-[72px] group-hover:pt-40 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:max-h-[72px] group-focus-within:pt-40 group-focus-within:opacity-100"
              >
                <span className="text-link-underline inline-flex w-fit items-center border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white">
                  {collectionCta.label}
                </span>
              </Link>
            }
            <div className="w-full max-w-[418px] flex flex-col items-start lg:gap-5 md:gap-4 gap-3">
              <h2 className="whitespace-nowrap font-larken lg:text-5xl md:text-4xl text-32 font-light leading-none">{title}</h2>
              {description &&
                <p className="font-gill lg:text-xl md:text-lg text-base font-light leading-[120%] tracking-[1%]">
                  {description}
                </p>
              }
            </div>
          </>
        )}
        {isMobile && collectionCta &&
          <Link
            href={collectionCta.href}
            className="text-link-underline inline-flex items-center justify-center border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {collectionCta.label}
          </Link>
        }
      </div>
    </div>
  );
}

function ProductCarouselPanel({
  products,
  defaultProductCtaLabel,
  variant,
  imagePriority = false,
}: {
  products: AlankaraCollectionProduct[];
  defaultProductCtaLabel: string;
  variant: "desktop" | "mobile";
  imagePriority?: boolean;
}) {
  const isMobile = variant === "mobile";
  const [activeIndex, setActiveIndex] = useState(ALANKARA_DEFAULT_ACTIVE_INDEX);
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

  const onCarouselKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (total <= 1) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (canGoPrev) go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (canGoNext) go(1);
      }
    },
    [canGoNext, canGoPrev, go, total],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || total <= 1 || isAnimating) return;
    if ((event.target as HTMLElement).closest("button, a")) return;

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
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Collection products"
      tabIndex={0}
      onKeyDown={onCarouselKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "relative overflow-hidden",
        isMobile ? "mx-4 bg-gray300 py-[40px]" : "h-[800px] w-full bg-white px-6",
        total > 1 && !isAnimating && (isDragging ? "cursor-grabbing" : "cursor-grab"),
        total > 1 && "touch-none select-none",
      )}
    >
      {!isMobile && total > 1 ? (
        <div className="pointer-events-none absolute inset-x-40 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between">
          <CarouselNavButton
            direction="prev"
            variant="desktop"
            disabled={!canGoPrev}
            onClick={() => go(-1)}
          />
          <CarouselNavButton
            direction="next"
            variant="desktop"
            disabled={!canGoNext}
            onClick={() => go(1)}
          />
        </div>
      ) : null}

      {!isMobile ? (
        <div className="flex h-full flex-col items-center">
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-end">
            <div className="relative mb-10 h-[400px] w-[400px] overflow-hidden">
              <div
                className={cn(
                  "flex h-full items-center will-change-transform motion-reduce:transition-none",
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
                    className="relative flex h-full shrink-0 items-center justify-center"
                    style={{ width: `${100 / total}%` }}
                  >
                    <ProductSlideImage
                      product={product}
                      variant="desktop"
                      priority={imagePriority && index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-4">
            <p className="whitespace-nowrap font-gill lg:text-xl md:text-lg text-base font-normal leading-110 text-darkblack text-center">
              {activeProduct.name}
            </p>
            <Link
              href={activeProduct.href}
              className="relative flex h-14 w-fit items-center justify-center overflow-hidden border-2 border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 hover:border-darkblack group"
            >
              <div className="absolute left-0 top-full h-14 w-full bg-darkblack transition-all duration-300 group-hover:top-0" />
              <span className="relative text-darkblack transition-all duration-300 group-hover:text-white">
                {activeProduct.ctaLabel || defaultProductCtaLabel}
              </span>
            </Link>
          </div>

          {total > 1 ? (
            <>
              {/* <div aria-hidden className="h-[45px] shrink-0" /> */}
              <div className="pt-12 flex justify-between shrink-0 gap-[5.6px] w-full overflow-x-auto">
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
            </>
          ) : null}
        </div>
      ) : null}

      {isMobile ? (
        <div className="relative flex flex-col items-center justify-center gap-6">
          <div className="relative h-[150px] w-[180px] overflow-hidden">
            <div
              className={cn(
                "flex h-full items-center will-change-transform motion-reduce:transition-none",
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
                  className="relative flex h-full w-full shrink-0 items-center justify-center"
                  style={{ width: `${100 / total}%` }}
                >
                  <ProductSlideImage
                    product={product}
                    variant="mobile"
                    priority={imagePriority && index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full">
            <div className="flex shrink-0 flex-col items-center gap-4 text-center">
              <p className="font-gill text-base font-normal leading-110 text-darkblack">
                {activeProduct.name}
              </p>
              <Link
                href={activeProduct.href}
                className="btn-border-slide relative inline-flex h-14 items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
              >
                {activeProduct.ctaLabel || defaultProductCtaLabel}
              </Link>
            </div>

            {total > 1 ? (
              <div className="pointer-events-none absolute inset-x-4 top-[32px] z-20 flex items-start justify-between">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AlankaraCollection({
  id,
  sectionHeading,
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
      className={cn("w-full bg-white", className,)} >
      {sectionHeading &&
        <PageContainer className="mt-[40px]">
          <Reveal as="h2" direction="up" className="mb-[38px] text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-left lg:text-48">
            {sectionHeading}
          </Reveal>
        </PageContainer>
      }
      <div className="hidden w-full md:grid md:grid-cols-2">
        <ScrollReveal delayMs={0} className="min-w-0 w-full">
          <CollectionHeroPanel
            title={title}
            description={description}
            desktopImage={desktopHero}
            mobileImage={mobileHero}
            imageAlt={title}
            collectionCta={collectionCta}
            priority={priority}
            variant="desktop"
          />
        </ScrollReveal>
        <ScrollReveal delayMs={100} className="min-w-0 w-full">
          <ProductCarouselPanel
            products={products}
            defaultProductCtaLabel={defaultProductCtaLabel}
            variant="desktop"
            imagePriority={priority}
          />
        </ScrollReveal>
      </div>

      <div className="relative mx-auto w-full max-w-[375px] pb-10 md:hidden">
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
        <ScrollReveal delayMs={100} className="relative z-10 -mt-[51px] w-full">
          <ProductCarouselPanel
            products={products}
            defaultProductCtaLabel={defaultProductCtaLabel}
            variant="mobile"
            imagePriority={priority}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default AlankaraCollection;
