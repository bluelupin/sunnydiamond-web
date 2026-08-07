"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { Product } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { useAddToBagWithDrawer } from "@/features/cart/hooks/useAddToBagWithDrawer";
import { ChevronLeft } from "lucide-react";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroLayout from "./detail/ProductDetailHeroLayout";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import {
  getDefaultMetalColorId,
  getMetalColorOptions,
} from "@/features/products/utils/metalColorOptions.utils";
import { applySelectedMetalVariant } from "@/features/products/utils/productVariant.utils";

type ProductDetailPageProps = {
  product: Product;
  sizeGuide?: NormalizedSizeGuide | null;
};

const ProductDetailPage = ({ product, sizeGuide = null }: ProductDetailPageProps) => {
  const { addToBagAndOpenDrawer } = useAddToBagWithDrawer();

  const content = useMemo(() => getProductDetailContent(product), [product]);
  const [selectedMetal, setSelectedMetal] = useState(() =>
    getDefaultMetalColorId(product, content.metalColors),
  );

  useEffect(() => {
    setSelectedMetal(getDefaultMetalColorId(product, getMetalColorOptions(product)));
  }, [product]);

  const displayProduct = useMemo(
    () => applySelectedMetalVariant(product, selectedMetal),
    [product, selectedMetal],
  );
  const pricing = getProductDetailPricing(displayProduct);

  const handleAddToCart = async (payload: Parameters<typeof addToBagAndOpenDrawer>[0]) => {
    await addToBagAndOpenDrawer(payload);
  };

  const sidebarProps = {
    product,
    displayProduct,
    content,
    pricing,
    selectedMetal,
    onSelectedMetalChange: setSelectedMetal,
    sizeGuide,
    onAddToBag: handleAddToCart,
  };

  return (
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
          <ProductDetailHeroLayout
            key={selectedMetal || displayProduct.image.toString()}
            product={displayProduct}
            purchase={purchase}
            details={details}
          />
        )}
      </ProductDetailSidebar>
    </PageContainer>
  );
};

export default ProductDetailPage;
