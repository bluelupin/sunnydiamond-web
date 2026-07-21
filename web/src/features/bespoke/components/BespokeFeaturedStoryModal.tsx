"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { bespokeFeaturedStoryModalFigmaSpec } from "@/features/bespoke/data/content";

const spec = bespokeFeaturedStoryModalFigmaSpec;

type FeaturedStoryModalImage = {
  src: string;
  alt: string;
};

type FeaturedStoryModalSlide = {
  src: string;
  alt: string;
  modalTitle: string;
  modalDescription: string;
  modalImages: readonly FeaturedStoryModalImage[];
};

type BespokeFeaturedStoryModalProps = {
  open: boolean;
  slide: FeaturedStoryModalSlide | null;
  modalCtaLabel: string;
  modalCtaHref: string;
  onClose: () => void;
};

const useFeaturedStoryModalEffects = (open: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
  }, [open, onClose]);
};

type FeaturedStoryModalCarouselProps = {
  images: readonly FeaturedStoryModalImage[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

const FeaturedStoryModalCarousel = ({
  images,
  activeIndex,
  onActiveIndexChange,
}: FeaturedStoryModalCarouselProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, moved: false });
  const activeIndexRef = useRef(activeIndex);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  activeIndexRef.current = activeIndex;

  const canSlide = images.length > 1;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setViewportWidth(viewport.offsetWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length || index === activeIndexRef.current) return;

      setDragOffset(0);
      setEnableTransition(true);
      onActiveIndexChange(index);
    },
    [images.length, onActiveIndexChange],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide) return;
    if ((event.target as HTMLElement).closest("button")) return;

    trackRef.current?.setPointerCapture(event.pointerId);
    dragState.current = { active: true, startX: event.clientX, deltaX: 0, moved: false };
    setIsDragging(true);
    setEnableTransition(false);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = event.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 4) {
      dragState.current.moved = true;
    }
    dragState.current.deltaX = deltaX;
    setDragOffset(deltaX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const { deltaX, moved } = dragState.current;
    dragState.current.active = false;

    try {
      trackRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    setIsDragging(false);

    if (!moved) {
      setDragOffset(0);
      setEnableTransition(true);
      return;
    }

    if (deltaX <= -spec.swipeThresholdPx) {
      goToIndex(Math.min(activeIndexRef.current + 1, images.length - 1));
    } else if (deltaX >= spec.swipeThresholdPx) {
      goToIndex(Math.max(activeIndexRef.current - 1, 0));
    } else {
      setDragOffset(0);
      setEnableTransition(true);
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform") return;
    setEnableTransition(true);
    setDragOffset(0);
  };

  const trackOffset = viewportWidth > 0 ? -activeIndex * viewportWidth + dragOffset : 0;

  return (
    <div ref={viewportRef} className="relative h-full min-h-0 w-full flex-1 overflow-hidden max-md:h-[100vh] max-md:w-full">
      <div
        ref={trackRef}
        className={cn(
          "h-full overflow-hidden",
          canSlide && (isDragging ? "cursor-grabbing" : "cursor-grab"),
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="flex h-full touch-none select-none will-change-transform"
          style={{
            transform: canSlide ? `translate3d(${trackOffset}px, 0, 0)` : undefined,
            transition: enableTransition ? `transform ${spec.slideDurationMs}ms ease-out` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="relative h-full shrink-0 "
              style={{ width: viewportWidth > 0 ? viewportWidth : "100%" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 480px"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {canSlide ? (
        <div className="absolute md:bottom-[230px] bottom-[175px] md:left-6 left-4 z-10 flex items-center gap-2">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            if (isActive) {
              return (
                <span
                  key={`${image.src}-${index}-active`}
                  aria-hidden
                  className="block h-1 bg-white transition-all duration-300 W-12 rounded-[24px]"
                  style={{ width: spec.paginationActiveWidth }}
                />
              );
            }

            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => goToIndex(index)}
                onPointerDown={(event) => event.stopPropagation()}
                className="rounded-full bg-neutral300 transition-colors hover:bg-white w-2 h-2"
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

type FeaturedStoryModalPanelProps = {
  slide: FeaturedStoryModalSlide;
  modalCtaLabel: string;
  modalCtaHref: string;
  onClose: () => void;
};

const FeaturedStoryModalPanel = ({
  slide,
  modalCtaLabel,
  modalCtaHref,
  onClose,
}: FeaturedStoryModalPanelProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [slide.src]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-black max-md:h-[100vh] max-md:w-full">
      <div className="relative flex min-h-0 flex-1 flex-col max-md:h-[100vh] max-md:w-full">
        <FeaturedStoryModalCarousel
          images={slide.modalImages}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close featured story"
          className="absolute md:right-6 right-4 md:top-10 top-6 z-20 inline-flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="md:w-8 md:h-8 w-6 h-6" >
            <path d="M24 8L8 24" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 24L8 8" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div className="shrink-0 bg-transparent md:px-6 px-4 pt-5 pb-10 absolute bottom-0 w-full flex flex-col md:gap-10 gap-6"
        style={{ backgroundImage: "linear-gradient(to bottom, #00000000, #000000B1, #000000)", }}>
        <div className="flex flex-col gap-2 md:gap-4">
          <h2
            className="font-larken font-light leading-110 text-white md:text-32 text-2xl"
          >
            {slide.modalTitle}
          </h2>
          <p
            className="font-gill font-light leading-110 text-white md:text-xl text-base line-clamp-2"
            style={{ fontSize: spec.bodySize }}
          >
            {slide.modalDescription}
          </p>
        </div>
        <Link
          href={modalCtaHref}
          onClick={onClose}
          className="w-fit inline-flex border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-80"
        >
          {modalCtaLabel}
        </Link>
      </div>
    </div>
  );
};

const BespokeFeaturedStoryModal = ({
  open,
  slide,
  modalCtaLabel,
  modalCtaHref,
  onClose,
}: BespokeFeaturedStoryModalProps) => {
  useFeaturedStoryModalEffects(open, onClose);

  if (!open || !slide) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex md:justify-end">
      <button
        type="button"
        aria-label="Close featured story"
        onClick={onClose}
        className={cn(
          "animate-in fade-in duration-300 backdrop-blur-[10px]",
          "max-md:absolute max-md:inset-0 max-md:z-0",
          "md:min-h-0 md:flex-1",
        )}
        style={{ backgroundColor: spec.overlayColor }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={slide.modalTitle}
        className={cn(
          "relative z-10 flex min-h-0 w-full flex-col overflow-hidden bg-black shadow-2xl",
          "max-md:h-[100vh] max-md:max-w-none max-md:animate-in max-md:fade-in max-md:duration-300",
          "md:h-full md:max-w-480 md:shrink-0 md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        <FeaturedStoryModalPanel
          slide={slide}
          modalCtaLabel={modalCtaLabel}
          modalCtaHref={modalCtaHref}
          onClose={onClose}
        />
      </aside>
    </div>
  );
};

export default BespokeFeaturedStoryModal;
