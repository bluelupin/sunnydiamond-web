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
import { cn } from "@/shared/utils/cn";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { bespokeFeaturedStoryModalFigmaSpec } from "@/features/bespoke/data/content";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";

const spec = bespokeFeaturedStoryModalFigmaSpec;
const content = profileTabsContent.bespoke;

const BESPOKE_DETAIL_MOBILE_QUERY = "(max-width: 767px)";

const BESPOKE_DETAIL_OVERLAY_CLASS = "z-[70] bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px]";

type ProfileBespokeDetailPanelProps = {
  open: boolean;
  item: ProfileBespokeItemUi | null;
  onClose: () => void;
  onRemove: (item: ProfileBespokeItemUi) => void;
};

type DetailCarouselProps = {
  images: readonly string[];
  title: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

function DetailCarousel({
  images,
  title,
  activeIndex,
  onActiveIndexChange,
}: DetailCarouselProps) {
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
    <div ref={viewportRef} className="relative h-full min-h-0 w-full overflow-hidden">
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
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative h-full shrink-0"
              style={{ width: viewportWidth > 0 ? viewportWidth : "100%" }}
            >
              <Image
                src={src}
                alt={title}
                fill
                sizes="(max-width: 767px) 100vw, 480px"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type DetailCarouselPaginationProps = {
  images: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

function DetailCarouselPagination({
  images,
  activeIndex,
  onSelect,
}: DetailCarouselPaginationProps) {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {images.map((src, index) => {
        const isActive = index === activeIndex;

        if (isActive) {
          return (
            <span
              key={`${src}-${index}-active`}
              aria-hidden
              className="block h-1 rounded-[24px] bg-white transition-all duration-300"
              style={{ width: spec.paginationActiveWidth }}
            />
          );
        }

        return (
          <button
            key={`${src}-${index}`}
            type="button"
            aria-label={`View image ${index + 1}`}
            onClick={() => onSelect(index)}
            className="size-2 rounded-full bg-neutral300 transition-colors hover:bg-white"
          />
        );
      })}
    </div>
  );
}

export function ProfileBespokeDetailPanel({
  open,
  item,
  onClose,
  onRemove,
}: ProfileBespokeDetailPanelProps) {
  const { showMobileShell } = useResponsiveOverlayShell(open && Boolean(item), BESPOKE_DETAIL_MOBILE_QUERY);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [item?.id]);

  if (!item) {
    return null;
  }

  const images = item.images.length > 0 ? item.images : [item.imageSrc];

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const panelBody = (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-black max-md:h-[85vh]">
      <div className="relative min-h-0 flex-1">
        <DetailCarousel
          images={images}
          title={item.title}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspiration"
          className="absolute right-4 top-6 z-20 inline-flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-6 md:top-10"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="h-6 w-6 md:h-8 md:w-8"
          >
            <path
              d="M24 8L8 24"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 24L8 8"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex w-full flex-col gap-6 bg-transparent px-4 pb-10 pt-5 md:px-6"
        style={{
          backgroundImage: "linear-gradient(to bottom, #00000000, #000000B1, #000000)",
        }}
      >
        <DetailCarouselPagination
          images={images}
          activeIndex={activeImageIndex}
          onSelect={setActiveImageIndex}
        />

        <button
          type="button"
          onClick={() => {
            onRemove(item);
            onClose();
          }}
          className="inline-flex w-fit border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-80"
        >
          {content.removeFromSavedLabel}
        </button>
      </div>
    </div>
  );

  if (showMobileShell) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent
          overlayClassName={BESPOKE_DETAIL_OVERLAY_CLASS}
          className="z-[70] flex max-h-[85vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-black p-0 shadow-2xl [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">{item.title}</DrawerTitle>
          {panelBody}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName={BESPOKE_DETAIL_OVERLAY_CLASS}
        className="z-[70] h-dvh max-h-dvh w-full max-w-480 gap-0 border-0 bg-black p-0 shadow-2xl sm:max-w-480 data-[state=open]:duration-300 data-[state=closed]:duration-300 [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{item.title}</SheetTitle>
        {panelBody}
      </SheetContent>
    </Sheet>
  );
}
