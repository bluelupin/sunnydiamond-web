"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { Product } from "@/features/products/data/products";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import { useAddToBagWithDrawer } from "@/features/cart/hooks/useAddToBagWithDrawer";
import { useCart } from "@/features/cart/context/CartContext";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import ProductDetailSidebar from "./detail/ProductDetailSidebar";
import ProductDetailHeroLayout from "./detail/ProductDetailHeroLayout";
import ProductDetailBelowFoldLazy from "./ProductDetailBelowFoldLazy";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { MobileStickyFooterSpacer } from "@/shared/ui/layout/MobileStickyFooterSpacer";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import type { NormalizedProductDisplayPage } from "@/services/product-display/product-display-page.service";
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
  /** Server-read MAGENTO_STOCK_ALERT deploy gate for the notify-me action. */
  stockAlertEnabled?: boolean;
  productDisplay: NormalizedProductDisplayPage;
  heroBannerImage: string;
  heroBannerVideo?: string;
  moreForYou: MoreForYouCarouselItem[];
  alankaraPrefetch?: PrefetchedAlankaraCollection | null;
};

function useDefaultSelectedMetal(product: Product, preferredPurities: ReturnType<typeof parsePreferredMetalPurities>) {
  return useMemo(
    () =>
      getDefaultMetalColorIdForPurities(
        product,
        getDefaultMetalColorId(product, getMetalColorOptions(product)),
        preferredPurities,
      ),
    [product, preferredPurities],
  );
}

type ProductDetailPageBodyProps = ProductDetailPageProps & {
  editLineId: string;
  preferredPurities: ReturnType<typeof parsePreferredMetalPurities>;
  onEditLineSaved: (lineId: string) => void;
  mobilePurchaseBar: ReturnType<typeof useMobileStickyFooterClearance>;
};

const ProductDetailPageBody = ({
  product,
  sizeGuide = null,
  stockAlertEnabled = false,
  productDisplay,
  heroBannerImage,
  heroBannerVideo,
  moreForYou,
  alankaraPrefetch = null,
  editLineId,
  preferredPurities,
  onEditLineSaved,
  mobilePurchaseBar,
}: ProductDetailPageBodyProps) => {
  const { items, getLineItemMetadata } = useCart();
  const editingLineItem = editLineId ? items.find((item) => item.id === editLineId) : undefined;
  const editingLineMetadata = editLineId ? getLineItemMetadata(editLineId) : undefined;
  const { addToBagAndOpenDrawer, updateBagAndOpenDrawer } = useAddToBagWithDrawer();

  const defaultSelectedMetal = useDefaultSelectedMetal(product, preferredPurities);
  const [selectedMetal, setSelectedMetal] = useState(defaultSelectedMetal);

  const content = useMemo(() => getProductDetailContent(product), [product]);
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
    const payloadWithOptions: AddToBagPayload = {
      ...payload,
      productCustomOptions: payload.productCustomOptions ?? product.customOptions,
    };

    if (editLineId) {
      await updateBagAndOpenDrawer(editLineId, payloadWithOptions);
      onEditLineSaved(editLineId);
      return;
    }

    await addToBagAndOpenDrawer(payloadWithOptions);
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
    stockAlertEnabled,
    productDisplay,
    onAddToBag: handleAddToCart,
    initialRingSize: editingLineItem?.options.ringSize,
    initialEngravingSelection,
    initialIsGift: Boolean(editingLineItem?.options.isGift || editingLineItem?.gifting),
    addToBagLabel: editLineId ? "Update Bag" : "Add to Bag",
  };

  return (
    <>
      <PageContainer className="md:mt-6 !px-0 md:!px-8 lg:!px-10 2xl:!px-[60px] pb-16 pt-0 lg:pb-[60px]">
        <ProductDetailSidebar
          key={`${product.id}:${editLineId || "new"}`}
          {...sidebarProps}
          mobilePurchaseBar={mobilePurchaseBar}
        >
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
      <ProductDetailBelowFoldLazy
        heroBannerImage={heroBannerImage}
        heroBannerVideo={heroBannerVideo}
        productName={product.name}
        productId={product.id}
        moreForYou={moreForYou}
        productDisplay={productDisplay}
        alankaraPrefetch={alankaraPrefetch}
      />
      <MobileStickyFooterSpacer height={mobilePurchaseBar.clearancePx} />
    </>
  );
};

const ProductDetailPage = ({
  product,
  sizeGuide = null,
  stockAlertEnabled = false,
  productDisplay,
  heroBannerImage,
  heroBannerVideo,
  moreForYou,
  alankaraPrefetch = null,
}: ProductDetailPageProps) => {
  const mobilePurchaseBar = useMobileStickyFooterClearance();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editLineFromUrl = searchParams?.get("editLine")?.trim() ?? "";
  const [dismissedEditLineId, setDismissedEditLineId] = useState<string | null>(null);
  const editLineId =
    dismissedEditLineId !== null && dismissedEditLineId === editLineFromUrl ? "" : editLineFromUrl;

  const clearEditLineFromUrl = useCallback(() => {
    if (!pathname) {
      return;
    }

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (!params.has("editLine")) {
      return;
    }

    params.delete("editLine");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);
  const purityParam = searchParams?.get("purity")?.trim() ?? "";
  const preferredPurities = useMemo(
    () => parsePreferredMetalPurities(purityParam),
    [purityParam],
  );

  const handleEditLineSaved = useCallback(
    (lineId: string) => {
      setDismissedEditLineId(lineId);
      clearEditLineFromUrl();
    },
    [clearEditLineFromUrl],
  );

  const metalSelectionKey = `${product.id}:${purityParam}`;

  return (
    <ProductDetailPageBody
      key={metalSelectionKey}
      product={product}
      sizeGuide={sizeGuide}
      stockAlertEnabled={stockAlertEnabled}
      productDisplay={productDisplay}
      heroBannerImage={heroBannerImage}
      heroBannerVideo={heroBannerVideo}
      moreForYou={moreForYou}
      alankaraPrefetch={alankaraPrefetch}
      editLineId={editLineId}
      preferredPurities={preferredPurities}
      onEditLineSaved={handleEditLineSaved}
      mobilePurchaseBar={mobilePurchaseBar}
    />
  );
};

export default ProductDetailPage;
