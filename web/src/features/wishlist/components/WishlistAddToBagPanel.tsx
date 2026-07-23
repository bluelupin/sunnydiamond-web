"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
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
import { fetchSizeGuides } from "@/services/size-guide/size-guide.service";
import { resolveSizeGuideForProduct } from "@/services/size-guide/size-guide.mapper";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { cn } from "@/shared/utils/cn";

type WishlistAddToBagPanelProps = {
  open: boolean;
  product: JewelleryListingProduct | null;
  onClose: () => void;
  onAddToBag: (payload: AddToBagPayload) => void;
};

const WishlistAddToBagPanel = ({
  open,
  product,
  onClose,
  onAddToBag,
}: WishlistAddToBagPanelProps) => {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [sizeGuides, setSizeGuides] = useState<NormalizedSizeGuide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [ringSize, setRingSize] = useState("");
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);

  useEffect(() => {
    if (!open || !product?.urlKey) {
      setDetailProduct(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    void Promise.all([
      fetchMagentoProductByUrlKey(product.urlKey, controller.signal),
      fetchSizeGuides(controller.signal),
    ])
      .then(([fetchedProduct, guides]) => {
        if (controller.signal.aborted) {
          return;
        }

        setDetailProduct(fetchedProduct);
        setSizeGuides(guides);
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
  const sizeGuide =
    detailProduct != null ? resolveSizeGuideForProduct(sizeGuides, detailProduct) : null;
  const sizeLabels = sizeGuide?.sizeLabels ?? [];
  const showSizeSelector = sizeLabels.length > 0;

  useEffect(() => {
    if (!open || !detailProduct || !content) {
      return;
    }

    setSelectedMetal(content.metalColors[0]?.id ?? "gold");
    setRingSize("");
  }, [open, detailProduct, content]);

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
          asideClassName="max-md:max-h-[calc(100vh-4rem)] md:h-[812px] md:max-w-[472px] max-w-full"
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
        asideClassName="max-md:max-h-[calc(100vh-4rem)] md:h-[812px] md:max-w-[472px] max-w-full"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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

              <div className="flex flex-col gap-4">
                <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-6">
                    {content.metalColors.map((metal) => (
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
                    ))}
                  </div>
                  <p className="font-gill text-base leading-110 text-neutral500">{activeMetal?.label}</p>
                </div>
              </div>

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
                  <Select value={ringSize} onValueChange={setRingSize}>
                    <SelectTrigger className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0">
                      <SelectValue placeholder="-select-" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      {sizeLabels.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </div>

          <PanelFooter contentClassName="px-6 !border-0 lg:!px-4 md:!px-4 !px-4">
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
