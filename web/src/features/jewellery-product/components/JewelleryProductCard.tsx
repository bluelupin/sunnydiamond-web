"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import type { BestsellerBadgeStyle, CardVariant } from "../utils/cardLayout";
import type { StaticImageData } from "next/image";

export interface JewelleryProductCardProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
  hoverImage: string | StaticImageData;
  href: string;
  variant: CardVariant;
  viewport?: "responsive" | "mobile" | "desktop";
  isBestseller?: boolean;
  isWishlisted?: boolean;
  badgeStyle?: BestsellerBadgeStyle;
  onToggleWishlist?: () => void;
}

type WishlistButtonProps = {
  isWishlisted: boolean;
  onToggleWishlist?: () => void;
  white?: boolean;
  viewport: NonNullable<JewelleryProductCardProps["viewport"]>;
};

const wishlistPositionClass = {
  responsive: "right-2 top-2 md:right-6 md:top-6 md:size-8",
  mobile: "right-2 top-2 size-6",
  desktop: "right-6 top-6 size-8",
} as const;

const WishlistButton = ({ isWishlisted, onToggleWishlist, white = false, viewport }: WishlistButtonProps) => (
  <button
    type="button"
    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    aria-pressed={isWishlisted}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggleWishlist?.();
    }}
    className={cn(
      "absolute z-20 flex items-center justify-center",
      wishlistPositionClass[viewport],
    )}
  >
    <Heart
      size={20}
      strokeWidth={1.5}
      className={cn(
        "transition-colors duration-200",
        isWishlisted
          ? "fill-[#AB863B] text-[#AB863B]"
          : white
            ? "text-white"
            : "text-darkblack",
      )}
    />
  </button>
);

type ProductCopyProps = {
  title: string;
  price: number;
  href: string;
  white?: boolean;
  viewport: NonNullable<JewelleryProductCardProps["viewport"]>;
};

const ProductCopy = ({ title, price, href, white = false, viewport }: ProductCopyProps) => (
  <div
    className={cn(
      "relative z-10 flex w-full flex-col items-center justify-center text-center leading-110",
      viewport === "responsive" && "gap-2 px-[4.747px] text-sm md:gap-3 md:px-3 md:text-20",
      viewport === "mobile" && "gap-2 px-[4.747px] text-sm",
      viewport === "desktop" && "gap-3 px-3 text-20",
      white ? "text-white" : "text-darkblack",
    )}
  >
    <Link href={href}>
      <p
        className={cn(
          "font-gill",
          white
            ? viewport === "mobile" || viewport === "responsive"
              ? "font-normal md:font-normal"
              : "font-normal"
            : viewport === "mobile" || viewport === "responsive"
              ? "font-light md:font-light"
              : "font-light",
        )}
      >
        {title}
      </p>
    </Link>
    <p className="font-gill font-semibold">
      <span aria-hidden>₹ </span>
      {formatJewelleryPrice(price)}
    </p>
  </div>
);

type CardBodyProps = Omit<JewelleryProductCardProps, "viewport"> & {
  viewport: NonNullable<JewelleryProductCardProps["viewport"]>;
};

const LifestyleCard = ({
  title,
  price,
  hoverImage,
  href,
  isWishlisted,
  onToggleWishlist,
  viewport,
}: CardBodyProps) => (
  <article
    className={cn(
      "group relative flex flex-col overflow-hidden",
      viewport === "responsive" &&
        "min-h-0 justify-end gap-4 self-stretch px-4 py-6 md:h-[496px] md:items-center md:gap-6 md:px-6 md:py-10",
      viewport === "mobile" && "min-h-0 justify-end gap-4 self-stretch px-4 py-6",
      viewport === "desktop" && "h-[496px] items-center gap-6 px-6 py-10",
    )}
  >
    <Link href={href} className="absolute inset-0 z-0" aria-label={`View ${title}`} />
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <OptimizedImage
        src={hoverImage}
        alt=""
        className={cn(
          "size-full object-cover",
          (viewport === "desktop" || viewport === "responsive") &&
            "transition-transform duration-700 group-hover:scale-105",
        )}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <div
        className={cn(
          "absolute inset-0",
          viewport === "mobile" && "bg-black/20",
          viewport === "desktop" &&
            "bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-[rgba(0,0,0,0)] to-[50%]",
          viewport === "responsive" &&
            "bg-black/20 md:bg-gradient-to-t md:from-[rgba(0,0,0,0.4)] md:from-[14%] md:to-[rgba(0,0,0,0)] md:to-[50%]",
        )}
      />
    </div>

    {(viewport === "desktop" || viewport === "responsive") && (
      <div
        className={cn(
          "w-full shrink-0",
          viewport === "responsive" ? "hidden md:block md:h-[303px]" : "h-[303px]",
        )}
        aria-hidden
      />
    )}

    <ProductCopy title={title} price={price} href={href} white viewport={viewport} />
    <WishlistButton
      isWishlisted={!!isWishlisted}
      onToggleWishlist={onToggleWishlist}
      white
      viewport={viewport}
    />
  </article>
);

const DefaultCard = ({
  title,
  price,
  primaryImage,
  hoverImage,
  href,
  isBestseller = false,
  isWishlisted,
  onToggleWishlist,
  badgeStyle = "top-gold",
  viewport,
}: CardBodyProps) => (
  <article
    className={cn(
      "group relative flex flex-col items-center bg-gray200",
      viewport === "responsive" &&
        "gap-4 px-4 py-6 md:h-[496px] md:gap-6 md:px-6 md:py-10",
      viewport === "mobile" && "gap-4 px-4 py-6",
      viewport === "desktop" && "h-[496px] gap-6 px-6 py-10",
    )}
  >
    {isBestseller && badgeStyle === "top-gold" && (
      <span
        className={cn(
          "absolute z-20 flex items-center justify-center bg-[#C5A156] font-gill text-xs leading-110 text-darkblack",
          viewport === "responsive" &&
            "left-[calc(50%-53px)] top-0 h-7 -translate-x-1/2 p-2 md:hidden",
          viewport === "mobile" && "left-[calc(50%-53px)] top-0 h-7 -translate-x-1/2 p-2",
        )}
      >
        BESTSELLER
      </span>
    )}

    <WishlistButton
      isWishlisted={!!isWishlisted}
      onToggleWishlist={onToggleWishlist}
      viewport={viewport}
    />

    <Link
      href={href}
      className={cn(
        "relative shrink-0 overflow-hidden",
        viewport === "responsive" && "h-[110px] w-[155px] md:h-[303px] md:w-full",
        viewport === "mobile" && "h-[110px] w-[155px]",
        viewport === "desktop" && "h-[303px] w-full",
      )}
      aria-label={`View ${title}`}
    >
      <div
        className={cn(
          "absolute inset-0",
          (viewport === "desktop" || viewport === "responsive") &&
            "opacity-100 transition-opacity duration-500 group-hover:opacity-0",
        )}
      >
        <OptimizedImage
          src={primaryImage}
          alt={title}
          className={cn(
            "size-full",
            viewport === "mobile" ? "object-contain" : "object-cover",
            viewport === "responsive" && "object-contain md:object-cover",
          )}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      {(viewport === "desktop" || viewport === "responsive") && (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <OptimizedImage
            src={hoverImage}
            alt=""
            className="size-full object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}
    </Link>

    {isBestseller && badgeStyle === "center-white" && (
      <span
        className={cn(
          "absolute z-20 flex items-center justify-center bg-white font-gill font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156]",
          viewport === "responsive" &&
            "left-[51.75px] top-[116px] p-1.5 text-xs md:left-1/2 md:top-[331px] md:h-9 md:-translate-x-1/2 md:px-3 md:text-sm",
          viewport === "mobile" && "left-[51.75px] top-[116px] p-1.5 text-xs",
          viewport === "desktop" &&
            "left-1/2 top-[331px] h-9 -translate-x-1/2 px-3 text-sm",
        )}
      >
        BESTSELLER
      </span>
    )}

    {isBestseller && badgeStyle === "top-gold" && (
      <span
        className={cn(
          "absolute z-20 flex items-center justify-center bg-white font-gill font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156]",
          viewport === "responsive" &&
            "hidden md:flex left-1/2 top-[331px] h-9 -translate-x-1/2 px-3 text-sm",
          viewport === "desktop" &&
            "left-1/2 top-[331px] h-9 -translate-x-1/2 px-3 text-sm",
        )}
      >
        BESTSELLER
      </span>
    )}

    <ProductCopy title={title} price={price} href={href} viewport={viewport} />
  </article>
);

const JewelleryProductCard = ({
  viewport = "responsive",
  variant,
  ...props
}: JewelleryProductCardProps) => {
  const bodyProps = { ...props, variant, viewport };

  if (variant === "lifestyle") {
    return <LifestyleCard {...bodyProps} />;
  }

  return <DefaultCard {...bodyProps} />;
};

export default JewelleryProductCard;
