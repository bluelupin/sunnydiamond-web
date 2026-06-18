"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { getProductById } from "@/features/products/data/products";
import {
  getMoreForYouProducts,
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import ProductDetailGallery from "./detail/ProductDetailGallery";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroBanner from "./detail/ProductDetailHeroBanner";
import ProductDetailPairWithSection from "./detail/ProductDetailPairWithSection";
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
        <Link href="/jewellery-product" className="mt-4 inline-block font-gill text-sm text-darkblack underline">
          Back to Jewellery
        </Link>
      </div>
    );
  }

  const content = getProductDetailContent(product);
  const pricing = getProductDetailPricing(product.id);
  const moreForYou = getMoreForYouProducts(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} has been added to your bag.` });
  };

  return (
    <article>
      <PageContainer className="pb-16 pt-6 lg:pb-24 lg:pt-8">
        <Link
          href="/jewellery-product"
          className="mb-6 inline-flex items-center gap-1 font-gill text-sm text-neutral500 transition-colors hover:text-darkblack lg:mb-8"
        >
          <ChevronLeft size={16} aria-hidden />
          Back to Jewellery
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] lg:gap-6 xl:gap-6">
          <ProductDetailGallery product={product} />
          <ProductDetailSidebar
            product={product}
            content={content}
            pricing={pricing}
            onAddToBag={handleAddToCart}
          />
        </div>
      </PageContainer>

      <ProductDetailHeroBanner imageSrc={content.heroBannerImage} alt={`${product.name} lifestyle`} />
      <ProductDetailPairWithSection pairWith={content.pairWith} />
      <ProductDetailMoreForYouSection products={moreForYou} />
      <ProductDetailVisitUsSection imageSrc={content.visitUsImage} />
    </article>
  );
};

export default ProductDetailPage;
