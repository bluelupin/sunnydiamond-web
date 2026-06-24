"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";
import type { StaticImageData } from "next/image";
import { cn } from "@/shared/utils/cn";

type ProductDetailGalleryProps = {
  product: Product;
  variant?: "mobile" | "desktop" | "all";
};

const GALLERY_SLIDE_COUNT = 5;

const galleryFrameClass =
  "relative w-full overflow-hidden bg-gray300 px-6 py-12 lg:h-[680px] lg:px-6 lg:py-12";

const thumbFrameClass =
  "relative min-h-[280px] flex-1 overflow-hidden bg-gray300 px-4 py-8 sm:min-h-[360px] lg:h-[464px] lg:px-6 lg:py-12";

function GalleryImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? "relative h-full min-h-[240px] w-full"}>
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 783px"
        className="object-contain"
      />
    </div>
  );
}

const ProductDetailGallery = ({ product, variant = "all" }: ProductDetailGalleryProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroImage, thumbOne, thumbTwo] = product.images;
  const lifestyleImage = product.images[2] ?? product.image;

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
          <GalleryImage
            src={heroImage ?? product.image}
            alt={`${product.name} — primary view`}
            priority
            className="relative mx-auto h-full min-h-[320px] max-w-[504px]"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:gap-3">
          <div className={thumbFrameClass}>
            <GalleryImage
              src={thumbOne ?? product.image}
              alt={`${product.name} — detail view`}
              className="relative mx-auto h-full min-h-[200px] max-w-[312px]"
            />
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
          <OptimizedImage
            src={lifestyleImage}
            alt={`${product.name} — lifestyle`}
            sizes="(max-width: 1024px) 100vw, 783px"
            className="object-cover"
          />
        </div>
      </div>
      )}
    </>
  );
};

export default ProductDetailGallery;
