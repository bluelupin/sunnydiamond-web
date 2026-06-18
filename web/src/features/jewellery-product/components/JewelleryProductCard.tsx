"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import type { ProductCardProps } from "../types";

const JewelleryProductCard = ({
  title,
  category,
  price,
  primaryImage,
  hoverImage,
  href,
  isBestseller = false,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) => {
  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gray200">
        {isBestseller ? (
          <span className="absolute top-4 left-4 z-20 bg-[#C8A96A] text-white text-[10px] md:text-xs font-gill uppercase tracking-[1.8%] px-3 py-1">
            Bestseller
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
          className="absolute top-4 right-4 z-20 p-1 text-darkblack/70 hover:text-darkblack transition-colors duration-300"
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            className={cn(isWishlisted && "fill-primary text-primary")}
          />
        </button>

        <Link href={href} className="absolute inset-0 block" aria-label={`View ${title}`}>
          <div
            className={cn(
              "absolute inset-0",
              "opacity-100 group-hover:opacity-0",
              "transition-opacity duration-500 ease-out",
            )}
          >
            <ResponsiveImage
              desktopSrc={primaryImage}
              alt={title}
              width={640}
              height={640}
            />
          </div>
          <div
            aria-hidden
            className={cn(
              "absolute inset-0",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-500 ease-out",
            )}
          >
            <ResponsiveImage
              desktopSrc={hoverImage}
              alt=""
              width={640}
              height={640}
            />
          </div>
        </Link>
      </div>

      <div
        className={cn(
          "relative z-10 bg-white px-3 pt-4 pb-5 text-center",
          "transition-all duration-500 ease-out",
          "translate-y-0 group-hover:-translate-y-14 md:group-hover:-translate-y-16",
          "group-hover:shadow-[0_-8px_24px_rgba(0,0,0,0.06)]",
        )}
      >
        <p className="font-gill text-[10px] md:text-xs uppercase tracking-[1.8%] text-darkblack/60 mb-2">
          {category}
        </p>

        <Link href={href}>
          <h3 className="font-gill text-sm md:text-base text-darkblack font-light tracking-[1%] leading-[130%] hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </Link>

        <p className="mt-2 font-gill text-base md:text-lg text-darkblack font-normal tracking-[1%]">
          <span aria-hidden className="mr-0.5">
            ₹
          </span>
          {formatJewelleryPrice(price)}
        </p>

        <Link
          href={href}
          className={cn(
            "mt-4 inline-flex items-center justify-center",
            "border-[0.8px] border-darkblack text-darkblack",
            "md:text-sm text-xs px-6 h-10 tracking-[1.8%] uppercase font-gill",
            "opacity-0 translate-y-2 pointer-events-none",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
            "transition-all duration-500 ease-out",
            "hover:bg-darkblack hover:text-white",
          )}
        >
          Discover
        </Link>
      </div>
    </article>
  );
};

export default JewelleryProductCard;
