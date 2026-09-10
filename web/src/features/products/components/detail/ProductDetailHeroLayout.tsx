"use client";

import { useRef, type ReactNode } from "react";
import type { Product } from "@/features/products/data/products";
import { cn } from "@/shared/utils/cn";
import ProductDetailGallery from "./ProductDetailGallery";
import { usePdpPurchaseStickySync } from "@/features/products/hooks/usePdpPurchaseStickySync";
import { PDP_STICKY_TOP_CLASS } from "./productDetailLayout";

type ProductDetailHeroLayoutProps = {
  product: Product;
  purchase: ReactNode;
  details: ReactNode;
};

const ProductDetailHeroLayout = ({ product, purchase, details }: ProductDetailHeroLayoutProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const { stickyRegionHeight, stickyRunwayHeight, isBottomAligned } = usePdpPurchaseStickySync({
    galleryRef,
    purchaseRef,
    productId: product.id,
  });

  const rightColumnStyle =
    stickyRegionHeight > 0
      ? { gridTemplateRows: `${stickyRegionHeight}px auto` }
      : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] md:items-start md:gap-4 lg:gap-6">
      <div className="flex min-w-0 flex-col">
        <ProductDetailGallery product={product} galleryRef={galleryRef} />
      </div>

      <div
        className="grid min-w-0 grid-cols-1 gap-8 md:mt-8 md:gap-0"
        data-pdp-right-column
        data-pdp-sticky-aligned={isBottomAligned ? "true" : "false"}
        style={rightColumnStyle}
      >
        <div
          ref={purchaseRef}
          className={cn("row-start-1 min-w-0 md:sticky md:self-start", PDP_STICKY_TOP_CLASS)}
        >
          {purchase}
          <div
            className="row-start-2 min-w-0 md:mt-10 mt-6"
          // style={
          //   stickyRunwayHeight > 0
          //     ? { marginTop: `-${stickyRunwayHeight}px` }
          //     : undefined
          // }
          >
            {details}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailHeroLayout;
