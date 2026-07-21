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
import CarouselChevronLeft from "@/assets/Icons/CarouselChevronLeft";
import CarouselChevronRight from "@/assets/Icons/CarouselChevronRight";
import { cn } from "@/shared/utils/cn";
import {
  bespokeFeaturedStoriesFigmaSpec,
  bespokePageContent,
} from "@/features/bespoke/data/content";
import BespokeFeaturedStoryModal from "@/features/bespoke/components/BespokeFeaturedStoryModal";
import Reveal from "@/shared/Animation/Reveal";
import { DetailTextLink } from "@/features/products/components/detail/shared";

type FeaturedSlide = (typeof bespokePageContent.featuredStories.slides)[number];

const spec = bespokeFeaturedStoriesFigmaSpec;
const GALLERY_SLOTS = [-2, -1, 0, 1, 2] as const;
const SLIDE_DURATION_MS = 500;
const SWIPE_THRESHOLD_PX = 48;

type GallerySlot = (typeof GALLERY_SLOTS)[number];

type FeaturedSlideIndex = number;

const mod = (value: number, length: number) => ((value % length) + length) % length;

const getSlideAt = (slides: readonly FeaturedSlide[], activeIndex: FeaturedSlideIndex, offset: number) =>
  slides[mod(activeIndex + offset, slides.length)];

const getSlotOffsetToCenter = (slot: GallerySlot, compact?: boolean) => {
  if (slot === 0) return 0;

  const gap = compact ? 12 : spec.galleryGap;
  const side = compact ? 260 : spec.sideWidth;
  const center = compact ? 280 : spec.centerWidth;

  if (slot < 0) {
    let offset = 0;
    for (let s = -1; s >= slot; s -= 1) {
      offset -= side + gap;
    }
    return offset;
  }

  let offset = 0;
  for (let s = 1; s <= slot; s += 1) {
    offset += (s === 1 ? center : side) + gap;
  }
  return offset;
};

const getShortestIndexDelta = (from: number, to: number, length: number) => {
  let delta = to - from;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
};

type FeaturedGalleryImageProps = {
  slide: FeaturedSlide;
  slot: GallerySlot;
  slideIndex: FeaturedSlideIndex;
  selectedIndex: FeaturedSlideIndex;
  compact?: boolean;
  interactive?: boolean;
  openable?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
};

const FeaturedGalleryImage = ({
  slide,
  slot,
  slideIndex,
  selectedIndex,
  compact,
  interactive,
  openable,
  onSelect,
  onOpen,
}: FeaturedGalleryImageProps) => {
  const isCenter = slot === 0;
  const isSideLeft = slot < 0;
  const isSelected = slideIndex === selectedIndex;

  const figure = (
    <figure
      className={cn(
        "relative shrink-0 overflow-hidden bg-white transition-shadow duration-300",
        isCenter
          ? compact
            ? "h-[240px] w-[280px]"
            : "md:h-[360px] h-[400px] md:w-[560px] w-[296px]"
          : compact
            ? "h-[200px] w-[260px]"
            : "md:h-[300px] h-[343px] md:w-[400px] w-[296px]",
        isSelected && !isCenter && "ring-2 ring-white/90 ring-offset-2 ring-offset-transparent",
        (interactive || openable) && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "absolute overflow-hidden",
          isCenter &&
          (compact
            ? "left-1/2 top-1/2 h-[560px] w-[370px] -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 md:h-[847px] h-[400px] md:w-[559px] w-[296px] -translate-x-1/2 -translate-y-1/2"),
          isSideLeft &&
          (compact
            ? "right-0 top-1/2 h-[360px] w-[260px] -translate-y-1/2"
            : "right-0 top-1/2 h-[534px] w-[400px] -translate-y-1/2"),
          !isCenter &&
          !isSideLeft &&
          (compact
            ? "left-1/2 top-1/2 h-[240px] w-[400px] -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 md:h-[353px] h-[343px] md:w-[595px] w-[296px] -translate-x-1/2 -translate-y-1/2"),
        )}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          sizes={isCenter ? "560px" : "400px"}
          className="object-cover object-center transition-opacity duration-500 ease-in-out"
        />
      </div>
    </figure>
  );

  if (openable && onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={`Open story: ${slide.modalTitle}`}
        className="shrink-0 border-0 bg-transparent p-0 text-left"
      >
        {figure}
      </button>
    );
  }

  if (!interactive || !onSelect) {
    return figure;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={`View ${slide.alt}`}
      aria-current={isSelected ? "true" : undefined}
      className="shrink-0 border-0 bg-transparent p-0 text-left"
    >
      {figure}
    </button>
  );
};

type FeaturedGalleryBackgroundProps = {
  slides: readonly FeaturedSlide[];
  activeIndex: FeaturedSlideIndex;
  compact?: boolean;
};

const FeaturedGalleryBackground = ({ slides, activeIndex, compact }: FeaturedGalleryBackgroundProps) => {
  const activeSlide = slides[activeIndex];

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        compact ? "" : "left-1/2 top-0 md:h-[559px] h-[540px] w-[1920px] -translate-x-1/2",
      )}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          aria-hidden
          width={1920}
          height={2074}
          sizes={compact ? "100vw" : "1920px"}
          className={cn(
            "absolute left-1/2 top-0 max-w-none -translate-x-1/2 object-cover object-top transition-opacity duration-500 ease-in-out",
            compact ? "inset-0 size-full" : "h-[2074px] w-[1920px]",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: spec.overlayHorizontal,
          backgroundImage: spec.overlayVertical,
        }}
      />
      {!compact ? (
        <div
          aria-hidden
          className="absolute bottom-[-297px] left-1/2 h-[400px] w-[1440px] -translate-x-1/2 backdrop-blur-[5px]"
          style={{ backgroundImage: spec.bottomGradient }}
        />
      ) : null}
      <span className="sr-only">{activeSlide.alt}</span>
    </div>
  );
};

type FeaturedGallerySliderProps = {
  slides: readonly FeaturedSlide[];
  activeIndex: FeaturedSlideIndex;
  selectedIndex: FeaturedSlideIndex;
  onActiveIndexChange: (index: number) => void;
  onSlideStart?: (index: number) => void;
  onCenterOpen?: () => void;
  compact?: boolean;
};

const FeaturedGallerySlider = ({
  slides,
  activeIndex,
  selectedIndex,
  onActiveIndexChange,
  onSlideStart,
  onCenterOpen,
  compact,
}: FeaturedGallerySliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, moved: false });
  const pendingTargetIndex = useRef<number | null>(null);
  const finishTimeoutRef = useRef<number | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(false);

  activeIndexRef.current = activeIndex;

  const canSlide = slides.length > 1;

  const clearFinishTimeout = useCallback(() => {
    if (finishTimeoutRef.current !== null) {
      window.clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  const finishSlideToIndex = useCallback(
    (targetIndex: number) => {
      clearFinishTimeout();
      onActiveIndexChange(targetIndex);
      setEnableTransition(false);
      setSlideOffset(0);
      setIsAnimating(false);
      pendingTargetIndex.current = null;
    },
    [clearFinishTimeout, onActiveIndexChange],
  );

  const startSlideToIndex = useCallback(
    (targetIndex: number, fromOffset = 0) => {
      const currentIndex = activeIndexRef.current;
      if (targetIndex === currentIndex) return;

      const delta = getShortestIndexDelta(currentIndex, targetIndex, slides.length);
      const slot = -delta as GallerySlot;
      const targetOffset = getSlotOffsetToCenter(slot, compact);

      onSlideStart?.(targetIndex);
      pendingTargetIndex.current = targetIndex;
      setIsAnimating(true);
      setEnableTransition(true);
      setSlideOffset(fromOffset);
      setDragOffset(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setSlideOffset(targetOffset);
        });
      });

      clearFinishTimeout();
      finishTimeoutRef.current = window.setTimeout(() => {
        if (pendingTargetIndex.current === targetIndex) {
          finishSlideToIndex(targetIndex);
        }
      }, SLIDE_DURATION_MS + 80);
    },
    [clearFinishTimeout, compact, finishSlideToIndex, onSlideStart, slides.length],
  );

  const goToSlot = useCallback(
    (slot: GallerySlot) => {
      if (!canSlide || isAnimating || slot === 0) return;

      const targetIndex = mod(activeIndexRef.current + slot, slides.length);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        onSlideStart?.(targetIndex);
        onActiveIndexChange(targetIndex);
        return;
      }

      startSlideToIndex(targetIndex);
    },
    [canSlide, isAnimating, onActiveIndexChange, onSlideStart, slides.length, startSlideToIndex],
  );

  const animateSlide = useCallback(
    (direction: -1 | 1) => {
      if (!canSlide || isAnimating || dragState.current.active) return;

      const targetIndex = mod(activeIndexRef.current + direction, slides.length);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        onSlideStart?.(targetIndex);
        onActiveIndexChange(targetIndex);
        return;
      }

      startSlideToIndex(targetIndex);
    },
    [canSlide, isAnimating, onActiveIndexChange, onSlideStart, slides.length, startSlideToIndex],
  );

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform" || pendingTargetIndex.current === null) return;
      finishSlideToIndex(pendingTargetIndex.current);
    },
    [finishSlideToIndex],
  );

  useEffect(() => () => clearFinishTimeout(), [clearFinishTimeout]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide || isAnimating) return;
    if ((event.target as HTMLElement).closest("button, a")) return;

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
      return;
    }

    if (deltaX <= -SWIPE_THRESHOLD_PX) {
      if (!canSlide || isAnimating) {
        setDragOffset(0);
        return;
      }
      const targetIndex = mod(activeIndexRef.current + 1, slides.length);
      startSlideToIndex(targetIndex, deltaX);
      return;
    }

    if (deltaX >= SWIPE_THRESHOLD_PX) {
      if (!canSlide || isAnimating) {
        setDragOffset(0);
        return;
      }
      const targetIndex = mod(activeIndexRef.current - 1, slides.length);
      startSlideToIndex(targetIndex, deltaX);
      return;
    }

    setEnableTransition(true);
    setDragOffset(0);
  };

  const trackTransform = `translate3d(${slideOffset + dragOffset}px, 0, 0)`;

  return (
    <div
      className={cn("relative", compact ? "mx-auto w-max" : "")}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured story gallery"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {canSlide && !compact ? (
        <div className="pointer-events-none absolute inset-y-0 -left-16 -right-16 z-20 flex items-center justify-between">
          <CarouselNavButton
            direction="prev"
            disabled={isAnimating}
            onClick={() => animateSlide(-1)}
          />
          <CarouselNavButton
            direction="next"
            disabled={isAnimating}
            onClick={() => animateSlide(1)}
          />
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={cn(
          "flex items-center will-change-transform motion-reduce:transform-none",
          compact ? "gap-3" : "gap-4",
          canSlide && (isDragging ? "cursor-grabbing" : onCenterOpen ? "cursor-default" : "cursor-grab"),
          canSlide && "touch-none select-none",
        )}
        style={{
          transform: trackTransform,
          transition: enableTransition ? `transform ${SLIDE_DURATION_MS}ms ease-out` : "none",
        }}
        onTransitionEnd={handleTrackTransitionEnd}
      >
        {GALLERY_SLOTS.map((slot) => {
          const slide = getSlideAt(slides, activeIndex, slot);
          const slideIndex = mod(activeIndex + slot, slides.length);

          return (
            <FeaturedGalleryImage
              key={slot}
              slide={slide}
              slot={slot}
              slideIndex={slideIndex}
              selectedIndex={selectedIndex}
              compact={compact}
              interactive={canSlide && slot !== 0 && !isAnimating}
              openable={slot === 0 && !isAnimating && Boolean(onCenterOpen)}
              onSelect={slot !== 0 ? () => goToSlot(slot) : undefined}
              onOpen={slot === 0 ? onCenterOpen : undefined}
            />
          );
        })}
      </div>

      {canSlide && compact ? (
        <div className="mt-4 flex items-center justify-center gap-6">
          <CarouselNavButton
            direction="prev"
            disabled={isAnimating}
            onClick={() => animateSlide(-1)}
            compact
          />
          <CarouselNavButton
            direction="next"
            disabled={isAnimating}
            onClick={() => animateSlide(1)}
            compact
          />
        </div>
      ) : null}
    </div>
  );
};

type CarouselNavButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
  compact?: boolean;
  disabled?: boolean;
};

const CarouselNavButton = ({ direction, onClick, compact, disabled }: CarouselNavButtonProps) => {
  const Icon = direction === "prev" ? CarouselChevronLeft : CarouselChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous featured story" : "Next featured story"}
      className={cn(
        "pointer-events-auto flex items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 disabled:pointer-events-none disabled:opacity-40",
        compact ? "size-10" : "size-12",
      )}
    >
      <Icon
        className={cn(compact ? "h-[14px] w-[15px]" : "h-[17px] w-[18px] invert")}
        strokeWidth={1.25}
      />
    </button>
  );
};

type FeaturedStoriesLayoutProps = {
  slides: readonly FeaturedSlide[];
  activeIndex: FeaturedSlideIndex;
  selectedIndex: FeaturedSlideIndex;
  onActiveIndexChange: (index: number) => void;
  onSlideStart: (index: number) => void;
  onCenterOpen: () => void;
  title: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
};

const FeaturedStoriesLayout = ({
  slides,
  activeIndex,
  selectedIndex,
  onActiveIndexChange,
  onSlideStart,
  onCenterOpen,
  title,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
}: FeaturedStoriesLayoutProps) => {
  return (
    <section aria-labelledby="bespoke-featured-stories-title" className=" bg-gray200">
      <div className="relative md:h-[630px] h-[609px] w-full overflow-hidden">
        <FeaturedGalleryBackground slides={slides} activeIndex={selectedIndex} />
        <h2
          id="bespoke-featured-stories-title"
          className="absolute left-1/2 md:top-[177px] top-[150px] z-10 w-[326px] -translate-x-1/2 whitespace-nowrap text-center font-larken md:text-5xl text-32 font-light leading-110 text-white"
        >
          {title}
        </h2>
        <div className="absolute left-1/2 md:top-[270px] top-[209px] z-10 -translate-x-1/2">
          <FeaturedGallerySlider
            slides={slides}
            activeIndex={activeIndex}
            selectedIndex={selectedIndex}
            onActiveIndexChange={onActiveIndexChange}
            onSlideStart={onSlideStart}
            onCenterOpen={onCenterOpen}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 px-4 md:pt-10 pt-6 md:pb-10 pb-16">
        <Link
          href={primaryCtaHref}
          className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{primaryCtaLabel}</span>
        </Link>
        <DetailTextLink href={secondaryCtaHref} className="uppercase">{secondaryCtaLabel}</DetailTextLink>
      </div>
    </section>
  );
};

const BespokeFeaturedStoriesSection = () => {
  const { featuredStories } = bespokePageContent;
  const { slides, defaultSlideIndex } = featuredStories;
  const [activeIndex, setActiveIndex] = useState<number>(defaultSlideIndex);
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultSlideIndex);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSlideStart = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCenterOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const modalSlide = slides[selectedIndex] ?? slides[defaultSlideIndex];

  const sharedProps = {
    slides,
    activeIndex,
    selectedIndex,
    onActiveIndexChange: setActiveIndex,
    onSlideStart: handleSlideStart,
    onCenterOpen: handleCenterOpen,
    title: featuredStories.title,
    primaryCtaHref: featuredStories.primaryCtaHref,
    primaryCtaLabel: featuredStories.primaryCtaLabel,
    secondaryCtaHref: featuredStories.secondaryCtaHref,
    secondaryCtaLabel: featuredStories.secondaryCtaLabel,
  };

  return (
    <>
      <FeaturedStoriesLayout {...sharedProps} />
      <BespokeFeaturedStoryModal
        open={modalOpen}
        slide={modalSlide}
        modalCtaLabel={featuredStories.modalCtaLabel}
        modalCtaHref={featuredStories.modalCtaHref}
        onClose={handleModalClose}
      />
    </>
  );
};

export default BespokeFeaturedStoriesSection;
