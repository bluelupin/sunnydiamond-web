"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import { useCardImageSwipe } from "../hooks/useCardImageSwipe";
import {
  PLP_CARD_IMAGE_QUALITY,
  PLP_CARD_IMAGE_WIDTH,
} from "../utils/jewelleryPlpImage";
import {
  jewelleryListingProductCardMobileSpec,
} from "../data/content";
import type { StaticImageData } from "next/image";

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
      className,
    )}
  >
    <Link href={href} className="font-gill whitespace-nowrap font-light md:text-xl sm:text-base text-sm">
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
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
}) => (
  <div className="mx-auto size-[121px] shrink-0 overflow-hidden md:size-[303px]">
    <OptimizedImage
      src={src}
      alt={alt}
      width={PLP_CARD_IMAGE_WIDTH}
      height={PLP_CARD_IMAGE_WIDTH}
      className="size-full object-contain"
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
        "group grid h-[227px] grid-cols-1 grid-rows-1 overflow-hidden bg-gray200 md:h-[496px]",
        hasModalImage && "touch-pan-y select-none md:touch-auto md:select-auto",
        isDragging && "cursor-grabbing md:cursor-auto",
      )}
      {...swipeSurfaceProps}
    >
      {/* Desktop hover — lazy-loaded so load more does not fetch every lifestyle image at once */}
      {hasHoverImage ? (
        <div
          className="col-start-1 row-start-1 hidden size-full grid opacity-0 transition-opacity duration-500 md:grid md:group-hover:opacity-100"
          aria-hidden
        >
          <OptimizedImage
            src={hoverImage!}
            alt=""
            width={PLP_CARD_IMAGE_WIDTH}
            height={496}
            className="col-start-1 row-start-1 size-full object-cover"
            sizes="33vw"
            quality={PLP_CARD_IMAGE_QUALITY}
          />
          <div
            className="col-start-1 row-start-1 size-full bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-transparent to-[50%]"
            aria-hidden
          />
        </div>
      ) : null}

      {/* Mobile lifestyle — loaded only after swipe */}
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

      {/* Default product view — image only; copy lives in a shared bottom slot */}
      <div
        className={cn(
          "col-start-1 row-start-1 z-10 flex w-full flex-col items-center transition-opacity duration-500",
          "px-[16px] pt-[24px] md:px-[24px] md:pt-10",
          hasHoverImage && "md:group-hover:opacity-0",
          isMobileLifestyle ? "pointer-events-none opacity-0 md:opacity-100" : "opacity-100",
        )}
        style={
          isDragging && hasModalImage
            ? { transform: `translateX(${dragOffset * 0.15}px)` }
            : undefined
        }
      >
        <ProductImage src={primaryImage} alt={title} priority={priorityImage} />
      </div>

      {/* Title + price — bottom of card, same position for default, hover, and mobile lifestyle */}
      <div
        className={cn(
          "pointer-events-none col-start-1 row-start-1 z-20 flex size-full flex-col justify-end",
          "px-[16px] pb-[24px] md:px-[24px] md:pb-10",
        )}
      >
        <ProductCopy
          title={title}
          price={price}
          href={href}
          className={cn(
            "transition-colors duration-500",
            isMobileLifestyle ? "text-white" : "text-darkblack",
            hasHoverImage && "md:group-hover:text-white",
          )}
        />
      </div>

      {/* Mobile bestseller badge — overlaid top-left, out of card flow */}
      {isBestseller ? (
        <div
          className={cn(
            "pointer-events-none col-start-1 row-start-1 z-20 flex justify-start self-start md:hidden",
            isMobileLifestyle && "opacity-0 transition-opacity duration-500",
          )}
        >
          <span
            className="flex items-center bg-[#C5A156] font-gill leading-110 text-darkblack"
            style={{
              height: `${jewelleryListingProductCardMobileSpec.bestsellerHeight}px`,
              padding: `${jewelleryListingProductCardMobileSpec.bestsellerPadding}px`,
              fontSize: `${jewelleryListingProductCardMobileSpec.bestsellerFontSize}px`,
            }}
          >
            BESTSELLER
          </span>
        </div>
      ) : null}

      {/* Desktop bestseller badge at image / copy boundary */}
      {isBestseller ? (
        <div className="pointer-events-none col-start-1 row-start-1 z-20 hidden justify-center self-start pt-[331px] md:flex">
          <span className="flex h-9 items-center justify-center bg-white px-3 font-gill text-sm font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156]">
            BESTSELLER
          </span>
        </div>
      ) : null}

      <Link
        href={href}
        onClick={handleLinkClick}
        className="col-start-1 row-start-1 z-30 size-full"
        aria-label={`View ${title}`}
      />

      <div className="pointer-events-none col-start-1 row-start-1 z-40 flex justify-end self-start px-[16px] pt-[24px] md:z-50 md:px-[24px] md:pt-10">
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleWishlist?.();
          }}
          className="pointer-events-auto relative flex size-6 items-center justify-center md:size-[32px]"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill={isWishlisted ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "transition-colors duration-200 md:w-8 md:h-8 w-6 h-6",
              isWishlisted
                ? "fill-[#AB863B] text-linkGold"
                : isMobileLifestyle
                  ? "fill-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
                  : hasHoverImage
                    ? "fill-none text-darkblack drop-shadow-none"
                    : "fill-none text-darkblack",
            )}>
            <path d="M15.6676 27.3342L26.8376 16.0042C28.0098 14.8319 28.6684 13.242 28.6684 11.5842C28.6684 9.92638 28.0098 8.33645 26.8376 7.1642C25.6653 5.99194 24.0754 5.33337 22.4176 5.33337C20.7598 5.33337 19.1698 5.99194 17.9976 7.1642L15.6676 9.3342L13.3376 7.1642C12.1653 5.99194 10.5754 5.33337 8.91757 5.33337C7.25975 5.33337 5.66983 5.99194 4.49757 7.1642C3.32532 8.33645 2.66675 9.92638 2.66675 11.5842C2.66675 13.242 3.32532 14.8319 4.49757 16.0042L15.6676 27.3342Z"
              stroke={isWishlisted ? "currentColor" : "#0A0A0A"} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default JewelleryProductCard;
