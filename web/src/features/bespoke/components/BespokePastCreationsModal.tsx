"use client";

import { useEffect } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
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
  usePastCreationsModalEffects(open, onClose, suppressEscape);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Past creations gallery"
      className="fixed inset-0 z-[70] overflow-y-auto bg-white animate-in fade-in duration-300"
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
      <div className={cn("columns-2 md:gap-6 gap-4 sm:columns-3 md:columns-4 lg:columns-5",)}>
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => onImageClick(image)}
            aria-label={`View story: ${image.alt}`}
            className="md:mb-6 mb-4 block w-full break-inside-avoid border-0 bg-transparent p-0 text-left cursor-pointer transition-opacity hover:opacity-90"
          >
            <ResponsiveImage
              desktopSrc={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block h-auto w-full object-cover object-center"
              sizes="(max-width: 639px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BespokePastCreationsModal;
