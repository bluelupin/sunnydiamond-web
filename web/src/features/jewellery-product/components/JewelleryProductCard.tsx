"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import type { StaticImageData } from "next/image";

export interface JewelleryProductCardProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
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
};

const ProductCopy = ({ title, price, href, white = false }: ProductCopyProps) => (
  <div
    className={cn(
      "flex w-full flex-col items-center gap-[12px] px-[12px] text-center text-sm leading-110 md:text-[20px]",
      white ? "text-white" : "text-darkblack",
    )}
  >
    <Link href={href} className="font-gill font-light whitespace-nowrap">
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
  hoverImage,
  href,
  isBestseller = false,
  isWishlisted = false,
  onToggleWishlist,
}: JewelleryProductCardProps) => {
  return (
    <article className="group relative flex min-h-[280px] flex-col items-center overflow-hidden bg-gray200 md:h-[496px]">
      <Link href={href} className="absolute inset-0 z-30" aria-label={`View ${title}`} />

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
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

      <div className="relative z-10 flex w-full flex-col items-center gap-4 px-4 py-6 transition-opacity duration-500 md:h-full md:gap-[24px] md:px-[24px] md:py-[40px] md:group-hover:opacity-0">
        <div className="relative h-[110px] w-full shrink-0 overflow-hidden md:h-[303px]">
          <OptimizedImage
            src={primaryImage}
            alt={title}
            className="size-full object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        <ProductCopy title={title} price={price} href={href} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-[24px] pb-[40px] opacity-0 transition-opacity duration-500 md:group-hover:opacity-100">
        <ProductCopy title={title} price={price} href={href} white />
      </div>

      {isBestseller ? (
        <span className="absolute left-1/2 top-0 z-20 flex h-7 -translate-x-1/2 items-center justify-center bg-[#C5A156] p-2 font-gill text-xs leading-110 text-darkblack md:hidden">
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
              : "text-darkblack md:group-hover:text-white",
          )}
        />
      </button>
    </article>
  );
};

export default JewelleryProductCard;
