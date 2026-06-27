"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const PDP_STICKY_TOP_CLASS = "top-104";

type ProductDetailHeroLayoutProps = {
  gallery: ReactNode;
  purchase: ReactNode;
  details: ReactNode;
};

const ProductDetailHeroLayout = ({ gallery, purchase, details }: ProductDetailHeroLayoutProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const galleryNode = galleryRef.current;
    if (!galleryNode) return;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const updateGalleryHeight = () => {
      if (!mediaQuery.matches) {
        setGalleryHeight(null);
        return;
      }

      setGalleryHeight(galleryNode.getBoundingClientRect().height);
    };

    updateGalleryHeight();

    const resizeObserver = new ResizeObserver(updateGalleryHeight);
    resizeObserver.observe(galleryNode);
    mediaQuery.addEventListener("change", updateGalleryHeight);
    window.addEventListener("resize", updateGalleryHeight);

    return () => {
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updateGalleryHeight);
      window.removeEventListener("resize", updateGalleryHeight);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-8 lg:hidden">
        {purchase}
        {details}
      </div>

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] lg:items-start lg:gap-6 xl:gap-6">
        <div ref={galleryRef} className="min-w-0">
          {gallery}
        </div>

        <div className="min-w-0">
          <div style={galleryHeight ? { height: `${galleryHeight}px` } : undefined}>
            <div className={cn("sticky", PDP_STICKY_TOP_CLASS)}>
              {purchase}
            </div>
          </div>
          <div className="pt-6">{details}</div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailHeroLayout;
