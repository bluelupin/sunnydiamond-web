"use client";

import Link from "next/link";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { Product } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import { ChevronLeft } from "lucide-react";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroLayout from "./detail/ProductDetailHeroLayout";
import ProductDetailHeroBanner from "./detail/ProductDetailHeroBanner";
import FeaturedCollectionSection from "@/features/cms/components/home/FeaturedCollectionSection";
import { homeContent } from "@/features/cms/data/content";
import ProductDetailMoreForYouSection from "./detail/ProductDetailMoreForYouSection";
import ProductDetailVisitUsSection from "./detail/ProductDetailVisitUsSection";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.service";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { resolveSizeGuideForProduct } from "@/services/size-guide/size-guide.mapper";

type ProductDetailPageProps = {
  product: Product;
  moreForYou: MoreForYouCarouselItem[];
  visitUs?: NormalizedVisitUsSection | null;
  sizeGuides?: NormalizedSizeGuide[];
};

const ProductDetailPage = ({
  product,
  moreForYou,
  visitUs,
  sizeGuides = [],
}: ProductDetailPageProps) => {
  const { addItem } = useCart();
  const { openBagDrawer } = useCartUI();

  const content = getProductDetailContent(product);
  const pricing = getProductDetailPricing(product);
  const sizeGuide = resolveSizeGuideForProduct(sizeGuides, product);

  const handleAddToCart = async (payload: Parameters<typeof addItem>[0]) => {
    const result = await addItem(payload);
    openBagDrawer(result);
  };

  const sidebarProps = {
    product,
    content,
    pricing,
    sizeGuide,
    onAddToBag: handleAddToCart,
  };

  return (
    <>
      <PageContainer className="!px-0 md:!px-8 lg:!px-10 2xl:!px-[60px] pb-16 pt-0 lg:pb-[60px]">
        <Link
          href="/jewellery"
          className="mb-6 hidden items-center gap-1 px-4 font-gill text-sm text-neutral500 transition-colors hover:text-darkMagenta md:inline-flex md:px-0 lg:mb-8"
        >
          <ChevronLeft size={16} aria-hidden />
          Back to Jewellery
        </Link>

        <ProductDetailSidebar {...sidebarProps}>
          {({ purchase, details }) => (
            <ProductDetailHeroLayout product={product} purchase={purchase} details={details} />
          )}
        </ProductDetailSidebar>
      </PageContainer>

      <ProductDetailHeroBanner
        imageSrc={content.heroBannerImage}
        videoSrc={content.heroBannerVideo}
        alt={`${product.name} lifestyle`}
      />
      <FeaturedCollectionSection
        id="alankara"
        sectionHeading="Pair it With"
        description={homeContent.alankara.collection.description}
      />
      <ProductDetailMoreForYouSection items={moreForYou} />
      <ProductDetailVisitUsSection visitUs={visitUs} />
    </>
  );
};

export default ProductDetailPage;
