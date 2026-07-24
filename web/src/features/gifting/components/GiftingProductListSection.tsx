"use client";

import Link from "next/link";
import { useMemo } from "react";
import Reveal from "@/shared/Animation/Reveal";
import JewelleryProductGrid from "@/features/jewellery-product/components/JewelleryProductGrid";
import JewelleryProductGridSkeleton from "@/features/jewellery-product/components/skeletons/JewelleryProductGridSkeleton";
import { useMagentoTrendingProducts } from "@/hooks/magento/useMagentoTrendingProducts";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { giftingPageContent } from "../data/content";

const PRODUCT_LIMIT = 6;

const GiftingProductListSection = () => {
  const { products: section } = giftingPageContent;
  const { data: trendingProducts, isLoading } = useMagentoTrendingProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const products = useMemo(
    () => (trendingProducts ?? []).slice(0, PRODUCT_LIMIT),
    [trendingProducts],
  );

  return (
    <section
      id="gifting-products"
      aria-labelledby="gifting-products-title"
      className="bg-gray200 px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal
            as="h2"
            id="gifting-products-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {section.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="max-w-[520px] font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {section.description}
          </Reveal>
        </div>

        {isLoading && products.length === 0 ? (
          <JewelleryProductGridSkeleton count={PRODUCT_LIMIT} />
        ) : products.length > 0 ? (
          <JewelleryProductGrid
            products={products}
            isWishlisted={isWishlisted}
            onToggleWishlist={toggleWishlist}
          />
        ) : null}

        <Reveal direction="up" className="flex justify-center">
          <Link
            href={section.cta.href}
            className="inline-flex h-14 items-center justify-center bg-darkblack px-8 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
          >
            {section.cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingProductListSection;
