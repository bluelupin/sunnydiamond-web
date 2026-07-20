"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";
import { cn } from "@/shared/utils/cn";
import {
    getProductDetailCarouselImages,
    PRODUCT_DETAIL_GALLERY_SLIDE_COUNT,
} from "./productDetailCarouselImages";

type ProductWishlistDetailGalleryCarouselProps = {
    product: Product;
    className?: string;
    imageMaxWidthClass?: string;
};

const ProductWishlistDetailGalleryCarousel = ({
    product,
    className,
    imageMaxWidthClass = "max-w-375",
}: ProductWishlistDetailGalleryCarouselProps) => {
    const carouselImages = getProductDetailCarouselImages(product);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        setActiveSlide(0);
    }, [product.id]);

    const goToNextSlide = () => {
        setActiveSlide((current) => (current + 1) % carouselImages.length);
    };

    return (
        <div
            className={cn(
                "grid h-250 w-full shrink-0 grid-rows-[1fr_auto] overflow-hidden",
                className,
            )}
        >
            <div className="grid min-h-0 [&>*]:col-start-1 [&>*]:row-start-1">
                <div className="flex items-center justify-center bg-gray300">
                    <div
                        className={cn(
                            "flex h-250 w-full items-center justify-center overflow-hidden",
                            imageMaxWidthClass,
                        )}
                    >
                        <OptimizedImage
                            src={carouselImages[activeSlide]}
                            alt={`${product.name} — view ${activeSlide + 1}`}
                            priority
                            sizes="(max-width: 768px) 100vw, 472px"
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
                {Array.from({ length: PRODUCT_DETAIL_GALLERY_SLIDE_COUNT }, (_, index) => (
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
    );
};

export default ProductWishlistDetailGalleryCarousel;
