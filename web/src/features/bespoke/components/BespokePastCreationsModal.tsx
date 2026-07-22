"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useEdgeAutoScroll } from "@/shared/hooks/use-edge-auto-scroll";
import { useInitialCenterScroll } from "@/shared/hooks/use-initial-center-scroll";
import { MOBILE_MEDIA_QUERY } from "@/shared/lib/breakpoints";
import { cn } from "@/shared/utils/cn";
import {
  bespokePastCreationsFigmaSpec,
  type BespokePastCreationImage,
} from "@/features/bespoke/data/content";

const spec = bespokePastCreationsFigmaSpec;

type MasonryLayout = {
  columnCount: number;
  columnWidth: number;
  gap: number;
  tileHeight: number;
};

type MasonryColumnItem = {
  image: BespokePastCreationImage;
  index: number;
};

const getMasonryLayout = (viewportWidth: number): MasonryLayout => {
  if (viewportWidth < 640) {
    return { columnCount: 3, columnWidth: 165, gap: 16, tileHeight: 226 };
  }

  if (viewportWidth < 768) {
    return { columnCount: 4, columnWidth: 200, gap: 16, tileHeight: 350 };
  }

  return { columnCount: 5, columnWidth: 351, gap: 24, tileHeight: 424 };
};

const distributeImagesToColumns = (
  images: readonly BespokePastCreationImage[],
  layout: MasonryLayout,
): MasonryColumnItem[][] => {
  const columns: MasonryColumnItem[][] = Array.from({ length: layout.columnCount }, () => []);
  const columnHeights = Array.from({ length: layout.columnCount }, () => 0);

  images.forEach((image, index) => {
    let targetColumn = 0;

    for (let columnIndex = 1; columnIndex < layout.columnCount; columnIndex += 1) {
      if (columnHeights[columnIndex] < columnHeights[targetColumn]) {
        targetColumn = columnIndex;
      }
    }

    columns[targetColumn].push({ image, index });
    columnHeights[targetColumn] += layout.tileHeight + layout.gap;
  });

  return columns;
};

const usePastCreationsMasonryLayout = (images: readonly BespokePastCreationImage[]) => {
  const [layout, setLayout] = useState<MasonryLayout>(() =>
    getMasonryLayout(typeof window !== "undefined" ? window.innerWidth : 1440),
  );

  useEffect(() => {
    const updateLayout = () => setLayout(getMasonryLayout(window.innerWidth));
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const columns = useMemo(
    () => distributeImagesToColumns(images, layout),
    [images, layout],
  );

  return { columns, layout };
};

const useManualScrollViewport = () => {
  const [isManualScrollViewport, setIsManualScrollViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_MEDIA_QUERY).matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsManualScrollViewport(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isManualScrollViewport;
};

type BespokePastCreationsModalProps = {
  open: boolean;
  images: readonly BespokePastCreationImage[];
  onClose: () => void;
  onImageClick: (image: BespokePastCreationImage) => void;
  suppressEscape?: boolean;
};

const usePastCreationsModalEffects = (
  open: boolean,
  onClose: () => void,
  suppressEscape = false,
) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !suppressEscape) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, suppressEscape]);
};

const BespokePastCreationsModal = ({
  open,
  images,
  onClose,
  onImageClick,
  suppressEscape = false,
}: BespokePastCreationsModalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { columns, layout } = usePastCreationsMasonryLayout(images);
  const isManualScrollViewport = useManualScrollViewport();
  const useDesktopGalleryScroll = open && !isManualScrollViewport;

  useEdgeAutoScroll(scrollContainerRef, useDesktopGalleryScroll, {
    edgeZone: 80,
    maxSpeedPxPerSec: 840,
  });
  useInitialCenterScroll(scrollContainerRef, galleryRef, useDesktopGalleryScroll);

  usePastCreationsModalEffects(open, onClose, suppressEscape);

  useEffect(() => {
    if (!open || !isManualScrollViewport) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [open, isManualScrollViewport]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Past creations gallery"
      className={cn(
        "fixed inset-0 z-[70] overflow-auto bg-white animate-in fade-in duration-300 horizontalMobileScrollbar verticleMobileScrollbar",
        isManualScrollViewport &&
        "touch-pan-x touch-pan-y overscroll-contain [-webkit-overflow-scrolling:touch]",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close past creations gallery"
        className="fixed z-20 inline-flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70"
        style={{ top: spec.closeTop, right: spec.closeRight }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-8 md:h-8 w-6 h-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" aria-hidden>
          <path d="M24 8L8 24" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 24L8 8" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={galleryRef}
        className="inline-flex min-h-max w-max min-w-full items-start gap-4 md:gap-6"
      >
        {columns.map((column, columnIndex) => {
          const isOddColumn = columnIndex % 2 === 0;

          return (
            <div
              key={`past-creations-column-${columnIndex}`}
              className={cn(
                "flex shrink-0 flex-col gap-4 md:gap-6",
                isOddColumn && "relative -mt-[100px]",
              )}
              style={{ width: layout.columnWidth }}
            >
              {column.map(({ image, index }) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => onImageClick(image)}
                  aria-label={`View story: ${image.alt}`}
                  className="block w-full cursor-pointer border-0 bg-transparent p-0 transition-opacity hover:opacity-90 md:h-[424px] h-[165px]"
                  style={{ height: layout.tileHeight }}
                >
                  <ResponsiveImage
                    desktopSrc={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="block h-full w-full object-cover object-center"
                    sizes={`${layout.columnWidth}px`}
                  />
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BespokePastCreationsModal;
