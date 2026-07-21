"use client";

import Link from "next/link";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { Product } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { getMoreForYouCarouselItems } from "@/features/products/data/moreForYouContent";
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

type ProductDetailPageProps = {
  product: Product;
};

const ProductDetailPage = ({ product }: ProductDetailPageProps) => {
  const { addItem } = useCart();
  const { openBagDrawer } = useCartUI();

  const content = getProductDetailContent(product);
  const pricing = getProductDetailPricing(product);
  const moreForYou = getMoreForYouCarouselItems(product.id);

  const handleAddToCart = (payload: Parameters<typeof addItem>[0]) => {
    const result = addItem(payload);
    openBagDrawer(result);
  };

  const sidebarProps = {
    product,
    content,
    pricing,
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
      <ProductDetailVisitUsSection imageSrc={content.visitUsImage} />
    </>
  );
};

export default ProductDetailPage;
