"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { formatJewelleryPrice } from "../utils/formatPrice";
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

const plpLifestyleFadeClassName =
  "motion-safe:transition-opacity motion-safe:duration-[350ms] motion-safe:ease-in-out";

const plpLifestyleChromeFadeClassName =
  "motion-safe:transition-[opacity,color] motion-safe:duration-[350ms] motion-safe:ease-in-out";

export interface JewelleryProductCardProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
  modalImage?: string | StaticImageData;
  hoverImage?: string | StaticImageData;
  href: string;
  isBestseller?: boolean;
  isWishlisted?: boolean;
  isHoverActive?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
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
      "md:gap-3 gap-2 lg:text-xl md:text-lg sm:text-base text-sm",
      "text-darkblack",
      plpLifestyleChromeFadeClassName,
      className,
    )}
  >
    <Link
      href={href}
      className={cn(
        "max-w-full truncate font-gill font-light lg:text-xl md:text-lg sm:text-base text-sm desktop:whitespace-nowrap",
        productNameDisplayClassName,
      )}
    >
      {title}
    </Link>
    <p className="w-full font-gill font-semibold lg:text-xl md:text-lg sm:text-base text-sm">
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
  <div className="mx-auto size-[110px] w-full max-w-[110px] shrink-0 overflow-hidden md:aspect-square md:h-auto md:max-w-[303px] md:w-full desktop:size-[303px]">
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
  isHoverActive = false,
  onHoverStart,
  onHoverEnd,
  onToggleWishlist,
  priorityImage = false,
}: JewelleryProductCardProps) => {
  const [loadHoverImage, setLoadHoverImage] = useState(false);
  const [hoverImageReady, setHoverImageReady] = useState(false);
  const lifestyleImage = hoverImage ?? modalImage;

  const prefetchHoverImage = useCallback(() => {
    if (lifestyleImage) {
      setLoadHoverImage(true);
    }
  }, [lifestyleImage]);

  const [optimisticWishlisted, setOptimisticWishlisted] = useState<boolean | null>(null);
  const displayedWishlisted = optimisticWishlisted ?? isWishlisted;
  const hoverImageLoaded = Boolean(lifestyleImage) && hoverImageReady;
  const isHoveringLifestyle = isHoverActive && Boolean(lifestyleImage);
  const shouldRevealLifestyle = isHoveringLifestyle && hoverImageLoaded;
  const [lifestyleLayerMounted, setLifestyleLayerMounted] = useState(false);
  const [lifestyleLayerOpaque, setLifestyleLayerOpaque] = useState(false);
  const shouldRevealLifestyleRef = useRef(shouldRevealLifestyle);

  shouldRevealLifestyleRef.current = shouldRevealLifestyle;

  useLayoutEffect(() => {
    if (shouldRevealLifestyle) {
      setLifestyleLayerMounted(true);
      setLifestyleLayerOpaque(false);
      const frame = requestAnimationFrame(() => {
        setLifestyleLayerOpaque(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    setLifestyleLayerOpaque(false);
  }, [shouldRevealLifestyle]);

  const handleLifestyleFadeTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target || event.propertyName !== "opacity") {
      return;
    }

    if (!shouldRevealLifestyleRef.current && !lifestyleLayerOpaque) {
      setLifestyleLayerMounted(false);
    }
  }, [lifestyleLayerOpaque]);

  /**
   * Hide product shot only while the model is showing or fading in (z-10 covers z-[5] on hover out).
   * Restores the PLP image immediately on leave so we do not wait for the model fade-out.
   */
  const hidePrimaryProductShot =
    lifestyleLayerMounted && (shouldRevealLifestyle || lifestyleLayerOpaque);

  useEffect(() => {
    setOptimisticWishlisted(null);
  }, [isWishlisted]);

  useEffect(() => {
    if (!loadHoverImage || !lifestyleImage || hoverImageReady) {
      return;
    }

    let cancelled = false;

    void preloadImage(getImageSrc(lifestyleImage)).then(() => {
      if (!cancelled) {
        setHoverImageReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hoverImageReady, lifestyleImage, loadHoverImage]);

  const handlePointerEnter = useCallback(() => {
    if (!lifestyleImage) return;
    prefetchHoverImage();
    onHoverStart?.();
  }, [lifestyleImage, onHoverStart, prefetchHoverImage]);

  const handlePointerLeave = useCallback(() => {
    onHoverEnd?.();
  }, [onHoverEnd]);

  return (
    <article
      className={cn(
        "group relative grid h-[227px] min-w-0 w-full grid-cols-1 grid-rows-1 overflow-hidden bg-gray200",
        "lg:h-[496px] md:h-[450px]",
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={lifestyleImage ? prefetchHoverImage : undefined}
    >
      {lifestyleImage && (loadHoverImage || lifestyleLayerMounted) ? (
        <div
          aria-hidden
          onTransitionEnd={handleLifestyleFadeTransitionEnd}
          className={cn(
            "pointer-events-none absolute inset-0 z-[5] h-full w-full",
            plpLifestyleFadeClassName,
            lifestyleLayerOpaque ? "opacity-100" : "opacity-0",
          )}
        >
          <OptimizedImage
            src={lifestyleImage}
            alt=""
            width={PLP_CARD_IMAGE_WIDTH}
            height={PLP_CARD_IMAGE_WIDTH}
            sizes="(max-width: 768px) 50vw, 33vw"
            quality={PLP_CARD_IMAGE_QUALITY}
            className="size-full object-cover"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "col-start-1 row-start-1 z-10 flex w-full flex-col items-center",
          "px-4 pt-6 md:px-6 md:pt-10",
        )}
      >
        <ProductImage
          src={primaryImage}
          alt={title}
          priority={priorityImage}
          imageClassName={cn(hidePrimaryProductShot && "opacity-0")}
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
            plpLifestyleFadeClassName,
            lifestyleLayerOpaque ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "relative z-10 flex w-full flex-col items-center gap-3 px-4 md:px-6 lg:pb-[58px] md:pb-10 pb-6",
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
            className={cn(shouldRevealLifestyle && lifestyleLayerOpaque && "text-white")}
          />
        </div>
      </div>

      <Link
        href={href}
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
          className="pointer-events-auto relative flex size-6 items-center justify-center md:size-8"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill={displayedWishlisted ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-6 w-6 md:h-8 md:w-8",
              displayedWishlisted
                ? "fill-[#AB863B] text-linkGold"
                : shouldRevealLifestyle && lifestyleLayerOpaque
                  ? "fill-none text-darkblack"
                  : "fill-none text-darkblack",
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
