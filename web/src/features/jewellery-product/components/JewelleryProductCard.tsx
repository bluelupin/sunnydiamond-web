"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import { useCardImageSwipe } from "../hooks/useCardImageSwipe";
import { jewelleryListingProductCardMobileSpec } from "../data/content";
import type { StaticImageData } from "next/image";

export interface JewelleryProductCardProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
  modalImage: string | StaticImageData;
  hoverImage: string | StaticImageData;
  href: string;
  isBestseller?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

type ProductCopyProps = {
  title: string;
  price: number;
  href: string;
  white?: boolean;
  mobile?: boolean;
  className?: string;
};

const ProductCopy = ({
  title,
  price,
  href,
  white = false,
  mobile = false,
  className,
}: ProductCopyProps) => (
  <div
    className={cn(
      "flex w-full flex-col items-center text-center leading-110",
      mobile ? "gap-[8px] px-[5px] text-[14px]" : "gap-[12px] px-[12px] text-sm md:text-[20px]",
      white ? "text-white" : "text-darkblack",
      className,
    )}
  >
    <Link
      href={href}
      className={cn(
        "font-gill whitespace-nowrap",
        mobile ? "font-light" : "font-light md:text-[20px]",
        white && mobile && "font-normal",
      )}
    >
      {title}
    </Link>
    <p className="w-full font-gill font-semibold">
      <span aria-hidden>₹ </span>
      {formatJewelleryPrice(price)}
    </p>
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
}: JewelleryProductCardProps) => {
  const hasModalImage = Boolean(modalImage);
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
        "group relative flex h-[227px] flex-col items-center overflow-hidden bg-gray200 md:h-[496px]",
        "gap-[16px] px-[16px] py-[24px] md:gap-[24px] md:px-[24px] md:py-[40px]",
        hasModalImage && "touch-pan-y select-none md:touch-auto md:select-auto",
        isDragging && "cursor-grabbing md:cursor-auto",
      )}
      {...swipeSurfaceProps}
    >
      <Link
        href={href}
        onClick={handleLinkClick}
        className="absolute inset-0 z-30"
        aria-label={`View ${title}`}
      />

      {/* Desktop hover — full-card lifestyle */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100"
        aria-hidden
      >
        <OptimizedImage
          src={hoverImage}
          alt=""
          className="size-full object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-transparent to-[50%]" />
      </div>

      {/* Mobile lifestyle — full-card modal after swipe */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 md:hidden",
          isMobileLifestyle ? "opacity-100" : "opacity-0",
          !isDragging && "transition-opacity duration-500",
        )}
        aria-hidden
      >
        <OptimizedImage
          src={modalImage}
          alt=""
          className="size-full object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Default product view */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col items-center transition-opacity duration-500 md:h-full md:gap-[24px] md:group-hover:opacity-0",
          isMobileLifestyle ? "pointer-events-none opacity-0 md:opacity-100" : "opacity-100",
        )}
        style={
          isDragging && hasModalImage
            ? { transform: `translateX(${dragOffset * 0.15}px)` }
            : undefined
        }
      >
        <div
          className="relative shrink-0 overflow-hidden md:h-[303px] md:w-full"
          style={{
            width: `${jewelleryListingProductCardMobileSpec.imageWidth}px`,
            height: `${jewelleryListingProductCardMobileSpec.imageHeight}px`,
          }}
        >
          <OptimizedImage
            src={primaryImage}
            alt={title}
            className="size-full object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        <ProductCopy title={title} price={price} href={href} mobile className="md:hidden" />
        <ProductCopy title={title} price={price} href={href} className="hidden md:flex" />
      </div>

      {/* Desktop hover copy overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden px-[24px] pb-[40px] opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100">
        <ProductCopy title={title} price={price} href={href} white />
      </div>

      {/* Mobile lifestyle copy overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 px-[16px] pb-[24px] md:hidden",
          isMobileLifestyle ? "opacity-100" : "opacity-0",
          !isDragging && "transition-opacity duration-500",
        )}
      >
        <ProductCopy title={title} price={price} href={href} white mobile />
      </div>

      {isBestseller ? (
        <span
          className={cn(
            "absolute left-0 top-0 z-20 flex items-center bg-[#C5A156] font-gill leading-110 text-darkblack md:hidden",
            isMobileLifestyle && "opacity-0",
          )}
          style={{
            height: `${jewelleryListingProductCardMobileSpec.bestsellerHeight}px`,
            padding: `${jewelleryListingProductCardMobileSpec.bestsellerPadding}px`,
            fontSize: `${jewelleryListingProductCardMobileSpec.bestsellerFontSize}px`,
          }}
        >
          BESTSELLER
        </span>
      ) : null}

      {isBestseller ? (
        <span className="absolute left-1/2 top-[331px] z-20 hidden h-9 -translate-x-1/2 items-center justify-center bg-white px-3 font-gill text-sm font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156] md:flex">
          BESTSELLER
        </span>
      ) : null}

      <button
        type="button"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleWishlist?.();
        }}
        className="absolute right-2 top-2 z-40 flex size-6 items-center justify-center md:right-[24px] md:top-[24px] md:size-[32px]"
      >
        <Heart
          size={20}
          strokeWidth={1.5}
          className={cn(
            "transition-colors duration-200",
            isWishlisted
              ? "fill-[#AB863B] text-[#AB863B]"
              : isMobileLifestyle
                ? "text-white"
                : "text-darkblack md:group-hover:text-white",
          )}
        />
      </button>
    </article>
  );
};

export default JewelleryProductCard;
