"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import { useCardImageSwipe } from "../hooks/useCardImageSwipe";
import {
  jewelleryListingProductCardMobileSpec,
  jewelleryListingProductCardSpec,
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
  <div className="relative h-[110px] w-full shrink-0 overflow-hidden md:h-[303px]">
    {/* Mobile — Figma 692:4174 / 692:4901: ~134px product frame in 110px clip */}
    <div
      className="absolute left-1/2 top-[calc(50%-10px)] -translate-x-1/2 -translate-y-1/2 md:hidden"
      style={{
        width: `${jewelleryListingProductCardMobileSpec.imageInnerSize}px`,
        height: `${jewelleryListingProductCardMobileSpec.imageInnerSize}px`,
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className="pointer-events-none size-full object-cover"
        sizes="50vw"
      />
    </div>

    {/* Desktop — Figma 692:4146: scaled product in 303px clip */}
    <div
      className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{
        height: `${jewelleryListingProductCardSpec.imageInnerHeight}px`,
        width: `${jewelleryListingProductCardSpec.imageInnerWidth}px`,
      }}
    >
      <div
        className="pointer-events-none absolute max-w-none"
        style={{
          height: `${jewelleryListingProductCardSpec.imageScaleHeight}%`,
          width: `${jewelleryListingProductCardSpec.imageScaleWidth}%`,
          left: `${jewelleryListingProductCardSpec.imageOffsetLeft}%`,
          top: `${jewelleryListingProductCardSpec.imageOffsetTop}%`,
        }}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          className="size-full object-cover"
          sizes="33vw"
        />
      </div>
    </div>
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

      {/* Desktop hover — full-card lifestyle (lazy: only in DOM on md+) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100"
        aria-hidden
      >
        <OptimizedImage
          src={hoverImage}
          alt=""
          className="size-full object-cover"
          sizes="33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-transparent to-[50%]" />
      </div>

      {/* Mobile lifestyle — loaded only after swipe to avoid ~3.5MB upfront download */}
      {isMobileLifestyle ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 md:hidden"
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
      ) : null}

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
        <ProductImage src={primaryImage} alt={title} />

        <ProductCopy title={title} price={price} href={href} />
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
        <ProductCopy title={title} price={price} href={href} white />
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
