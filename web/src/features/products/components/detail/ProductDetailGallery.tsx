"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
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
  "flex w-full overflow-hidden bg-gray300 px-6 py-12 lg:h-680 lg:px-6 lg:py-12";

const thumbFrameClass =
  "flex min-h-280 flex-1 overflow-hidden bg-gray300 px-4 py-8 sm:min-h-360 lg:h-465 lg:px-6 lg:py-12";

const nestedImageCropStyle = {
  width: "140.04%",
  height: "109.16%",
  marginLeft: "-17.72%",
} as const;

const lifestyleImageCropStyle = {
  width: "100%",
  height: "145.38%",
  marginTop: "-12.23%",
} as const;

type CroppedGalleryImageProps = {
  src: string | StaticImageData;
  alt: string;
  sizes: string;
  maxWidthClass: string;
  minHeightClass?: string;
  cropStyle: typeof nestedImageCropStyle | typeof lifestyleImageCropStyle;
  priority?: boolean;
};

const CroppedGalleryImage = ({
  src,
  alt,
  sizes,
  maxWidthClass,
  minHeightClass = "min-h-52",
  cropStyle,
  priority,
}: CroppedGalleryImageProps) => (
  <div
    className={cn(
      "mx-auto flex h-full w-full overflow-hidden",
      maxWidthClass,
      minHeightClass,
    )}
  >
    <Image
      src={getImageSrc(src)}
      alt={alt}
      width={800}
      height={880}
      priority={priority}
      sizes={sizes}
      className="max-w-none object-cover"
      style={cropStyle}
    />
  </div>
);

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
        <div className="grid h-500 w-full shrink-0 grid-rows-[1fr_auto] overflow-hidden lg:hidden">
          <div className="grid min-h-0 [&>*]:col-start-1 [&>*]:row-start-1">
            <div className="flex items-center justify-center bg-gray300">
              <div className="flex h-500 w-full max-w-375 items-center justify-center overflow-hidden">
                <OptimizedImage
                  src={carouselImages[activeSlide]}
                  alt={`${product.name} — view ${activeSlide + 1}`}
                  priority
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
                <ChevronRight size={24} strokeWidth={1.25} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex h-0.5">
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
        </div>
      )}

      {(variant === "all" || variant === "desktop") && (
        <div className="hidden flex-col gap-3 lg:flex lg:gap-3">
          <div className={galleryFrameClass}>
            <CroppedGalleryImage
              src={heroImage ?? product.image}
              alt={`${product.name} — primary view`}
              sizes="504px"
              maxWidthClass="max-w-504"
              minHeightClass="min-h-320"
              cropStyle={nestedImageCropStyle}
              priority
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:gap-3">
            <div className={thumbFrameClass}>
              <CroppedGalleryImage
                src={thumbOne ?? product.image}
                alt={`${product.name} — detail view`}
                sizes="312px"
                maxWidthClass="max-w-311"
                cropStyle={nestedImageCropStyle}
              />
            </div>
            <div className="flex min-h-280 w-full overflow-hidden sm:min-h-360 lg:h-465 lg:w-96 lg:shrink-0">
              <OptimizedImage
                src={thumbTwo ?? product.image}
                alt={`${product.name} — alternate view`}
                sizes="(max-width: 1024px) 50vw, 385px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex h-420 w-full overflow-hidden lg:h-680">
            <CroppedGalleryImage
              src={lifestyleImage}
              alt={`${product.name} — lifestyle`}
              sizes="(max-width: 1024px) 100vw, 783px"
              maxWidthClass="w-full"
              minHeightClass="min-h-full"
              cropStyle={lifestyleImageCropStyle}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailGallery;
