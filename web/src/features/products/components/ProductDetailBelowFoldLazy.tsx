"use client";

import dynamic from "next/dynamic";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.service";

const ProductDetailHeroBanner = dynamic(() => import("./detail/ProductDetailHeroBanner"));

const FeaturedCollectionSection = dynamic(
  () => import("@/features/cms/components/home/FeaturedCollectionSection"),
);

const ProductDetailMoreForYouSection = dynamic(
  () => import("./detail/ProductDetailMoreForYouSection"),
);

const ProductDetailVisitUsSection = dynamic(
  () => import("./detail/ProductDetailVisitUsSection"),
);

type ProductDetailBelowFoldLazyProps = {
  heroBannerImage: string;
  heroBannerVideo?: string;
  productName: string;
  productId: string;
  moreForYou: MoreForYouCarouselItem[];
  visitUs?: NormalizedVisitUsSection | null;
  alankaraPrefetch?: PrefetchedAlankaraCollection | null;
};

const ProductDetailBelowFoldLazy = ({
  heroBannerImage,
  heroBannerVideo,
  productName,
  productId,
  moreForYou,
  visitUs,
  alankaraPrefetch,
}: ProductDetailBelowFoldLazyProps) => (
  <>
    <ProductDetailHeroBanner
      imageSrc={heroBannerImage}
      videoSrc={heroBannerVideo}
      alt={`${productName} lifestyle`}
    />
    <FeaturedCollectionSection
      id="alankara"
      sectionHeading="Pair it With"
      prefetchedAlankara={alankaraPrefetch ?? undefined}
    />
    <ProductDetailMoreForYouSection items={moreForYou} />
    <ProductDetailVisitUsSection
      visitUs={visitUs}
      productName={productName}
      productId={productId}
    />
  </>
);

export default ProductDetailBelowFoldLazy;
