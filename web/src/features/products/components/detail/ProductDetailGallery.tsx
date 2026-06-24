"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";
import { cn } from "@/shared/utils/cn";
import { getImageSrc } from "@/shared/utils/image";
import {
  PRODUCT_DETAIL_GALLERY_HERO_IMAGE,
  PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE,
  PRODUCT_DETAIL_GALLERY_SECOND_IMAGE,
  PRODUCT_DETAIL_GALLERY_THIRD_IMAGE,
} from "@/features/products/data/productGalleryContent";

type ProductDetailGalleryProps = {
  product: Product;
  variant?: "mobile" | "desktop" | "all";
};

const GALLERY_SLIDE_COUNT = 5;

const galleryFrameClass =
  "relative w-full overflow-hidden bg-gray300 px-6 py-12 lg:h-[680px] lg:px-6 lg:py-12";

const thumbFrameClass =
  "relative min-h-[280px] flex-1 overflow-hidden bg-gray300 px-4 py-8 sm:min-h-[360px] lg:h-[464px] lg:px-6 lg:py-12";

const nestedImageCropStyle = {
  height: "109.16%",
  width: "140.04%",
  left: "-17.72%",
  top: 0,
} as const;

const ProductDetailGallery = ({ product, variant = "all" }: ProductDetailGalleryProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [productHeroImage, productThumbOne, productThumbTwo] = product.images;
  const heroImage = productHeroImage ?? PRODUCT_DETAIL_GALLERY_HERO_IMAGE;
  const thumbOne = productThumbOne ?? PRODUCT_DETAIL_GALLERY_SECOND_IMAGE;
  const thumbTwo = productThumbTwo ?? PRODUCT_DETAIL_GALLERY_THIRD_IMAGE;
  const lifestyleImage =
    product.lifestyleImage ?? product.images[3] ?? PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE;

  const carouselImages = [
    heroImage ?? product.image,
    thumbOne ?? product.image,
    thumbTwo ?? product.image,
    lifestyleImage,
    product.image,
  ].slice(0, GALLERY_SLIDE_COUNT);

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % carouselImages.length);
  };

  return (
    <>
      {(variant === "all" || variant === "mobile") && (
      <div className="relative h-[500px] w-full shrink-0 overflow-hidden lg:hidden">
        <div className="relative h-full w-full bg-gray300">
          <div className="absolute left-[calc(50%-7px)] top-0 h-[498px] w-full max-w-[375px] -translate-x-1/2 overflow-hidden">
            <div className="relative h-full w-full">
              <OptimizedImage
                src={carouselImages[activeSlide]}
                alt={`${product.name} — view ${activeSlide + 1}`}
                priority
                sizes="375px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex h-0.5">
          {Array.from({ length: GALLERY_SLIDE_COUNT }, (_, index) => (
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

        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Next product image"
          className="absolute right-4 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center text-darkblack"
        >
          <ChevronRight size={24} strokeWidth={1.25} aria-hidden />
        </button>
      </div>
      )}

      {(variant === "all" || variant === "desktop") && (
      <div className="hidden flex-col gap-3 lg:flex lg:gap-3">
        <div className={galleryFrameClass}>
          <div className="relative mx-auto h-full min-h-[320px] w-full max-w-[504px] overflow-hidden">
            <Image
              src={getImageSrc(heroImage ?? product.image)}
              alt={`${product.name} — primary view`}
              fill
              priority
              sizes="504px"
              className="max-w-none object-cover"
              style={nestedImageCropStyle}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:gap-3">
          <div className={thumbFrameClass}>
            <div className="relative mx-auto h-full min-h-[200px] w-full max-w-[312px] overflow-hidden">
              <Image
                src={getImageSrc(thumbOne ?? product.image)}
                alt={`${product.name} — detail view`}
                fill
                sizes="312px"
                className="max-w-none object-cover"
                style={nestedImageCropStyle}
              />
            </div>
          </div>
          <div className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[360px] lg:h-[464px] lg:w-[385px] lg:shrink-0">
            <OptimizedImage
              src={thumbTwo ?? product.image}
              alt={`${product.name} — alternate view`}
              sizes="(max-width: 1024px) 50vw, 385px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative h-[420px] w-full overflow-hidden lg:h-[680px]">
          <Image
            src={getImageSrc(lifestyleImage)}
            alt={`${product.name} — lifestyle`}
            fill
            sizes="(max-width: 1024px) 100vw, 783px"
            className="max-w-none object-cover"
            style={{
              height: "145.38%",
              width: "100%",
              left: 0,
              top: "-12.23%",
            }}
          />
        </div>
      </div>
      )}
    </>
  );
};

export default ProductDetailGallery;
