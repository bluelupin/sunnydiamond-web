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

const ProductImage = ({ src, alt }: { src: string | StaticImageData; alt: string }) => (
  <div className="mx-auto h-[110px] w-[121px] shrink-0 overflow-hidden md:h-[303px] md:w-[372px]">
    <OptimizedImage
      src={src}
      alt={alt}
      width={372}
      height={287}
      className="size-full object-cover"
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

      {/* Default product view — image only; copy lives in a shared bottom slot */}
      <div
        className={cn(
          "col-start-1 row-start-1 z-10 flex w-full flex-col items-center transition-opacity duration-500",
          "px-[16px] pt-[24px] md:px-[24px] md:pt-10 md:group-hover:opacity-0",
          isMobileLifestyle ? "pointer-events-none opacity-0 md:opacity-100" : "opacity-100",
        )}
        style={
          isDragging && hasModalImage
            ? { transform: `translateX(${dragOffset * 0.15}px)` }
            : undefined
        }
      >
        <ProductImage src={primaryImage} alt={title} />
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
            "md:text-darkblack md:group-hover:text-white",
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

      <div className="pointer-events-none col-start-1 row-start-1 z-40 flex justify-end self-start px-[16px] pt-[24px] md:px-[24px] md:pt-10">
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
          {/* <Heart
            size={20}
            strokeWidth={1.5}
            className={cn(
              "transition-colors duration-200",
              isWishlisted
                ? "fill-[#AB863B] text-linkGold"
                : isMobileLifestyle
                  ? "text-white"
                  : "text-darkblack md:group-hover:text-white",
            )}
          /> */}
          <svg
            width="29"
            height="26"
            viewBox="0 0 29 26"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "transition-colors duration-200",
              isWishlisted
                ? "fill-[#AB863B] text-linkGold group-hover:text-linkGold"
                : "fill-none text-darkblack group-hover:text-white",
              // isMobileLifestyle
              //   ? "text-white"
              //   : "text-linkGold"
            )}
          >
            <path
              d="M27.4999 8.64967C27.4999 10.7116 26.7082 12.6922 25.2943 14.1572C22.0398 17.5307 18.8831 21.0484 15.507 24.2996C15.1194 24.6675 14.6179 24.8444 14.1209 24.8328C13.6256 24.8213 13.1346 24.6228 12.765 24.2396L3.03826 14.1572C0.0982486 11.1096 0.0982486 6.18968 3.03826 3.14213C6.00717 0.0646404 10.8438 0.0646404 13.8127 3.14213L14.1663 3.5086L14.5196 3.14235C15.9431 1.66604 17.8818 0.833374 19.907 0.833374C21.9322 0.833374 23.8707 1.66596 25.2943 3.14213C26.7083 4.60731 27.4999 6.58773 27.4999 8.64967Z"
              stroke="currentColor"
              fill="currentFill"
              strokeWidth="1.66667"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default JewelleryProductCard;
