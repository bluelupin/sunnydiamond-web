"use client";

import { AlankaraCollection } from "@/shared/ui/collection/AlankaraCollection";
import type { ProductDetailContent } from "@/features/products/types/productDetail";

type ProductDetailPairWithSectionProps = {
  pairWith: ProductDetailContent["pairWith"];
};

const ProductDetailPairWithSection = ({ pairWith }: ProductDetailPairWithSectionProps) => {
  if (pairWith.items.length === 0) return null;

  return (
    <div className="pt-16 lg:py-100">
      <h2 className="mb-0 px-4 text-center font-larken text-32 font-light leading-110 text-darkblack lg:mb-11 lg:px-10 lg:text-left lg:text-48">
        Pair it With
      </h2>

      <AlankaraCollection
        title={pairWith.collectionTitle}
        description={pairWith.collectionDescription}
        collectionImage={pairWith.collectionImage}
        collectionCta={{ label: "View Collection", href: "/products" }}
        products={pairWith.items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          href: item.href,
        }))}
        defaultProductCtaLabel="Shop Now"
      />
    </div>
  );
};

export default ProductDetailPairWithSection;
