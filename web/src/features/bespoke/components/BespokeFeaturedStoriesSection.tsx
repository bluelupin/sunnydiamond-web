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
  resolvePastCreationStory,
  type BespokePastCreationImage,
} from "@/features/bespoke/data/content";
import BespokeFeaturedStoryModal from "@/features/bespoke/components/BespokeFeaturedStoryModal";
import BespokePastCreationsModal from "@/features/bespoke/components/BespokePastCreationsModal";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import type {
  NormalizedBespokeFeaturedSlide,
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";
import { bespokeUiDefaults } from "@/services/bespoke/bespoke-fallbacks";

type FeaturedSlide = NormalizedBespokeFeaturedSlide;

type FeaturedStoryModalSlide = {
  documentId?: string;
  src: string;
  alt: string;
  modalTitle: string;
  modalDescription: string;
  modalImages: readonly { src: string; alt: string }[];
};

const spec = bespokeFeaturedStoriesFigmaSpec;
const GALLERY_SLOTS = [-2, -1, 0, 1, 2] as const;
const SLIDE_DURATION_MS = 550;
const SLIDE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const AUTO_SLIDE_INTERVAL_MS = 2000;
const SWIPE_THRESHOLD_PX = 48;
const MOBILE_GALLERY_MEDIA_QUERY = "(max-width: 767px)";

type GallerySlot = (typeof GALLERY_SLOTS)[number];

type FeaturedSlideIndex = number;

type GalleryDimensions = {
  side: number;
  center: number;
  gap: number;
};

const COMPACT_GALLERY_DIMENSIONS: GalleryDimensions = {
  side: 260,
  center: 280,
  gap: 12,
};

const MOBILE_GALLERY_DIMENSIONS: GalleryDimensions = {
  side: 296,
  center: 296,
  gap: 16,
};

const DESKTOP_GALLERY_DIMENSIONS: GalleryDimensions = {
  side: spec.sideWidth,
  center: spec.centerWidth,
  gap: spec.galleryGap,
};

const getGalleryDimensions = (compact?: boolean): GalleryDimensions => {
  if (compact) return COMPACT_GALLERY_DIMENSIONS;
  if (typeof window !== "undefined" && window.matchMedia(MOBILE_GALLERY_MEDIA_QUERY).matches) {
    return MOBILE_GALLERY_DIMENSIONS;
  }
  return DESKTOP_GALLERY_DIMENSIONS;
};

const mod = (value: number, length: number) => ((value % length) + length) % length;

const getSlideAt = (slides: readonly FeaturedSlide[], activeIndex: FeaturedSlideIndex, offset: number) =>
  slides[mod(activeIndex + offset, slides.length)];

const getSlotOffsetToCenter = (slot: GallerySlot, dimensions: GalleryDimensions) => {
  if (slot === 0) return 0;

  const { side, center, gap } = dimensions;
  const stepToAdjacentCenter = side / 2 + gap + center / 2;
  const stepBetweenSideSlots = side + gap;

  if (slot < 0) {
    let offset = 0;
    for (let step = -1; step >= slot; step -= 1) {
      offset -= step === -1 ? stepToAdjacentCenter : stepBetweenSideSlots;
    }
    return offset;
  }

  let offset = 0;
  for (let step = 1; step <= slot; step += 1) {
    offset += step === 1 ? stepToAdjacentCenter : stepBetweenSideSlots;
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
          className="object-cover object-center transition-opacity duration-[550ms] ease-in-out"
        />
      </div>
    </figure>
  );

  if (openable && onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
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
  backgroundImage?: { desktopUrl: string; mobileUrl: string; alt: string } | null;
  compact?: boolean;
};

const FeaturedGalleryBackground = ({
  slides,
  activeIndex,
  backgroundImage,
  compact,
}: FeaturedGalleryBackgroundProps) => {
  const activeSlide = slides[activeIndex];
  const sectionBgSrc = backgroundImage?.desktopUrl || backgroundImage?.mobileUrl || null;
  const srAlt = backgroundImage?.alt || activeSlide?.alt || "";

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        compact ? "" : "left-1/2 top-0 md:h-[559px] h-[540px] w-[1920px] -translate-x-1/2",
      )}
    >
      {sectionBgSrc ? (
        <Image
          src={sectionBgSrc}
          alt=""
          aria-hidden
          width={1920}
          height={2074}
          sizes={compact ? "100vw" : "1920px"}
          className={cn(
            "absolute left-1/2 top-0 max-w-none -translate-x-1/2 object-cover object-top",
            compact ? "inset-0 size-full" : "h-[2074px] w-[1920px]",
          )}
        />
      ) : (
        slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            aria-hidden
            width={1920}
            height={2074}
            sizes={compact ? "100vw" : "1920px"}
            className={cn(
              "absolute left-1/2 top-0 max-w-none -translate-x-1/2 object-cover object-top transition-opacity duration-[550ms] ease-in-out",
              compact ? "inset-0 size-full" : "h-[2074px] w-[1920px]",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          />
        ))
      )}
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
      {srAlt ? <span className="sr-only">{srAlt}</span> : null}
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
  const suppressClickRef = useRef(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [galleryDimensions, setGalleryDimensions] = useState<GalleryDimensions>(() =>
    getGalleryDimensions(compact),
  );

  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const updateDimensions = () => setGalleryDimensions(getGalleryDimensions(compact));
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [compact]);

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
      pendingTargetIndex.current = null;
      setIsAnimating(false);
      setEnableTransition(false);
      setSlideOffset(0);
      setDragOffset(0);
      onActiveIndexChange(targetIndex);
    },
    [clearFinishTimeout, onActiveIndexChange],
  );

  const startSlideToIndex = useCallback(
    (targetIndex: number, fromOffset = 0) => {
      const currentIndex = activeIndexRef.current;
      if (targetIndex === currentIndex) return;

      const delta = getShortestIndexDelta(currentIndex, targetIndex, slides.length);
      const slot = -delta as GallerySlot;
      const targetOffset = getSlotOffsetToCenter(slot, galleryDimensions);

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
    [clearFinishTimeout, finishSlideToIndex, galleryDimensions, slides.length],
  );

  const goToSlot = useCallback(
    (slot: GallerySlot) => {
      if (!canSlide || isAnimating || slot === 0) return;

      const targetIndex = mod(activeIndexRef.current + slot, slides.length);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        onActiveIndexChange(targetIndex);
        return;
      }

      startSlideToIndex(targetIndex);
    },
    [canSlide, isAnimating, onActiveIndexChange, slides.length, startSlideToIndex],
  );

  const handleSlotSelect = useCallback(
    (slot: GallerySlot) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }

      goToSlot(slot);
    },
    [goToSlot],
  );

  const handleCenterOpen = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    onCenterOpen?.();
  }, [onCenterOpen]);

  const animateSlide = useCallback(
    (direction: -1 | 1) => {
      if (!canSlide || isAnimating || dragState.current.active) return;

      const targetIndex = mod(activeIndexRef.current + direction, slides.length);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        onActiveIndexChange(targetIndex);
        return;
      }

      startSlideToIndex(targetIndex);
    },
    [canSlide, isAnimating, onActiveIndexChange, slides.length, startSlideToIndex],
  );

  useEffect(() => {
    if (!canSlide || isAutoPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      if (isAnimating || isDragging || dragState.current.active) return;
      animateSlide(1);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [animateSlide, canSlide, isAnimating, isAutoPaused, isDragging]);

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

    suppressClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
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
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    setIsDragging(false);

    if (!moved) {
      setDragOffset(0);
      return;
    }

    suppressClickRef.current = true;

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
      onPointerEnter={() => setIsAutoPaused(true)}
      onPointerLeave={() => setIsAutoPaused(false)}
      onFocusCapture={() => setIsAutoPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsAutoPaused(false);
        }
      }}
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
          transition: enableTransition ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}` : "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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
              onSelect={slot !== 0 ? () => handleSlotSelect(slot) : undefined}
              onOpen={slot === 0 ? handleCenterOpen : undefined}
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
  onSlideStart?: (index: number) => void;
  onCenterOpen: () => void;
  title: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  onSecondaryCtaClick: () => void;
  backgroundImage?: { desktopUrl: string; mobileUrl: string; alt: string } | null;
  showHero: boolean;
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
  secondaryCtaLabel,
  onSecondaryCtaClick,
  backgroundImage,
  showHero,
}: FeaturedStoriesLayoutProps) => {
  return (
    <section aria-labelledby="bespoke-featured-stories-title" className=" bg-gray200">
      {showHero ? (
        <div className="relative md:h-[630px] h-[609px] w-full overflow-hidden">
          <FeaturedGalleryBackground
            slides={slides}
            activeIndex={selectedIndex}
            backgroundImage={backgroundImage}
          />
          {title ? (
            <h2
              id="bespoke-featured-stories-title"
              className="absolute left-1/2 md:top-[177px] top-[150px] z-10 w-[326px] -translate-x-1/2 whitespace-nowrap text-center font-larken md:text-5xl text-32 font-light leading-110 text-white"
            >
              {title}
            </h2>
          ) : null}
          {slides.length > 0 ? (
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
          ) : null}
        </div>
      ) : title ? (
        <div className="px-4 pt-16 pb-6 text-center">
          <h2
            id="bespoke-featured-stories-title"
            className="font-larken md:text-5xl text-32 font-light leading-110 text-darkblack"
          >
            {title}
          </h2>
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-6 px-4 md:pt-10 pt-6 md:pb-10 pb-16">
        {primaryCtaLabel ? (
          <Link
            href={primaryCtaHref}
            className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
          >
            <span className="relative z-10">{primaryCtaLabel}</span>
          </Link>
        ) : null}
        {secondaryCtaLabel ? (
          <DetailTextLink onClick={onSecondaryCtaClick} className="uppercase">
            {secondaryCtaLabel}
          </DetailTextLink>
        ) : null}
      </div>
    </section>
  );
};

const BespokeFeaturedStoriesSection = ({
  featuredStories,
  pastCreations,
}: {
  featuredStories: NormalizedBespokeFeaturedStories | null;
  pastCreations: NormalizedBespokePastCreations | null;
}) => {
  const slides = featuredStories?.slides ?? [];
  const defaultSlideIndex = featuredStories?.defaultSlideIndex ?? 0;
  const [activeIndex, setActiveIndex] = useState<number>(defaultSlideIndex);
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultSlideIndex);
  const [modalOpen, setModalOpen] = useState(false);
  const [pastCreationsOpen, setPastCreationsOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{ slideIndex: number; imageIndex: number } | null>(
    null,
  );
  const [modalSlideOverride, setModalSlideOverride] = useState<FeaturedStoryModalSlide | null>(null);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
    setSelectedIndex(index);
  }, []);

  const handleCenterOpen = useCallback(() => {
    if (slides.length === 0) return;
    setModalSlideOverride(null);
    setModalContext({ slideIndex: selectedIndex, imageIndex: 0 });
    setModalOpen(true);
  }, [selectedIndex, slides.length]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setModalContext(null);
    setModalSlideOverride(null);
  }, []);

  const handlePastCreationsOpen = useCallback(() => {
    setPastCreationsOpen(true);
  }, []);

  const handlePastCreationsClose = useCallback(() => {
    setPastCreationsOpen(false);
  }, []);

  const handlePastCreationImageClick = useCallback(
    (image: BespokePastCreationImage) => {
      if (slides.length === 0) {
        setModalSlideOverride({
          documentId: image.documentId,
          src: image.src,
          alt: image.alt,
          modalTitle: pastCreations?.title || bespokeUiDefaults.pastCreationsTitle,
          modalDescription: "",
          modalImages: [{ src: image.src, alt: image.alt }],
        });
        setModalContext({ slideIndex: 0, imageIndex: 0 });
        setModalOpen(true);
        return;
      }

      const resolved = resolvePastCreationStory(slides, image.src, defaultSlideIndex);
      const baseSlide = slides[resolved.slideIndex];
      const matchedIndex = baseSlide.modalImages.findIndex((item) => item.src === image.src);

      if (matchedIndex >= 0) {
        setModalSlideOverride(null);
        setModalContext({ slideIndex: resolved.slideIndex, imageIndex: matchedIndex });
      } else {
        setModalSlideOverride({
          ...baseSlide,
          documentId: image.documentId ?? baseSlide.documentId,
          modalImages: [{ src: image.src, alt: image.alt }, ...baseSlide.modalImages],
        });
        setModalContext({ slideIndex: resolved.slideIndex, imageIndex: 0 });
      }

      setModalOpen(true);
    },
    [defaultSlideIndex, pastCreations?.title, slides],
  );

  const modalSlide: FeaturedStoryModalSlide | null =
    modalSlideOverride ??
    (modalContext !== null ? slides[modalContext.slideIndex] ?? slides[defaultSlideIndex] : null);

  const sharedProps = {
    slides,
    activeIndex,
    selectedIndex,
    onActiveIndexChange: handleActiveIndexChange,
    onCenterOpen: handleCenterOpen,
    title: featuredStories?.title ?? "",
    primaryCtaHref: featuredStories?.primaryCtaHref ?? "/featured-stories",
    primaryCtaLabel: featuredStories?.primaryCtaLabel ?? "",
    secondaryCtaLabel:
      pastCreations && pastCreations.images.length > 0
        ? featuredStories?.secondaryCtaLabel || bespokeUiDefaults.secondaryCtaLabel
        : "",
    onSecondaryCtaClick: handlePastCreationsOpen,
    backgroundImage: featuredStories?.backgroundImage ?? null,
    showHero: slides.length > 0 || Boolean(featuredStories?.backgroundImage),
  };

  return (
    <>
      <FeaturedStoriesLayout {...sharedProps} />
      <BespokeFeaturedStoryModal
        open={modalOpen}
        slide={modalSlide}
        initialImageIndex={modalContext?.imageIndex ?? 0}
        elevated={pastCreationsOpen}
        modalCtaLabel={featuredStories?.modalCtaLabel ?? bespokeUiDefaults.modalCtaLabel}
        modalCtaHref={featuredStories?.modalCtaHref ?? bespokeUiDefaults.modalCtaHref}
        onClose={handleModalClose}
      />
      {pastCreations ? (
        <BespokePastCreationsModal
          open={pastCreationsOpen}
          images={pastCreations.images}
          onClose={handlePastCreationsClose}
          onImageClick={handlePastCreationImageClick}
          suppressEscape={modalOpen}
        />
      ) : null}
    </>
  );
};

export default BespokeFeaturedStoriesSection;
