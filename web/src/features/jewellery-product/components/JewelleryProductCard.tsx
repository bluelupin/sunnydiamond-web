"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import { useCardImageSwipe } from "../hooks/useCardImageSwipe";
import {
  jewelleryListingProductCardMobileSpec,
} from "../data/content";
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
  className?: string;
};

const ProductCopy = ({ title, price, href, white = false, className }: ProductCopyProps) => (
  <div
    className={cn(
      "flex w-full flex-col items-center text-center leading-110",
      "gap-[8px] px-[5px] text-[14px] md:gap-[12px] md:px-[12px] md:text-[20px]",
      white ? "text-white" : "text-darkblack",
      white && "md:text-white",
      className,
    )}
  >
    <Link
      href={href}
      className={cn(
        "font-gill whitespace-nowrap font-light md:text-[20px]",
        white && "font-normal md:font-light",
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

const ProductImage = ({ src, alt }: { src: string | StaticImageData; alt: string }) => (
  <div className="flex h-[110px] w-full shrink-0 items-center justify-center overflow-hidden md:h-[303px]">
    <OptimizedImage
      src={src}
      alt={alt}
      className="pointer-events-none shrink-0 object-cover max-md:size-[121px] md:h-[287px] md:w-[372px]"
      sizes="(max-width: 768px) 50vw, 33vw"
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
        "group grid h-[227px] grid-cols-1 grid-rows-1 overflow-hidden bg-gray200 md:h-[496px]",
        hasModalImage && "touch-pan-y select-none md:touch-auto md:select-auto",
        isDragging && "cursor-grabbing md:cursor-auto",
      )}
      {...swipeSurfaceProps}
    >
      {/* Desktop hover — full-card lifestyle */}
      <div
        className="col-start-1 row-start-1 hidden size-full grid opacity-0 transition-opacity duration-500 md:grid md:group-hover:opacity-100"
        aria-hidden
      >
        <OptimizedImage
          src={hoverImage}
          alt=""
          className="col-start-1 row-start-1 size-full object-cover"
          sizes="33vw"
        />
        <div
          className="col-start-1 row-start-1 size-full bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-transparent to-[50%]"
          aria-hidden
        />
      </div>

      {/* Mobile lifestyle — loaded only after swipe */}
      {isMobileLifestyle ? (
        <div className="col-start-1 row-start-1 grid size-full md:hidden" aria-hidden>
          <OptimizedImage
            src={modalImage}
            alt=""
            className="col-start-1 row-start-1 size-full object-cover"
            sizes="50vw"
          />
          <div
            className="col-start-1 row-start-1 size-full bg-gradient-to-t from-black/60 to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      {/* Default product view */}
      <div
        className={cn(
          "col-start-1 row-start-1 z-10 flex flex-col items-center transition-opacity duration-500",
          "gap-[16px] px-[16px] py-[24px] md:h-full md:gap-[24px] md:px-[24px] md:py-[40px] md:group-hover:opacity-0",
          isMobileLifestyle ? "pointer-events-none opacity-0 md:opacity-100" : "opacity-100",
        )}
        style={
          isDragging && hasModalImage
            ? { transform: `translateX(${dragOffset * 0.15}px)` }
            : undefined
        }
      >
        <ProductImage src={primaryImage} alt={title} />
        <ProductCopy title={title} price={price} href={href} className="md:group-hover:hidden" />
      </div>

      {/* Desktop hover copy */}
      <div className="pointer-events-none col-start-1 row-start-1 z-20 hidden flex-col justify-end px-[24px] pb-[40px] opacity-0 transition-opacity duration-500 md:flex md:group-hover:opacity-100">
        <ProductCopy title={title} price={price} href={href} white />
      </div>

      {/* Mobile lifestyle copy */}
      <div
        className={cn(
          "pointer-events-none col-start-1 row-start-1 z-20 flex flex-col justify-end px-[16px] pb-[24px] md:hidden",
          isMobileLifestyle ? "opacity-100" : "opacity-0",
          !isDragging && "transition-opacity duration-500",
        )}
      >
        <ProductCopy title={title} price={price} href={href} white />
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

      <div className="pointer-events-none col-start-1 row-start-1 z-40 flex justify-end self-start px-[16px] pt-[24px] md:px-[24px] md:pt-[40px]">
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleWishlist?.();
          }}
          className="pointer-events-auto flex size-6 items-center justify-center md:size-[32px]"
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
      </div>
    </article>
  );
};

export default JewelleryProductCard;
