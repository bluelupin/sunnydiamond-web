"use client";

import { useEffect, useState } from "react";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
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
import { fetchMagentoProductByUrlKey } from "@/services/magento/products/productDetail.service";
import { getSizeGuideForProduct } from "@/services/size-guide/size-guide.service";
import { getRingSizeLabels } from "@/features/products/utils/ringSizeOptions.utils";
import {
  getDefaultMetalColorId,
  isMetalColorSelectable,
} from "@/features/products/utils/metalColorOptions.utils";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { cn } from "@/shared/utils/cn";

type WishlistAddToBagPanelProps = {
  open: boolean;
  product: JewelleryListingProduct | null;
  onClose: () => void;
  onAddToBag: (payload: AddToBagPayload) => void;
};

const wishlistAddToBagAsideClassName =
  "max-w-full max-md:max-h-[calc(100vh-4rem)] md:h-full md:max-h-[812px] md:max-w-[472px]";

const WishlistAddToBagPanel = ({
  open,
  product,
  onClose,
  onAddToBag,
}: WishlistAddToBagPanelProps) => {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [sizeGuide, setSizeGuide] = useState<NormalizedSizeGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [ringSize, setRingSize] = useState("");
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);

  useEffect(() => {
    if (!open || !product?.urlKey) {
      setDetailProduct(null);
      setSizeGuide(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    void fetchMagentoProductByUrlKey(product.urlKey, controller.signal)
      .then(async (fetchedProduct) => {
        if (controller.signal.aborted) {
          return;
        }

        setDetailProduct(fetchedProduct);

        if (!fetchedProduct) {
          setSizeGuide(null);
          return;
        }

        const guide = await getSizeGuideForProduct(fetchedProduct, controller.signal);
        if (!controller.signal.aborted) {
          setSizeGuide(guide);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [open, product?.urlKey]);

  const content = detailProduct ? getProductDetailContent(detailProduct) : null;
  const pricing = detailProduct ? getProductDetailPricing(detailProduct) : null;
  const sizeLabels = detailProduct && content
    ? getRingSizeLabels(detailProduct, sizeGuide)
    : [];
  const showSizeSelector = sizeLabels.length > 0;
  const metalColorSelectable = detailProduct ? isMetalColorSelectable(detailProduct) : false;
  const showMetalColor = (content?.metalColors.length ?? 0) > 0;

  useEffect(() => {
    if (!open || !detailProduct) {
      return;
    }

    const nextContent = getProductDetailContent(detailProduct);
    setSelectedMetal(getDefaultMetalColorId(detailProduct, nextContent.metalColors));
    setRingSize("");
  }, [open, detailProduct?.id]);

  if (!open || !product) {
    return (
      <RingSizeChartPanel
        open={isRingSizeChartOpen}
        onClose={() => setIsRingSizeChartOpen(false)}
        guide={sizeGuide}
      />
    );
  }

  if (isLoading || !detailProduct || !content || !pricing) {
    return (
      <>
        <ProductDetailSidePanelShell
          open={open}
          onClose={onClose}
          overlayAriaLabel="Close product details"
          dialogAriaLabel="Product details"
          asideClassName={wishlistAddToBagAsideClassName}
        >
          <div className="flex min-h-[320px] flex-1 items-center justify-center px-6">
            <p className="sr-only" aria-live="polite">
              Loading product details
            </p>
          </div>
        </ProductDetailSidePanelShell>
        <RingSizeChartPanel
          open={isRingSizeChartOpen}
          onClose={() => setIsRingSizeChartOpen(false)}
          guide={sizeGuide}
        />
      </>
    );
  }

  const activeMetal = content.metalColors.find((metal) => metal.id === selectedMetal);
  const productHref = getWishlistProductHref(product);

  const handleAddToBag = () => {
    onAddToBag({
      product: detailProduct,
      options: {
        metal: activeMetal?.label,
        ringSize: ringSize || undefined,
      },
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
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <div className="relative shrink-0">
            <ProductWishlistDetailGalleryCarousel
              product={detailProduct}
              imageMaxWidthClass="max-w-full"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 flex size-6 items-center justify-center text-darkblack"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 5L5 18.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 18.5L5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-8 md:px-6 md:pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
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
                  <DetailTextLink href={productHref} className="shrink-0 whitespace-nowrap">
                    See Details
                  </DetailTextLink>
                </div>
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
                  {detailProduct.name}
                </h2>
              </div>

              {showMetalColor ? (
                <div className="flex flex-col gap-4">
                  <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-6">
                      {content.metalColors.map((metal) =>
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
              ) : null}

              {showSizeSelector ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                      {sizeGuide?.sizeFieldLabel ?? "Size"}
                    </p>
                    <DetailTextLink onClick={() => setIsRingSizeChartOpen(true)}>
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
                    onChange={setRingSize}
                    triggerClassName="rounded-none border-0 bg-aboutInactive px-3 text-base text-darkblack"
                    listClassName="bg-aboutInactive"
                    optionClassName="text-base"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <PanelFooter
            showGradient={false}
            className="relative z-10"
            contentClassName="px-6 !border-0 lg:!px-4 md:!px-4 !px-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 font-gill text-2xl leading-110 text-darkblack">
                  <span>₹{formatJewelleryPrice(pricing.price)}</span>
                  {pricing.originalPrice != null && pricing.originalPrice > pricing.price ? (
                    <span className="text-base text-gray600 line-through">
                      ₹{formatJewelleryPrice(pricing.originalPrice)}
                    </span>
                  ) : null}
                </div>
                <DetailTextLink onClick={() => setIsPriceBreakupOpen(true)}>
                  View Price Breakup
                </DetailTextLink>
              </div>

              <DetailDarkButton className="uppercase" onClick={handleAddToBag}>
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

      <PriceBreakupPanel
        open={isPriceBreakupOpen}
        onClose={() => setIsPriceBreakupOpen(false)}
        productName={detailProduct.name}
        productImage={detailProduct.image}
        metalLabel={activeMetal?.label}
        ringSize={ringSize || undefined}
        pricing={pricing}
      />
    </>
  );
};

export default WishlistAddToBagPanel;
