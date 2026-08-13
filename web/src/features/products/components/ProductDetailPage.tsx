"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { Product } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { useAddToBagWithDrawer } from "@/features/cart/hooks/useAddToBagWithDrawer";
import { useCart } from "@/features/cart/context/CartContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { ChevronLeft } from "lucide-react";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroLayout from "./detail/ProductDetailHeroLayout";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import {
  getDefaultMetalColorId,
  getMetalColorOptions,
} from "@/features/products/utils/metalColorOptions.utils";
import { applySelectedMetalVariant, parsePreferredMetalPurities, getDefaultMetalColorIdForPurities } from "@/features/products/utils/productVariant.utils";
import {
  resolveCartLineEngravingSelection,
} from "@/features/products/constants/engraving";

type ProductDetailPageProps = {
  product: Product;
  sizeGuide?: NormalizedSizeGuide | null;
};

const ProductDetailPage = ({ product, sizeGuide = null }: ProductDetailPageProps) => {
  const searchParams = useSearchParams();
  const editLineId = searchParams?.get("editLine")?.trim() ?? "";
  const purityParam = searchParams?.get("purity")?.trim() ?? "";
  const preferredPurities = useMemo(
    () => parsePreferredMetalPurities(purityParam),
    [purityParam],
  );
  const { items, getLineItemMetadata } = useCart();
  const editingLineItem = editLineId ? items.find((item) => item.id === editLineId) : undefined;
  const editingLineMetadata = editLineId ? getLineItemMetadata(editLineId) : undefined;
  const { addToBagAndOpenDrawer, updateBagAndOpenDrawer } = useAddToBagWithDrawer();

  const content = useMemo(() => getProductDetailContent(product), [product]);
  const [selectedMetal, setSelectedMetal] = useState(() =>
    getDefaultMetalColorIdForPurities(
      product,
      getDefaultMetalColorId(product, content.metalColors),
      preferredPurities,
    ),
  );

  useEffect(() => {
    setSelectedMetal(
      getDefaultMetalColorIdForPurities(
        product,
        getDefaultMetalColorId(product, getMetalColorOptions(product)),
        preferredPurities,
      ),
    );
  }, [product, preferredPurities]);

  const displayProduct = useMemo(
    () => applySelectedMetalVariant(product, selectedMetal, preferredPurities),
    [product, selectedMetal, preferredPurities],
  );
  const pricing = getProductDetailPricing(displayProduct);
  const displayContent = useMemo(
    () => ({
      ...content,
      attributes: getProductDetailContent(displayProduct).attributes,
    }),
    [content, displayProduct],
  );

  const initialEngravingSelection = useMemo(
    () => resolveCartLineEngravingSelection(product, editingLineItem, editingLineMetadata),
    [product, editingLineItem, editingLineMetadata],
  );

  const handleAddToCart = async (payload: AddToBagPayload) => {
    if (editingLineItem) {
      await updateBagAndOpenDrawer(editingLineItem.id, {
        ...payload,
        productCustomOptions: payload.productCustomOptions ?? product.customOptions,
      });
      return;
    }

    await addToBagAndOpenDrawer({
      ...payload,
      productCustomOptions: payload.productCustomOptions ?? product.customOptions,
    });
  };

  const sidebarProps = {
    product,
    displayProduct,
    content: displayContent,
    pricing,
    selectedMetal,
    preferredPurities,
    onSelectedMetalChange: setSelectedMetal,
    sizeGuide,
    onAddToBag: handleAddToCart,
    initialRingSize: editingLineItem?.options.ringSize,
    initialEngravingSelection,
    initialIsGift: Boolean(editingLineItem?.options.isGift || editingLineItem?.gifting),
    addToBagLabel: editingLineItem ? "Update Bag" : "Add to Bag",
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
