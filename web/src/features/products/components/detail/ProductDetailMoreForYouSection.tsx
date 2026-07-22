"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const TRANSITION_MS = 500;
const TRANSITION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const DESKTOP_FRAME_SIZE = 305;
const DESKTOP_IMAGE_FRAME = "size-[305px]";
const DESKTOP_IMAGE_SIZES = "305px";
const DESKTOP_SIDE_PEEK_VISIBLE_RATIO = 0.7;
const DESKTOP_SIDE_PEEK_VISIBLE_PX = DESKTOP_FRAME_SIZE * DESKTOP_SIDE_PEEK_VISIBLE_RATIO;

type CrossfadeLayerIndex = 0 | 1;

function useCrossfadeSrc(src: string) {
  const frontIndexRef = useRef<CrossfadeLayerIndex>(0);
  const layersRef = useRef<[string, string]>([src, src]);
  const [state, setState] = useState({
    layers: [src, src] as [string, string],
    frontIndex: 0 as CrossfadeLayerIndex,
    animating: false,
    incomingVisible: false,
  });

  useEffect(() => {
    const frontIndex = frontIndexRef.current;
    if (src === layersRef.current[frontIndex]) {
      return;
    }

    const incomingIndex = (1 - frontIndex) as CrossfadeLayerIndex;
    const nextLayers: [string, string] = [...layersRef.current];
    nextLayers[incomingIndex] = src;
    layersRef.current = nextLayers;

    setState({
      layers: nextLayers,
      frontIndex,
      animating: true,
      incomingVisible: false,
    });

    const showFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setState((current) => ({ ...current, incomingVisible: true })));
    });

    const settleTimer = window.setTimeout(() => {
      frontIndexRef.current = incomingIndex;
      setState({
        layers: layersRef.current,
        frontIndex: incomingIndex,
        animating: false,
        incomingVisible: false,
      });
    }, TRANSITION_MS);

    return () => {
      cancelAnimationFrame(showFrame);
      clearTimeout(settleTimer);
    };
  }, [src]);

  return state;
}

type CrossfadeImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  slideDirection?: -1 | 0 | 1;
};

function CrossfadeImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = true,
  width,
  height,
  slideDirection = 0,
}: CrossfadeImageProps) {
  const { layers, frontIndex, animating, incomingVisible } = useCrossfadeSrc(src);
  const incomingIndex = (1 - frontIndex) as CrossfadeLayerIndex;
  const enterOffset =
    slideDirection === 1 ? "translate-x-3" : slideDirection === -1 ? "-translate-x-3" : "translate-x-0";
  const imageMotionClassName =
    "motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-reduce:transition-none motion-reduce:transform-none";

  const renderLayer = (layerIndex: CrossfadeLayerIndex) => {
    const isIncoming = animating && layerIndex === incomingIndex;
    const isVisible = animating
      ? isIncoming
        ? incomingVisible
        : !incomingVisible
      : layerIndex === frontIndex;

    return (
      <Image
        key={`layer-${layerIndex}`}
        src={layers[layerIndex]}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority && layerIndex === frontIndex && !animating}
        aria-hidden={!isVisible}
        className={cn(
          className,
          imageMotionClassName,
          "absolute inset-0",
          isVisible ? "z-10 translate-x-0 opacity-100" : cn("z-0 opacity-0", isIncoming ? enterOffset : "translate-x-0"),
        )}
        style={{ transitionTimingFunction: TRANSITION_EASING }}
      />
    );
  };

  return (
    <div className="relative size-full overflow-hidden">
      {renderLayer(0)}
      {renderLayer(1)}
    </div>
  );
}

function DesktopSidePeek({
  src,
  side,
  slideDirection,
}: {
  src: string;
  side: "prev" | "next";
  slideDirection: -1 | 0 | 1;
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
          slideDirection={slideDirection}
          crossfade
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
  slideDirection = 0,
  crossfade = false,
}: {
  src: string;
  alt: string;
  frameClassName: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  ariaHidden?: boolean;
  slideDirection?: -1 | 0 | 1;
  crossfade?: boolean;
}) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden", frameClassName)}>
      {crossfade ? (
        <CrossfadeImage
          src={src}
          alt={alt}
          className={cn("object-contain object-center", imageClassName)}
          sizes={sizes}
          priority={priority}
          slideDirection={slideDirection}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          aria-hidden={ariaHidden}
          className={cn("object-contain object-center", imageClassName)}
          sizes={sizes}
          priority={priority}
        />
      )}
    </div>
  );
}

const sidePeekImageClassName =
  "absolute left-1/2 top-1/2 size-[262px] -translate-x-[calc(50%-28px)] -translate-y-1/2 object-cover";

function SidePeekImage({
  src,
  flip,
  slideDirection,
}: {
  src: string;
  flip?: boolean;
  slideDirection: -1 | 0 | 1;
}) {
  const image = (
    <div className="relative h-[237px] w-[160px] overflow-hidden">
      <CrossfadeImage
        src={src}
        alt=""
        className={cn(sidePeekImageClassName, "object-cover")}
        sizes="160px"
        slideDirection={slideDirection}
      />
    </div>
  );

  if (!flip) return image;

  return <div className="-scale-y-100 rotate-180">{image}</div>;
}

const ProductDetailMoreForYouSection = ({ items }: ProductDetailMoreForYouSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, pointerId: 0 });
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const canGoPrev = total > 1;
  const canGoNext = total > 1;

  const go = useCallback(
    (direction: -1 | 1) => {
      if (total <= 1 || isTransitioning) return;

      setSlideDirection(direction);
      setIsTransitioning(true);
      setActiveIndex((current) => (current + direction + total) % total);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, TRANSITION_MS);
    },
    [isTransitioning, total],
  );

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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
        if (!trackRef.current || total <= 1) return;
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
    [total],
  );

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.deltaX = event.clientX - dragState.current.startX;
  }, []);

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

        const threshold = 48;
        if (deltaX <= -threshold && canGoNext) go(1);
        else if (deltaX >= threshold && canGoPrev) go(-1);
      },
    [canGoNext, canGoPrev, go],
  );

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];
  const prevItem =
    total > 1 ? items[activeIndex > 0 ? activeIndex - 1 : total - 1] : null;
  const nextItem =
    total > 1 ? items[activeIndex < total - 1 ? activeIndex + 1 : 0] : null;

  const carouselInteractionClassName = cn(
    total > 1 && !isTransitioning && (isDragging ? "cursor-grabbing" : "cursor-grab"),
    total > 1 && "touch-none select-none",
  );

  const labelMotionClassName =
    "motion-safe:transition-opacity motion-safe:duration-500 motion-reduce:transition-none";

  return (
    <section aria-labelledby="more-for-you-heading" className="py-16 lg:py-100">
      <div className="px-4 lg:px-10">
        <PageContainer className="px-0">
          <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-6 lg:gap-10">
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
                  {prevItem ? (
                    <SidePeekImage src={prevItem.image} flip slideDirection={slideDirection} />
                  ) : null}
                </div>

                <div className="relative h-[150px] w-[180px] shrink-0 overflow-hidden">
                  <CrossfadeImage
                    src={activeItem.image}
                    alt={activeItem.name}
                    className="size-full scale-[2] object-contain object-center"
                    sizes="180px"
                    priority={activeIndex === 0}
                    slideDirection={slideDirection}
                  />
                </div>

                <div className="flex w-[160px] shrink-0 items-center justify-center">
                  {nextItem ? (
                    <SidePeekImage src={nextItem.image} slideDirection={slideDirection} />
                  ) : null}
                </div>
              </div>

              <div className="relative mt-[9px] w-full">
                <div className="mx-auto flex w-[144px] flex-col items-center gap-4">
                  <p
                    className={cn(
                      "whitespace-nowrap font-gill text-base leading-110 text-darkblack",
                      labelMotionClassName,
                    )}
                  >
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
        {prevItem ? (
          <DesktopSidePeek src={prevItem.image} side="prev" slideDirection={slideDirection} />
        ) : (
          <div aria-hidden />
        )}

        <div className="flex w-600 max-w-600 flex-col items-center justify-end gap-3">
          <div className="grid h-[305px] w-full place-items-center overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
            <div className="relative mx-auto size-[305px] overflow-hidden">
              <DesktopCarouselImage
                src={activeItem.image}
                alt={activeItem.name}
                frameClassName={DESKTOP_IMAGE_FRAME}
                sizes={DESKTOP_IMAGE_SIZES}
                priority={activeIndex === 0}
                slideDirection={slideDirection}
                crossfade
              />
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
              <p
                className={cn(
                  "whitespace-nowrap font-gill text-xl font-normal leading-110 text-darkblack",
                  labelMotionClassName,
                )}
              >
                {activeItem.name}
              </p>
            </div>
            <DetailOutlineLink href={activeItem.href} className="min-w-32 uppercase">
              Discover
            </DetailOutlineLink>
          </div>
        </div>

        {nextItem ? (
          <DesktopSidePeek src={nextItem.image} side="next" slideDirection={slideDirection} />
        ) : (
          <div aria-hidden />
        )}
      </div>
    </section>
  );
};

export default ProductDetailMoreForYouSection;
