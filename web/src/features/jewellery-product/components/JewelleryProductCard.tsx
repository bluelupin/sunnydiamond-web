"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import { useCardImageSwipe } from "../hooks/useCardImageSwipe";
import {
  PLP_CARD_IMAGE_QUALITY,
  PLP_CARD_IMAGE_WIDTH,
} from "../utils/jewelleryPlpImage";
import type { StaticImageData } from "next/image";

function getImageSrc(src: string | StaticImageData): string {
  return typeof src === "string" ? src : src.src;
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export interface JewelleryProductCardProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
  modalImage?: string | StaticImageData;
  hoverImage?: string | StaticImageData;
  href: string;
  isBestseller?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  priorityImage?: boolean;
}

type ProductCopyProps = {
  title: string;
  price: number;
  href: string;
  className?: string;
};

const ProductCopy = ({ title, price, href, className }: ProductCopyProps) => (
  <div
    className={cn(
      "flex w-full flex-col items-center text-center leading-110",
      "gap-[8px] px-[5px] text-sm md:gap-[12px] md:px-[12px] md:text-xl",
      "text-darkblack",
      "motion-safe:transition-colors motion-safe:duration-700 motion-safe:ease-in-out",
      className,
    )}
  >
    <Link href={href} className="max-w-full truncate font-gill text-sm font-light sm:text-base md:text-xl desktop:whitespace-nowrap">
      {title}
    </Link>
    <p className="w-full font-gill font-semibold">
      <span aria-hidden>₹ </span>
      {formatJewelleryPrice(price)}
    </p>
  </div>
);

const ProductImage = ({
  src,
  alt,
  priority = false,
  imageClassName,
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
  imageClassName?: string;
}) => (
  <div className="mx-auto size-[121px] w-full max-w-[121px] shrink-0 overflow-hidden md:aspect-square md:h-auto md:max-w-[303px] md:w-full desktop:size-[303px]">
    <OptimizedImage
      src={src}
      alt={alt}
      width={PLP_CARD_IMAGE_WIDTH}
      height={PLP_CARD_IMAGE_WIDTH}
      className={cn("size-full object-contain", imageClassName)}
      sizes="(max-width: 768px) 50vw, 33vw"
      priority={priority}
      quality={PLP_CARD_IMAGE_QUALITY}
    />
  </div>
);

const JewelleryProductCard = ({
  title,
  price,
  primaryImage,
  modalImage,
  hoverImage,
  href,
  isBestseller = false,
  isWishlisted = false,
  onToggleWishlist,
  priorityImage = false,
}: JewelleryProductCardProps) => {
  const hasModalImage = Boolean(modalImage);
  const hasHoverImage = Boolean(hoverImage);
  const [loadHoverImage, setLoadHoverImage] = useState(false);
  const [hoverImageReady, setHoverImageReady] = useState(false);
  const prefetchHoverImage = useCallback(() => {
    if (hasHoverImage) {
      setLoadHoverImage(true);
    }
  }, [hasHoverImage]);

  const {
    activeSlide,
    dragOffset,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    handleLinkClick,
  } = useCardImageSwipe({
    slideCount: hasModalImage ? 2 : 1,
    enabled: hasModalImage,
  });

  const isMobileLifestyle = activeSlide === 1 && hasModalImage;
  const [optimisticWishlisted, setOptimisticWishlisted] = useState<boolean | null>(null);
  const displayedWishlisted = optimisticWishlisted ?? isWishlisted;
  const canCrossfade = hasHoverImage && hoverImageReady;

  useEffect(() => {
    setOptimisticWishlisted(null);
  }, [isWishlisted]);

  useEffect(() => {
    if (!loadHoverImage || !hasHoverImage || hoverImageReady) {
      return;
    }

    let cancelled = false;

    void preloadImage(getImageSrc(hoverImage!)).then(() => {
      if (!cancelled) {
        setHoverImageReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hasHoverImage, hoverImage, hoverImageReady, loadHoverImage]);

  const swipeSurfaceProps = hasModalImage
    ? {
        onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
          if (window.matchMedia("(min-width: 768px)").matches) return;
          onPointerDown(event);
        },
        onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
          if (window.matchMedia("(min-width: 768px)").matches) return;
          onPointerMove(event);
        },
        onPointerUp,
        onPointerCancel,
      }
    : {};

  return (
    <article
      className={cn(
        "group relative grid h-[260px] min-w-0 w-full grid-cols-1 grid-rows-1 overflow-hidden bg-gray200",
        "md:h-[420px] desktop:h-[496px]",
        hasModalImage && "touch-pan-y select-none md:touch-auto md:select-auto",
        isDragging && "cursor-grabbing md:cursor-auto",
      )}
      onPointerEnter={hasHoverImage ? prefetchHoverImage : undefined}
      onFocus={hasHoverImage ? prefetchHoverImage : undefined}
      {...swipeSurfaceProps}
    >
      {hasHoverImage && loadHoverImage ? (
        <OptimizedImage
          src={hoverImage!}
          alt=""
          width={PLP_CARD_IMAGE_WIDTH}
          height={PLP_CARD_IMAGE_WIDTH}
          sizes="33vw"
          quality={PLP_CARD_IMAGE_QUALITY}
          className={cn(
            "pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover opacity-0 md:block",
            "motion-safe:transition-opacity motion-safe:ease-in-out",
            canCrossfade &&
              "motion-safe:duration-[400ms] md:group-hover:opacity-100 md:group-hover:delay-150 md:group-focus-visible:opacity-100 md:group-focus-visible:delay-150",
          )}
        />
      ) : null}

      {isMobileLifestyle && modalImage ? (
        <div className="col-start-1 row-start-1 grid size-full md:hidden" aria-hidden>
          <OptimizedImage
            src={modalImage}
            alt=""
            width={PLP_CARD_IMAGE_WIDTH}
            height={PLP_CARD_IMAGE_WIDTH}
            className="col-start-1 row-start-1 size-full object-cover"
            sizes="50vw"
            quality={PLP_CARD_IMAGE_QUALITY}
          />
          <div
            className="col-start-1 row-start-1 size-full bg-gradient-to-t from-black/60 to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      <div
        className={cn(
          "col-start-1 row-start-1 z-10 flex w-full flex-col items-center",
          "max-md:transition-opacity max-md:duration-700 max-md:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "px-[16px] pt-[24px] md:px-[24px] md:pt-10",
          isMobileLifestyle ? "pointer-events-none opacity-0 md:opacity-100" : "opacity-100",
        )}
        style={
          isDragging && hasModalImage
            ? { transform: `translate3d(${dragOffset * 0.15}px, 0, 0)` }
            : undefined
        }
      >
        <ProductImage
          src={primaryImage}
          alt={title}
          priority={priorityImage}
          imageClassName={cn(
            "motion-safe:transition-opacity motion-safe:ease-out",
            canCrossfade &&
              "motion-safe:duration-[250ms] md:group-hover:opacity-0 md:group-focus-visible:opacity-0",
          )}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none col-start-1 row-start-1 z-[70] flex size-full flex-col items-center justify-end md:z-20",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-[min(52%,220px)] md:h-[min(48%,260px)]",
            "bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0",
            "motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-in-out",
            canCrossfade &&
              "md:group-hover:opacity-100 md:group-focus-visible:opacity-100",
          )}
        />
        <div
          className={cn(
            "relative z-10 flex w-full flex-col items-center gap-3 px-[16px] pb-[24px] md:px-[24px] md:pb-10",
          )}
        >
          {isBestseller ? (
            <span className="flex h-9 shrink-0 items-center justify-center bg-white px-3 font-gill text-xs font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156] md:text-sm">
              BESTSELLER
            </span>
          ) : null}
          <ProductCopy
            title={title}
            price={price}
            href={href}
            className={cn(
              isMobileLifestyle && "text-white",
              canCrossfade &&
                "md:group-hover:text-white md:group-focus-visible:text-white",
            )}
          />
        </div>
      </div>

      <Link
        href={href}
        onClick={handleLinkClick}
        className="col-start-1 row-start-1 z-30 size-full"
        aria-label={`View ${title}`}
      />

      <div className="pointer-events-none col-start-1 row-start-1 z-40 flex justify-end self-start px-2 pt-2 md:z-50 md:px-6 md:pt-6">
        <button
          type="button"
          aria-label={displayedWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={displayedWishlisted}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOptimisticWishlisted(!displayedWishlisted);
            onToggleWishlist?.();
          }}
          className="pointer-events-auto relative flex size-6 items-center justify-center md:size-[32px]"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill={displayedWishlisted ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-6 w-6 md:h-8 md:w-8",
              "motion-safe:transition-colors motion-safe:duration-700 motion-safe:ease-in-out",
              displayedWishlisted
                ? "fill-[#AB863B] text-linkGold"
                : isMobileLifestyle
                  ? "fill-none text-white"
                  : cn(
                      "fill-none text-darkblack",
                      canCrossfade &&
                        "md:group-hover:text-white md:group-focus-visible:text-white",
                    ),
            )}
          >
            <path
              d="M15.6676 27.3342L26.8376 16.0042C28.0098 14.8319 28.6684 13.242 28.6684 11.5842C28.6684 9.92638 28.0098 8.33645 26.8376 7.1642C25.6653 5.99194 24.0754 5.33337 22.4176 5.33337C20.7598 5.33337 19.1698 5.99194 17.9976 7.1642L15.6676 9.3342L13.3376 7.1642C12.1653 5.99194 10.5754 5.33337 8.91757 5.33337C7.25975 5.33337 5.66983 5.99194 4.49757 7.1642C3.32532 8.33645 2.66675 9.92638 2.66675 11.5842C2.66675 13.242 3.32532 14.8319 4.49757 16.0042L15.6676 27.3342Z"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default JewelleryProductCard;
