"use client";

import { useEffect, useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useEdgeAutoScroll } from "@/shared/hooks/use-edge-auto-scroll";
import { useInitialCenterScroll } from "@/shared/hooks/use-initial-center-scroll";
import { cn } from "@/shared/utils/cn";
import {
  bespokePastCreationsFigmaSpec,
  type BespokePastCreationImage,
} from "@/features/bespoke/data/content";

const spec = bespokePastCreationsFigmaSpec;

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

  useEdgeAutoScroll(scrollContainerRef, open, {
    edgeZone: 80,
    maxSpeedPxPerSec: 840,
  });
  useInitialCenterScroll(scrollContainerRef, galleryRef, open);

  usePastCreationsModalEffects(open, onClose, suppressEscape);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Past creations gallery"
      className="fixed inset-0 z-[70] overflow-auto bg-white animate-in fade-in duration-300 horizontalScrollbar verticleScrollbar"
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
        className={cn(
          "inline-block min-h-full w-max min-w-full columns-[160px] gap-4 sm:columns-[200px] md:columns-[351px] md:gap-6 lg:columns-[351px] overflow-x-auto whitespace-nowrap min-w-[1851px]",
        )}
      >
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => onImageClick(image)}
            aria-label={`View story: ${image.alt}`}
            className="w-[351px] md:mb-6 mb-4 block w-full md:h-[424px] break-inside-avoid border-0 bg-transparent p-0 cursor-pointer transition-opacity hover:opacity-90"
          >
            <ResponsiveImage
              desktopSrc={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BespokePastCreationsModal;
