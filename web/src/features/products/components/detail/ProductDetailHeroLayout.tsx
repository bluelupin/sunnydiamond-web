"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";
import { cn } from "@/shared/utils/cn";

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

    const mediaQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);

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
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] md:items-start md:gap-4 lg:gap-6 xl:gap-6">
      <div ref={galleryRef} className="min-w-0">
        {gallery}
      </div>

      <div className="flex min-w-0 flex-col gap-8 md:gap-0">
        <div style={galleryHeight ? { height: `${galleryHeight}px` } : undefined}>
          <div className={cn("md:sticky", PDP_STICKY_TOP_CLASS)}>{purchase}</div>
        </div>
        <div className="md:pt-4 lg:pt-6">{details}</div>
      </div>
    </div>
  );
};

export default ProductDetailHeroLayout;
