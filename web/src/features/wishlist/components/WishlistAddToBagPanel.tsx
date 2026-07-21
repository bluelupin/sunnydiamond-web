"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { getProductById } from "@/features/products/data/products";
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
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import ProductWishlistDetailGalleryCarousel from "@/features/products/components/detail/ProductWishlistDetailGalleryCarousel";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import { getWishlistProductHref } from "@/features/wishlist/utils/resolveWishlistProducts";
import { cn } from "@/shared/utils/cn";

type WishlistAddToBagPanelProps = {
  open: boolean;
  productId: string | null;
  onClose: () => void;
  onAddToBag: (payload: AddToBagPayload) => void;
};

const WishlistAddToBagPanel = ({
  open,
  productId,
  onClose,
  onAddToBag,
}: WishlistAddToBagPanelProps) => {
  const baseId = productId?.split("-")[0] ?? "";
  const product = getProductById(baseId);
  const content = product ? getProductDetailContent(product) : null;
  const pricing = product ? getProductDetailPricing(product) : null;

  const [selectedMetal, setSelectedMetal] = useState(content?.metalColors[0]?.id ?? "gold");
  const [ringSize, setRingSize] = useState("");
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);

  useEffect(() => {
    if (!open || !productId || !product) return;
    const detail = getProductDetailContent(product);
    setSelectedMetal(detail.metalColors[0]?.id ?? "gold");
    setRingSize("");
  }, [open, productId, product]);

  if (!open || !productId || !product || !content || !pricing) {
    return (
      <RingSizeChartPanel open={isRingSizeChartOpen} onClose={() => setIsRingSizeChartOpen(false)} />
    );
  }

  const activeMetal = content.metalColors.find((metal) => metal.id === selectedMetal);
  const productHref = getWishlistProductHref(productId);

  const handleAddToBag = () => {
    onAddToBag({
      product,
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
              product={product}
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
                  <ul className="m-0 flex list-none flex-wrap items-center md:gap-3 gap-2 p-0">
                    {content.attributes.map((attribute, index) => (
                      <li key={attribute} className="flex items-center md:gap-3 gap-2">
                        {index > 0 ? <AttributeSeparator /> : null}
                        <span className="font-gill md:text-base text-sm font-light leading-110 text-neutral500">
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
                  {product.name}
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

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                    Ring Size
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
                    {content.ringSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <PanelFooter contentClassName="px-6 !border-0 lg:!px-4 md:!px-4 !px-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 font-gill text-2xl leading-110 text-darkblack">
                  <span>₹{formatJewelleryPrice(pricing.price)}</span>
                  <span className="text-base text-gray600 line-through">
                    ₹{formatJewelleryPrice(pricing.originalPrice)}
                  </span>
                </div>
                <DetailTextLink href="/contact">View Price Breakup</DetailTextLink>
              </div>

              <DetailDarkButton className="uppercase" onClick={handleAddToBag}>
                {wishlistPageContent.addToBagLabel}
              </DetailDarkButton>
            </div>
          </PanelFooter>
        </div>
      </ProductDetailSidePanelShell >

      <RingSizeChartPanel open={isRingSizeChartOpen} onClose={() => setIsRingSizeChartOpen(false)} />
    </>
  );
};

export default WishlistAddToBagPanel;
