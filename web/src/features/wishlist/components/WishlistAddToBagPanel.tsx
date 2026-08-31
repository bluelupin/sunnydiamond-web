"use client";

import { useEffect, useMemo, useState } from "react";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import {
  getProductDetailContent,
  getProductDetailPricing,
} from "@/features/products/data/productDetailContent";
import {
  AttributeSeparator,
  DetailDarkButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import RingSizeChartPanel from "@/features/products/components/detail/RingSizeChartPanel";
import PriceBreakupPanel from "@/features/products/components/detail/PriceBreakupPanel";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import ProductWishlistDetailGalleryCarousel from "@/features/products/components/detail/ProductWishlistDetailGalleryCarousel";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import type { Product } from "@/features/products/data/products";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import {
  fetchWishlistProductDetail,
  getCachedWishlistProductDetail,
} from "@/features/wishlist/utils/wishlistProductDetailPrefetch";
import { getSizeGuideForProduct } from "@/services/size-guide/size-guide.service";
import { getRingSizeLabels } from "@/features/products/utils/ringSizeOptions.utils";
import {
  getDefaultMetalColorId,
  isMetalColorSelectable,
} from "@/features/products/utils/metalColorOptions.utils";
import {
  applySelectedMetalVariant,
  getConfigurableOptionUidsForMetal,
} from "@/features/products/utils/productVariant.utils";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { RIGHT_PANEL_ASIDE_MD_CLASS } from "@/shared/ui/rightPanel";
import { cn } from "@/shared/utils/cn";

type WishlistAddToBagPanelProps = {
  open: boolean;
  product: JewelleryListingProduct | null;
  onClose: () => void;
  onAddToBag: (payload: AddToBagPayload) => void;
};

const wishlistAddToBagAsideClassName = cn(
  "max-w-full max-md:h-[calc(100dvh-3rem)] max-md:max-h-[calc(100dvh-3rem)] max-md:min-h-0 md:h-full md:max-h-screen",
  RIGHT_PANEL_ASIDE_MD_CLASS,
);

const WishlistAddToBagPanel = ({
  open,
  product,
  onClose,
  onAddToBag,
}: WishlistAddToBagPanelProps) => {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [sizeGuide, setSizeGuide] = useState<NormalizedSizeGuide | null>(null);
  const [isDetailFetching, setIsDetailFetching] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [ringSize, setRingSize] = useState("");
  const [ringSizeError, setRingSizeError] = useState<string | null>(null);
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);

  useEffect(() => {
    if (!open || !product?.urlKey) {
      setDetailProduct(null);
      setSizeGuide(null);
      setIsDetailFetching(false);
      return;
    }

    const cachedProduct = getCachedWishlistProductDetail(product.urlKey);
    if (cachedProduct !== undefined) {
      setDetailProduct(cachedProduct);
      setIsDetailFetching(false);
      return;
    }

    const controller = new AbortController();
    setDetailProduct(null);
    setIsDetailFetching(true);

    void fetchWishlistProductDetail(product.urlKey, controller.signal)
      .then((fetchedProduct) => {
        if (!controller.signal.aborted) {
          setDetailProduct(fetchedProduct);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDetailProduct(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsDetailFetching(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [open, product?.urlKey]);

  useEffect(() => {
    if (!open || !detailProduct) {
      setSizeGuide(null);
      return;
    }

    const controller = new AbortController();

    void getSizeGuideForProduct(detailProduct, controller.signal).then((guide) => {
      if (!controller.signal.aborted) {
        setSizeGuide(guide);
      }
    });

    return () => {
      controller.abort();
    };
  }, [open, detailProduct]);

  const content = detailProduct ? getProductDetailContent(detailProduct) : null;
  const pricing = detailProduct ? getProductDetailPricing(detailProduct) : null;
  const sizeLabels = detailProduct && content ? getRingSizeLabels(detailProduct, sizeGuide) : [];
  const showSizeSelector = sizeLabels.length > 0;
  const metalColorSelectable = detailProduct ? isMetalColorSelectable(detailProduct) : false;
  const showMetalColor = (content?.metalColors.length ?? 0) > 0;
  const isDetailReady = Boolean(detailProduct && content && pricing);

  useEffect(() => {
    if (!open || !detailProduct) {
      return;
    }

    const nextContent = getProductDetailContent(detailProduct);
    setSelectedMetal(getDefaultMetalColorId(detailProduct, nextContent.metalColors));
    setRingSize("");
    setRingSizeError(null);
  }, [open, detailProduct?.id]);

  const displayProduct = useMemo(
    () => (detailProduct ? applySelectedMetalVariant(detailProduct, selectedMetal) : null),
    [detailProduct, selectedMetal],
  );
  const displayPricing = displayProduct ? getProductDetailPricing(displayProduct) : null;

  if (!open || !product) {
    return (
      <RingSizeChartPanel
        open={isRingSizeChartOpen}
        onClose={() => setIsRingSizeChartOpen(false)}
        guide={sizeGuide}
      />
    );
  }

  const activeMetal = content?.metalColors.find((metal) => metal.id === selectedMetal);
  const productHref = getWishlistProductHref(product);
  const displayName = detailProduct?.name ?? product.name;
  const displayPrice = displayPricing?.price ?? product.price;
  const displayOriginalPrice =
    displayPricing?.originalPrice != null && displayPricing.originalPrice > displayPrice
      ? displayPricing.originalPrice
      : null;

  const handleAddToBag = () => {
    if (!detailProduct) {
      return;
    }

    if (showSizeSelector && !ringSize.trim()) {
      setRingSizeError("Please select a ring size.");
      return;
    }

    const configurableOptionUids = getConfigurableOptionUidsForMetal(detailProduct, selectedMetal);

    onAddToBag({
      product: displayProduct ?? detailProduct,
      options: {
        metal: activeMetal?.label,
        ringSize: ringSize || undefined,
      },
      ...(configurableOptionUids.length > 0 ? { configurableOptionUids } : {}),
      productCustomOptions: detailProduct.customOptions,
    });
  };

  return (
    <>
      <ProductDetailSidePanelShell
        open={open}
        onClose={onClose}
        overlayAriaLabel="Close product details"
        dialogAriaLabel="Product details"
        asideClassName={wishlistAddToBagAsideClassName}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="relative shrink-0">
            {detailProduct ? (
              <ProductWishlistDetailGalleryCarousel
                product={displayProduct ?? detailProduct}
                imageMaxWidthClass="max-w-full"
              />
            ) : (
              <div className="grid h-250 w-full shrink-0 overflow-hidden">
                <div className="flex h-250 w-full items-center justify-center bg-gray300">
                  <div className="flex h-250 w-full max-w-full items-center justify-center overflow-hidden">
                    <OptimizedImage
                      src={product.primaryImage}
                      alt={product.name}
                      priority
                      sizes="(max-width: 768px) 100vw, 472px"
                      className="object-contain object-center"
                    />
                  </div>
                </div>
              </div>
            )}
            <RightPanelCloseButton onClick={onClose} aria-label="Close" variant="absolute" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-8 md:px-6 md:pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  {content ? (
                    <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0 md:gap-3">
                      {content.attributes.map((attribute, index) => (
                        <li key={attribute} className="flex items-center gap-2 md:gap-3">
                          {index > 0 ? <AttributeSeparator /> : null}
                          <span className="font-gill text-sm font-light leading-110 text-neutral500 md:text-base">
                            {attribute}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : isDetailFetching ? (
                    <div className="h-5 w-40 animate-pulse bg-gray300" aria-hidden />
                  ) : null}
                  <DetailTextLink href={productHref} className="shrink-0 whitespace-nowrap uppercase">
                    See Details
                  </DetailTextLink>
                </div>
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
                  {displayName}
                </h2>
              </div>

              {isDetailReady && showMetalColor ? (
                <div className="flex flex-col gap-4">
                  <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-6">
                      {content!.metalColors.map((metal) =>
                        metalColorSelectable ? (
                          <button
                            key={metal.id}
                            type="button"
                            aria-label={metal.label}
                            aria-pressed={selectedMetal === metal.id}
                            onClick={() => setSelectedMetal(metal.id)}
                            className={cn(
                              "size-[52px] shrink-0",
                              selectedMetal === metal.id && "border-2 border-darkblack",
                            )}
                            style={{ backgroundColor: metal.color }}
                          />
                        ) : (
                          <div
                            key={metal.id}
                            aria-label={metal.label}
                            className="size-[52px] shrink-0 border-2 border-darkblack"
                            style={{ backgroundColor: metal.color }}
                          />
                        ),
                      )}
                    </div>
                    <p className="font-gill text-base leading-110 text-neutral500">{activeMetal?.label}</p>
                  </div>
                </div>
              ) : isDetailFetching ? (
                <div className="flex flex-col gap-4" aria-hidden>
                  <div className="h-5 w-24 animate-pulse bg-gray300" />
                  <div className="h-[52px] w-[52px] animate-pulse bg-gray300" />
                </div>
              ) : null}

              {isDetailReady && showSizeSelector ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                      {sizeGuide?.sizeFieldLabel ?? "Size"}
                    </p>
                    <DetailTextLink onClick={() => setIsRingSizeChartOpen(true)} className="uppercase">
                      Find your size
                    </DetailTextLink>
                  </div>
                  <InlineCustomSelect
                    id="wishlist-ring-size"
                    label={sizeGuide?.sizeFieldLabel ?? "Size"}
                    labelClassName="sr-only"
                    value={ringSize}
                    options={sizeLabels}
                    placeholder="-select-"
                    onChange={(value) => {
                      setRingSize(value);
                      if (value) {
                        setRingSizeError(null);
                      }
                    }}
                    triggerClassName="rounded-none border-0 bg-aboutInactive px-3 text-base text-darkblack"
                    listClassName="bg-aboutInactive"
                    optionClassName="text-base"
                  />
                  {ringSizeError ? (
                    <p className="font-gill text-sm font-light leading-110 text-[#F91616]">
                      {ringSizeError}
                    </p>
                  ) : null}
                </div>
              ) : isDetailFetching ? (
                <div className="flex flex-col gap-2" aria-hidden>
                  <div className="h-5 w-16 animate-pulse bg-gray300" />
                  <div className="h-12 w-full animate-pulse bg-gray300" />
                </div>
              ) : null}
            </div>
          </div>

          <PanelFooter
            showGradient={false}
            className="relative z-10 shrink-0 max-md:pb-[env(safe-area-inset-bottom,0px)]"
            contentClassName="px-6 !border-0 lg:!px-4 md:!px-4 !px-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 font-gill text-2xl leading-110 text-darkblack">
                  <span>₹{formatJewelleryPrice(displayPrice)}</span>
                  {displayOriginalPrice != null ? (
                    <span className="text-base text-gray600 line-through">
                      ₹{formatJewelleryPrice(displayOriginalPrice)}
                    </span>
                  ) : null}
                </div>
                {isDetailReady && pricing?.breakup ? (
                  <DetailTextLink onClick={() => setIsPriceBreakupOpen(true)} className="uppercase">
                    View Price Breakup
                  </DetailTextLink>
                ) : null}
              </div>

              <DetailDarkButton
                className="uppercase disabled:cursor-not-allowed disabled:border-neutral300 disabled:bg-neutral300 disabled:text-white disabled:opacity-100"
                onClick={handleAddToBag}
                disabled={!isDetailReady}
              >
                {wishlistPageContent.addToBagLabel}
              </DetailDarkButton>
            </div>
          </PanelFooter>
        </div>
      </ProductDetailSidePanelShell>

      <RingSizeChartPanel
        open={isRingSizeChartOpen}
        onClose={() => setIsRingSizeChartOpen(false)}
        guide={sizeGuide}
      />

      {detailProduct && displayPricing?.breakup ? (
        <PriceBreakupPanel
          open={isPriceBreakupOpen}
          onClose={() => setIsPriceBreakupOpen(false)}
          productName={detailProduct.name}
          productImage={displayProduct?.image ?? detailProduct.image}
          metalLabel={activeMetal?.label}
          ringSize={ringSize || undefined}
          pricing={displayPricing}
        />
      ) : null}
    </>
  );
};

export default WishlistAddToBagPanel;
