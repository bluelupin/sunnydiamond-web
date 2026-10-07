"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/features/products/data/products";
import { isSectionActive } from "@/shared/utils/cmsSection";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import type { NormalizedProductDisplayPage } from "@/services/product-display/product-display-page.service";

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

const PAIR_IT_WITH_HEADING = "Pair it With";

type ProductDetailBelowFoldLazyProps = {
  heroBannerImage: string;
  heroBannerVideo?: string;
  productName: string;
  productId: string;
  submissionProduct?: Product;
  moreForYou: MoreForYouCarouselItem[];
  productDisplay: NormalizedProductDisplayPage;
  alankaraPrefetch?: PrefetchedAlankaraCollection | null;
};

const ProductDetailBelowFoldLazy = ({
  heroBannerImage,
  heroBannerVideo,
  productName,
  productId,
  submissionProduct,
  moreForYou,
  productDisplay,
  alankaraPrefetch,
}: ProductDetailBelowFoldLazyProps) => (
  <>
    <ProductDetailHeroBanner
      imageSrc={heroBannerImage}
      videoSrc={heroBannerVideo}
      alt={`${productName} lifestyle`}
    />
    {isSectionActive(productDisplay.pairItWith.isActive) ? (
      <FeaturedCollectionSection
        id="alankara"
        sectionHeading={PAIR_IT_WITH_HEADING}
        prefetchedAlankara={alankaraPrefetch ?? undefined}
      />
    ) : null}
    <ProductDetailMoreForYouSection
      items={moreForYou}
      title={productDisplay.moreForYouTitle}
    />
    <ProductDetailVisitUsSection
      visitUs={productDisplay.visitUs}
      productName={productName}
      productId={productId}
      submissionProduct={submissionProduct}
    />
  </>
);

export default ProductDetailBelowFoldLazy;
