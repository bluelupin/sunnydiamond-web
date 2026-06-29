"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import CarouselChevronLeft from "@/assets/Icons/CarouselChevronLeft";
import CarouselChevronRight from "@/assets/Icons/CarouselChevronRight";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";
import { DetailOutlineLink } from "./shared";

type ProductDetailMoreForYouSectionProps = {
  items: MoreForYouCarouselItem[];
};

const SLIDE_DURATION_MS = 500;
const DESKTOP_FRAME_SIZE = 305;
const DESKTOP_IMAGE_FRAME = "size-[305px]";
const DESKTOP_IMAGE_SIZES = "305px";
const DESKTOP_SIDE_PEEK_VISIBLE_RATIO = 0.7;
const DESKTOP_SIDE_PEEK_VISIBLE_PX = DESKTOP_FRAME_SIZE * DESKTOP_SIDE_PEEK_VISIBLE_RATIO;

function DesktopSidePeek({
  src,
  side,
}: {
  src: string;
  side: "prev" | "next";
}) {
  return (
    <div className="pointer-events-none relative h-[305px] overflow-hidden">
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          side === "prev" && "left-0 -translate-x-[30%]",
        )}
        style={side === "next" ? { left: `calc(100% - ${DESKTOP_SIDE_PEEK_VISIBLE_PX}px)` } : undefined}
      >
        <DesktopCarouselImage
          src={src}
          alt=""
          frameClassName={cn(DESKTOP_IMAGE_FRAME, side === "prev" && "mix-blend-luminosity")}
          sizes={DESKTOP_IMAGE_SIZES}
          ariaHidden
        />
      </div>
    </div>
  );
}

function DesktopCarouselImage({
  src,
  alt,
  frameClassName,
  imageClassName,
  sizes,
  priority,
  ariaHidden,
}: {
  src: string;
  alt: string;
  frameClassName: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden", frameClassName)}>
      <Image
        src={src}
        alt={alt}
        fill
        aria-hidden={ariaHidden}
        className={cn("object-contain object-center", imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

const sidePeekImageClassName =
  "absolute left-1/2 top-1/2 size-[262px] -translate-x-[calc(50%-28px)] -translate-y-1/2 object-cover";

function SidePeekImage({ src, flip }: { src: string; flip?: boolean }) {
  const image = (
    <div className="relative h-[237px] w-[160px] overflow-hidden">
      <Image
        src={src}
        alt=""
        width={262}
        height={262}
        aria-hidden
        className={sidePeekImageClassName}
        sizes="160px"
      />
    </div>
  );

  if (!flip) return image;

  return <div className="-scale-y-100 rotate-180">{image}</div>;
}

const ProductDetailMoreForYouSection = ({ items }: ProductDetailMoreForYouSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, pointerId: 0 });
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < total - 1;

  const go = useCallback(
    (direction: -1 | 1) => {
      if (isAnimating || total <= 1) return;

      const next = activeIndex + direction;
      if (next < 0 || next >= total) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        setIsAnimating(true);
        window.setTimeout(() => setIsAnimating(false), SLIDE_DURATION_MS);
      }

      setActiveIndex(next);
    },
    [activeIndex, isAnimating, total],
  );

  const onCarouselKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (total <= 1) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (canGoPrev) go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (canGoNext) go(1);
      }
    },
    [canGoNext, canGoPrev, go, total],
  );

  const onPointerDown = useCallback(
    (trackRef: React.RefObject<HTMLDivElement | null>) =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!trackRef.current || total <= 1 || isAnimating) return;
        if ((event.target as HTMLElement).closest("button, a")) return;

        trackRef.current.setPointerCapture(event.pointerId);
        dragState.current = {
          active: true,
          startX: event.clientX,
          deltaX: 0,
          pointerId: event.pointerId,
        };
        setIsDragging(true);
      },
    [isAnimating, total],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState.current.active) return;
      let deltaX = event.clientX - dragState.current.startX;
      if (activeIndex === 0 && deltaX > 0) deltaX = 0;
      if (activeIndex === total - 1 && deltaX < 0) deltaX = 0;
      dragState.current.deltaX = deltaX;
      setDragOffset(deltaX);
    },
    [activeIndex, total],
  );

  const endDrag = useCallback(
    (trackRef: React.RefObject<HTMLDivElement | null>) =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current.active) return;

        const { deltaX } = dragState.current;
        dragState.current.active = false;

        try {
          trackRef.current?.releasePointerCapture(event.pointerId);
        } catch {
          /* noop */
        }

        setIsDragging(false);
        setDragOffset(0);

        const threshold = 48;
        if (deltaX <= -threshold && canGoNext) go(1);
        else if (deltaX >= threshold && canGoPrev) go(-1);
      },
    [canGoNext, canGoPrev, go],
  );

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];
  const prevItem = total > 1 ? items[(activeIndex - 1 + total) % total] : null;
  const nextItem = total > 1 ? items[(activeIndex + 1) % total] : null;

  const slideOffsetPercent = total > 0 ? (activeIndex * 100) / total : 0;
  const slideTransform = `translateX(calc(-${slideOffsetPercent}% + ${isDragging ? dragOffset : 0}px))`;

  const slideTrackClassName = cn(
    "flex h-full will-change-transform motion-reduce:transition-none",
    !isDragging && "transition-transform duration-500 ease-in-out",
  );

  const carouselInteractionClassName = cn(
    total > 1 && !isAnimating && (isDragging ? "cursor-grabbing" : "cursor-grab"),
    total > 1 && "touch-none select-none",
  );

  return (
    <section aria-labelledby="more-for-you-heading" className="py-16 lg:py-104">
      <div className="px-4 lg:px-40">
        <PageContainer className="px-0">
          <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 lg:gap-40">
            <div className="flex w-full max-w-[350px] flex-col items-center gap-3 text-center lg:max-w-none lg:gap-0 lg:w-full">
              <h2
                id="more-for-you-heading"
                className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-center lg:text-48"
              >
                <span className="md:hidden">Your Diamond Awaits</span>
                <span className="hidden md:inline">More for You</span>
              </h2>
              <p className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 md:hidden">
                Traditional mastery bringing every diamond to radiant, eternal life.
              </p>
            </div>

            <div
              ref={mobileTrackRef}
              className={cn("relative w-full max-w-[343px] overflow-hidden md:hidden", carouselInteractionClassName)}
              role="region"
              aria-roledescription="carousel"
              aria-label="Product recommendations"
              tabIndex={0}
              onKeyDown={onCarouselKeyDown}
              onPointerDown={onPointerDown(mobileTrackRef)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag(mobileTrackRef)}
              onPointerCancel={endDrag(mobileTrackRef)}
            >
            <div className="flex items-center justify-center gap-6">
              <div className="flex w-[160px] shrink-0 items-center justify-center">
                {prevItem ? <SidePeekImage src={prevItem.image} flip /> : null}
              </div>

              <div className="relative h-[150px] w-[180px] shrink-0 overflow-hidden">
                <div
                  className={slideTrackClassName}
                  style={{
                    width: `${total * 100}%`,
                    transform: slideTransform,
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative h-full shrink-0"
                      style={{ width: `${100 / total}%` }}
                    >
                      <Image
                        src={item.image}
                        alt={index === activeIndex ? item.name : ""}
                        fill
                        className="size-full scale-[2] object-contain object-center"
                        sizes="180px"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-[160px] shrink-0 items-center justify-center">
                {nextItem ? <SidePeekImage src={nextItem.image} /> : null}
              </div>
            </div>

            <div className="relative mt-[9px] w-full">
              <div className="mx-auto flex w-[144px] flex-col items-center gap-4">
                <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                  {activeItem.name}
                </p>
                <DetailOutlineLink href={activeItem.href} className="h-14 min-w-[132px] uppercase">
                  Shop Now
                </DetailOutlineLink>
              </div>

              {total > 1 ? (
                <div className="pointer-events-none absolute inset-x-4 top-[32px] z-20 flex items-start justify-between">
                <button
                  type="button"
                  aria-label="Previous recommendation"
                  disabled={!canGoPrev}
                  onClick={() => go(-1)}
                  className={cn(
                    "pointer-events-auto inline-flex size-6 items-center justify-center px-[3px] py-1 text-darkblack transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                    canGoPrev ? "hover:opacity-70" : "cursor-not-allowed",
                  )}
                >
                  <CarouselChevronLeft className="h-[17px] w-[18px]" disabled={!canGoPrev} strokeWidth={1} />
                </button>
                <button
                  type="button"
                  aria-label="Next recommendation"
                  disabled={!canGoNext}
                  onClick={() => go(1)}
                  className={cn(
                    "pointer-events-auto inline-flex size-6 items-center justify-center px-[3px] py-1 text-darkblack transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                    canGoNext ? "hover:opacity-70" : "cursor-not-allowed",
                  )}
                >
                  <CarouselChevronRight className="h-[17px] w-[18px]" disabled={!canGoNext} strokeWidth={1} />
                </button>
                </div>
              ) : null}
            </div>
          </div>
          </div>
        </PageContainer>
      </div>

      <div
        ref={desktopTrackRef}
        className={cn(
          "hidden w-full overflow-x-hidden md:grid md:grid-cols-[minmax(0,1fr)_600px_minmax(0,1fr)] md:items-start lg:items-start",
          carouselInteractionClassName,
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label="Product recommendations"
        tabIndex={0}
        onKeyDown={onCarouselKeyDown}
        onPointerDown={onPointerDown(desktopTrackRef)}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag(desktopTrackRef)}
        onPointerCancel={endDrag(desktopTrackRef)}
      >
        {total > 1 && prevItem ? <DesktopSidePeek src={prevItem.image} side="prev" /> : null}

        <div className="flex w-600 max-w-600 flex-col items-center justify-end gap-3">
          <div className="grid h-[305px] w-full place-items-center overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
            <div className="relative mx-auto size-[305px] overflow-hidden">
              <div
                className={slideTrackClassName}
                style={{
                  width: `${total * 100}%`,
                  transform: slideTransform,
                }}
              >
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative flex h-full shrink-0 items-center justify-center"
                    style={{ width: `${100 / total}%` }}
                  >
                    <DesktopCarouselImage
                      src={item.image}
                      alt={index === activeIndex ? item.name : ""}
                      frameClassName={DESKTOP_IMAGE_FRAME}
                      sizes={DESKTOP_IMAGE_SIZES}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {total > 1 ? (
              <div className="pointer-events-auto flex w-[487px] translate-y-[20px] items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous recommendation"
                  disabled={!canGoPrev}
                  onClick={() => go(-1)}
                  className={cn(
                    "inline-flex size-[25px] shrink-0 items-center justify-center px-[3px] py-1 text-darkblack transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                    canGoPrev ? "hover:opacity-70" : "cursor-not-allowed",
                  )}
                >
                  <CarouselChevronLeft className="h-[17px] w-[18px]" disabled={!canGoPrev} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next recommendation"
                  disabled={!canGoNext}
                  onClick={() => go(1)}
                  className={cn(
                    "inline-flex size-[25px] shrink-0 items-center justify-center px-[3px] py-1 text-darkblack transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
                    canGoNext ? "hover:opacity-70" : "cursor-not-allowed",
                  )}
                >
                  <CarouselChevronRight className="h-[17px] w-[18px]" disabled={!canGoNext} strokeWidth={1.5} />
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <p className="whitespace-nowrap font-gill text-[20px] font-normal leading-110 text-darkblack">
                {activeItem.name}
              </p>
            </div>
            <DetailOutlineLink href={activeItem.href} className="min-w-32 uppercase">
              Discover
            </DetailOutlineLink>
          </div>
        </div>

        {total > 1 && nextItem ? <DesktopSidePeek src={nextItem.image} side="next" /> : null}
      </div>
    </section>
  );
};

export default ProductDetailMoreForYouSection;
