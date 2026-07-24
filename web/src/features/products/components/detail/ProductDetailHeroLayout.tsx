"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/features/products/data/products";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";
import { cn } from "@/shared/utils/cn";
import ProductDetailGallery from "./ProductDetailGallery";
import {
  getPdpLifestyleHeightPx,
  PDP_GALLERY_SECTION_GAP_PX,
  PDP_STICKY_TOP_CLASS,
} from "./productDetailLayout";

type ProductDetailHeroLayoutProps = {
  product: Product;
  purchase: ReactNode;
  details: ReactNode;
};

const ProductDetailHeroLayout = ({ product, purchase, details }: ProductDetailHeroLayoutProps) => {
  const topGalleryRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [galleryContentHeight, setGalleryContentHeight] = useState<number | null>(null);
  const [rightColumnHeight, setRightColumnHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const topGalleryNode = topGalleryRef.current;
    const rightColumnNode = rightColumnRef.current;
    if (!topGalleryNode || !rightColumnNode) return;

    const mediaQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);

    const updateHeights = () => {
      if (!mediaQuery.matches) {
        setGalleryContentHeight(null);
        setRightColumnHeight(null);
        return;
      }

      const topGalleryHeight = topGalleryNode.getBoundingClientRect().height;
      const lifestyleHeight = getPdpLifestyleHeightPx();
      setGalleryContentHeight(topGalleryHeight + lifestyleHeight + PDP_GALLERY_SECTION_GAP_PX);
      setRightColumnHeight(rightColumnNode.getBoundingClientRect().height);
    };

    updateHeights();

    const resizeObserver = new ResizeObserver(updateHeights);
    resizeObserver.observe(topGalleryNode);
    resizeObserver.observe(rightColumnNode);
    mediaQuery.addEventListener("change", updateHeights);
    window.addEventListener("resize", updateHeights);

    return () => {
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updateHeights);
      window.removeEventListener("resize", updateHeights);
    };
  }, []);

  const leftColumnMinHeight =
    galleryContentHeight && rightColumnHeight
      ? Math.max(galleryContentHeight, rightColumnHeight)
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] md:items-start md:gap-4 lg:gap-6">
      <div
        className="flex min-w-0 flex-col md:self-stretch"
        style={leftColumnMinHeight ? { minHeight: `${leftColumnMinHeight}px` } : undefined}
      >
        <div className="flex min-h-full flex-1 flex-col">
          <ProductDetailGallery
            product={product}
            topGalleryRef={topGalleryRef}
          />
        </div>
      </div>

      <div ref={rightColumnRef} className="flex min-w-0 flex-col gap-8 md:mt-8 md:gap-0">
        <div style={galleryContentHeight ? { height: `${galleryContentHeight}px` } : undefined}>
          <div className={cn("md:sticky md:self-start", PDP_STICKY_TOP_CLASS)}>{purchase}</div>
        </div>
        <div className="pt-6 md:pt-6">{details}</div>
      </div>
    </div>
  );
};

export default ProductDetailHeroLayout;
