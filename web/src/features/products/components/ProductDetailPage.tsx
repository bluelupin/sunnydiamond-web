"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { getProductById } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { getMoreForYouCarouselItems } from "@/features/products/data/moreForYouContent";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroLayout from "./detail/ProductDetailHeroLayout";
import ProductDetailHeroBanner from "./detail/ProductDetailHeroBanner";
import FeaturedCollectionSection from "@/features/cms/components/home/FeaturedCollectionSection";
import { homeContent } from "@/features/cms/data/content";
import ProductDetailMoreForYouSection from "./detail/ProductDetailMoreForYouSection";
import ProductDetailVisitUsSection from "./detail/ProductDetailVisitUsSection";

const ProductDetailPage = () => {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-larken text-2xl text-darkblack">Product not found</h1>
        <Link href="/jewellery" className="text-link-underline mt-4 inline-block font-gill text-sm text-darkblack underline">
          Back to Jewellery
        </Link>
      </div>
    );
  }

  const content = getProductDetailContent(product);
  const pricing = getProductDetailPricing(product.id);
  const moreForYou = getMoreForYouCarouselItems(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} has been added to your bag.` });
  };

  const sidebarProps = {
    product,
    content,
    pricing,
    onAddToBag: handleAddToCart,
  };

  return (
    <>
      <PageContainer className="!px-0 md:!px-8 lg:!px-[40px] 2xl:!px-[60px] pb-16 pt-0 lg:pb-[60px]">
        <Link
          href="/jewellery"
          className="mb-6 hidden items-center gap-1 px-4 font-gill text-sm text-neutral500 transition-colors hover:text-darkblack md:inline-flex md:px-0 lg:mb-8"
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
