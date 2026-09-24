"use client";

import { useCallback, useState, type RefObject } from "react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";
import { cn } from "@/shared/utils/cn";
import { useHorizontalCarouselSwipe } from "@/features/products/hooks/useHorizontalCarouselSwipe";
import {
  getProductDetailCarouselImages,
  getProductDetailGallerySlots,
  getProductDetailLifestyleImages,
  lifestyleGalleryFrameClass,
} from "./productDetailCarouselImages";
type ProductDetailGalleryProps = {
  product: Product;
  /** Desktop gallery/image block — bottom edge used for sticky sync. */
  galleryRef?: RefObject<HTMLDivElement | null>;
};

const heroGalleryFrameClass =
  "relative flex w-full overflow-hidden bg-gray300 md:h-520 lg:h-680";

const thumbGalleryFrameClass =
  "relative flex w-full overflow-hidden bg-gray300 md:h-380 lg:h-465 sm:w-1/2";

const ProductDetailGallery = ({ product, galleryRef }: ProductDetailGalleryProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { heroImage, thumbOne, thumbTwo } = getProductDetailGallerySlots(product);
  const carouselImages = getProductDetailCarouselImages(product);
  const lifestyleImages = getProductDetailLifestyleImages(product);

  const goToNextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const goToPreviousSlide = useCallback(() => {
    setActiveSlide(
      (current) => (current - 1 + carouselImages.length) % carouselImages.length,
    );
  }, [carouselImages.length]);

  const { swipeProps } = useHorizontalCarouselSwipe({
    slideCount: carouselImages.length,
    onNext: goToNextSlide,
    onPrevious: goToPreviousSlide,
  });

  return (
    <>
      <div
        className="grid h-500 w-full shrink-0 grid-rows-[1fr_auto] overflow-hidden touch-pan-y select-none md:hidden"
        {...swipeProps}
      >
        <div className="grid min-h-0 [&>*]:col-start-1 [&>*]:row-start-1">
          <div className="flex items-center justify-center bg-gray300">
            <div className="flex h-500 w-full max-w-375 items-center justify-center overflow-hidden">
              <OptimizedImage
                src={carouselImages[activeSlide]}
                alt={`${product.name} — view ${activeSlide + 1}`}
                priority={activeSlide === 0}
                sizes="375px"
                className="object-contain object-center"
              />
            </div>
          </div>
          <div className="flex items-center justify-end px-4">
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Next product image"
              className="inline-flex size-6 items-center justify-center text-darkblack"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12.5H21M12.5 21L21 12.5L12.5 4" stroke="#0A0A0A" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-0.5">
          {Array.from({ length: carouselImages.length }, (_, index) => (
            <div
              key={index}
              className={cn(
                "h-0.5 min-w-0 flex-1",
                index === activeSlide ? "bg-darkblack" : "bg-neutral300",
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div ref={galleryRef} className="hidden flex-col gap-3 md:flex">
        <div className="flex shrink-0 flex-col gap-3">
          <div className={heroGalleryFrameClass}>
            <OptimizedImage
              src={heroImage}
              alt={`${product.name} — primary view`}
              priority
              sizes="(max-width: 1024px) 100vw, 783px"
              className="size-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className={cn(thumbGalleryFrameClass, "sm:flex-1")}>
              <OptimizedImage
                src={thumbOne}
                alt={`${product.name} — detail view`}
                sizes="(max-width: 1024px) 50vw, 385px"
                className="size-full object-cover object-center"
              />
            </div>
            <div className={cn(thumbGalleryFrameClass, "md:shrink-0")}>
              <OptimizedImage
                src={thumbTwo}
                alt={`${product.name} — alternate view`}
                sizes="(max-width: 1024px) 50vw, 385px"
                className="size-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {lifestyleImages.map((image, index) => (
            <div
              key={`${String(image)}-${index}`}
              className={cn(
                lifestyleGalleryFrameClass,
              )}
            >
              <OptimizedImage
                src={image}
                alt={`${product.name} — lifestyle${lifestyleImages.length > 1 ? ` ${index + 1}` : ""}`}
                sizes="(max-width: 1024px) 100vw, 783px"
                className="size-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetailGallery;
