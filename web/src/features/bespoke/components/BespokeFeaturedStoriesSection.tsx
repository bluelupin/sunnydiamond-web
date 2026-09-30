"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Slider, { type Settings } from "react-slick";
import CarouselChevronLeft from "@/assets/Icons/CarouselChevronLeft";
import CarouselChevronRight from "@/assets/Icons/CarouselChevronRight";
import { cn } from "@/shared/utils/cn";
import "slick-carousel/slick/slick.css";
import {
  bespokeFeaturedStoriesFigmaSpec,
  resolvePastCreationStory,
  type BespokePastCreationImage,
} from "@/features/bespoke/data/content";
import BespokeFeaturedStoryModal from "@/features/bespoke/components/BespokeFeaturedStoryModal";
import BespokePastCreationsModal from "@/features/bespoke/components/BespokePastCreationsModal";
import { DetailDarkButton, DetailTextLink } from "@/features/products/components/detail/shared";
import { unlockBodyScroll, useBodyScrollLock } from "@/shared/hooks/use-body-scroll-lock";
import type {
  NormalizedBespokeFeaturedSlide,
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";

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

const normalizeIndex = (index: number, total: number) => {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
};

type RenderFeaturedSlide = FeaturedSlide & { renderKey?: string };

/** Minimum track length for galleryVisibleSlides (5) center-mode layout + seamless loop. */
const getMinimumRenderSlideCount = () => spec.galleryVisibleSlides + spec.gallerySlidesToShow;

/** Enough duplicated sets so 3 (or fewer) source slides still loop and always fill 5 visible slots. */
const getLoopCopyCount = (sourceCount: number) => {
  if (sourceCount <= 1) return 1;
  return Math.max(3, Math.ceil(getMinimumRenderSlideCount() / sourceCount));
};

/** Full slide slots in the center band; outer peeks come from centerPadding (5 visible total). */
const getGalleryActiveSlidesToShow = (renderLength: number) => {
  if (renderLength <= 1) return 1;

  const slotsInCenterBand = Math.max(1, spec.galleryVisibleSlides - 2);
  return Math.min(slotsInCenterBand, renderLength);
};

/** Duplicate slide sets so center-mode infinite can loop without hitting the track ends. */
const buildRenderSlides = (slides: readonly FeaturedSlide[]) => {
  if (slides.length <= 1) {
    return {
      renderSlides: slides as RenderFeaturedSlide[],
      sourceCount: slides.length,
      loopCopies: 1,
    };
  }

  const sourceCount = slides.length;
  const loopCopies = getLoopCopyCount(sourceCount);
  const renderSlides: RenderFeaturedSlide[] = [];

  for (let copy = 0; copy < loopCopies; copy += 1) {
    renderSlides.push(
      ...slides.map((slide, index) => ({
        ...slide,
        renderKey: `${slide.documentId ?? slide.src}-copy${copy}-${index}`,
      })),
    );
  }

  return {
    sourceCount,
    renderSlides,
    loopCopies,
  };
};

const getRenderIndexForSource = (
  sourceIndex: number,
  sourceCount: number,
  renderLength: number,
  loopCopies: number,
) => {
  if (renderLength <= sourceCount || sourceCount <= 0) {
    return normalizeIndex(sourceIndex, renderLength);
  }

  const middleCopy = Math.floor(loopCopies / 2);
  return middleCopy * sourceCount + normalizeIndex(sourceIndex, sourceCount);
};

type SliderWithInner = Slider & {
  innerSlider?: {
    currentSlide?: number;
    onWindowResized?: () => void;
  };
};

const getCurrentRenderIndex = (slider: Slider | null) => {
  const inner = (slider as SliderWithInner | null)?.innerSlider;
  return inner?.currentSlide ?? 0;
};

/** Keep the track in the middle copy so forward/back steps never hit hard ends. */
const getLoopRecenterTarget = (
  renderIndex: number,
  sourceCount: number,
  loopCopies: number,
  renderLength: number,
) => {
  if (renderLength <= sourceCount || loopCopies <= 1) return null;

  const copySize = sourceCount;
  const lastCopyStart = copySize * (loopCopies - 1);

  if (renderIndex < copySize) return renderIndex + copySize;
  if (renderIndex >= lastCopyStart) return renderIndex - copySize;
  return null;
};

/** Shift into an equivalent slide before wrapping at the physical track ends. */
const getLoopPrepareTarget = (
  renderIndex: number,
  direction: "next" | "prev",
  sourceCount: number,
  loopCopies: number,
  renderLength: number,
) => {
  if (renderLength <= sourceCount || loopCopies <= 1) return null;

  const copySize = sourceCount;
  const copySpan = copySize * (loopCopies - 1);
  const lastRenderIndex = renderLength - 1;

  if (direction === "next" && renderIndex >= lastRenderIndex) {
    return renderIndex - copySpan;
  }

  if (direction === "prev" && renderIndex <= 0) {
    return renderIndex + copySpan;
  }

  return null;
};

/** Scale from a shared center-sized base; slot widths include Figma gap so slides do not overlap. */
const getGalleryScaleMetrics = (isMobile: boolean) => {
  if (isMobile) {
    const baseWidth = 296;
    const baseHeight = 400;
    const sideVisualWidth = 296;
    const sideVisualHeight = 343;
    return {
      baseWidth,
      baseHeight,
      stageHeight: baseHeight,
      sideVisualWidth,
      sideVisualHeight,
      centerVisualWidth: baseWidth,
      centerVisualHeight: baseHeight,
      galleryGap: spec.galleryGap,
      sideScaleX: 1,
      sideScaleY: sideVisualHeight / baseHeight,
      centerScaleX: 1,
      centerScaleY: 1,
    };
  }

  return {
    baseWidth: spec.centerWidth,
    baseHeight: spec.centerHeight,
    stageHeight: spec.centerHeight,
    sideVisualWidth: spec.sideWidth,
    sideVisualHeight: spec.sideHeight,
    centerVisualWidth: spec.centerWidth,
    centerVisualHeight: spec.centerHeight,
    galleryGap: spec.galleryGap,
    sideScaleX: spec.sideWidth / spec.centerWidth,
    sideScaleY: spec.sideHeight / spec.centerHeight,
    centerScaleX: 1,
    centerScaleY: 1,
  };
};

type GalleryScaleStyle = CSSProperties & {
  "--fg-stage-h"?: string;
  "--fg-base-w"?: string;
  "--fg-base-h"?: string;
  "--fg-gap"?: string;
  "--fg-side-visual-w"?: string;
  "--fg-side-visual-h"?: string;
  "--fg-center-visual-w"?: string;
  "--fg-center-visual-h"?: string;
  "--fg-side-scale-x"?: string;
  "--fg-side-scale-y"?: string;
  "--fg-center-scale-x"?: string;
  "--fg-center-scale-y"?: string;
};

/** ~25% of side slide width — outer peek for galleryVisibleSlides (5) center mode. */
const resolveGalleryCenterPaddingPx = (viewportWidth: number, isMobile: boolean) => {
  const sideVisualWidth = getGalleryScaleMetrics(isMobile).sideVisualWidth;
  const proportionalPeek = Math.round(sideVisualWidth * 0.25);

  if (isMobile) {
    return Math.max(spec.galleryCenterPaddingMobile, proportionalPeek);
  }

  if (viewportWidth >= 1440) {
    return Math.max(spec.galleryCenterPaddingDesktop, proportionalPeek + 16);
  }

  return Math.max(spec.galleryCenterPaddingDesktop, proportionalPeek);
};

/** react-slick only applies centerPadding updates after resize refresh. */
const useGalleryCenterPadding = (isMobile: boolean | null) => {
  const [centerPadding, setCenterPadding] = useState(
    `${spec.galleryCenterPaddingDesktop}px`,
  );

  useEffect(() => {
    if (isMobile === null) return;

    const sync = () => {
      const px = resolveGalleryCenterPaddingPx(window.innerWidth, isMobile);
      setCenterPadding(`${px}px`);
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [isMobile]);

  return centerPadding;
};

const getGalleryScaleStyle = (isMobile: boolean): GalleryScaleStyle => {
  const metrics = getGalleryScaleMetrics(isMobile);
  return {
    "--fg-stage-h": `${metrics.stageHeight}px`,
    "--fg-base-w": `${metrics.baseWidth}px`,
    "--fg-base-h": `${metrics.baseHeight}px`,
    "--fg-gap": `${spec.galleryGap}px`,
    "--fg-side-visual-w": `${metrics.sideVisualWidth}px`,
    "--fg-side-visual-h": `${metrics.sideVisualHeight}px`,
    "--fg-center-visual-w": `${metrics.centerVisualWidth}px`,
    "--fg-center-visual-h": `${metrics.centerVisualHeight}px`,
    "--fg-side-scale-x": String(metrics.sideScaleX),
    "--fg-side-scale-y": String(metrics.sideScaleY),
    "--fg-center-scale-x": String(metrics.centerScaleX),
    "--fg-center-scale-y": String(metrics.centerScaleY),
  };
};

type FeaturedGallerySlideProps = {
  slide: FeaturedSlide;
  onClick?: () => void;
};

const featuredGallerySlideTransitionClassName =
  "transition-transform duration-500 ease-in-out motion-reduce:transition-none";

const CLICK_DRAG_TOLERANCE_PX = 8;

const FeaturedGallerySlide = ({ slide, onClick }: FeaturedGallerySlideProps) => {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!onClick) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;

    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start) {
      onClick();
      return;
    }

    const deltaX = Math.abs(event.clientX - start.x);
    const deltaY = Math.abs(event.clientY - start.y);

    if (deltaX <= CLICK_DRAG_TOLERANCE_PX && deltaY <= CLICK_DRAG_TOLERANCE_PX) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "featured-gallery-slide relative overflow-hidden bg-white",
        featuredGallerySlideTransitionClassName,
      )}
      onPointerDown={onClick ? handlePointerDown : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        sizes="(max-width: 768px) 296px, (max-width: 1200px) 400px, 560px"
        loading="lazy"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
};

type FeaturedGalleryBackgroundProps = {
  slides: readonly FeaturedSlide[];
  activeIndex: number;
  backgroundImage?: { desktopUrl: string; mobileUrl: string; alt: string } | null;
};

const FeaturedGalleryBackground = ({
  slides,
  activeIndex,
  backgroundImage,
}: FeaturedGalleryBackgroundProps) => {
  const safeIndex = slides.length > 0 ? normalizeIndex(activeIndex, slides.length) : 0;
  const activeSlide = slides[safeIndex];
  const fallbackBgSrc = backgroundImage?.desktopUrl || backgroundImage?.mobileUrl || null;
  const srAlt = activeSlide?.alt ?? "";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] md:h-[559px]">
      <div className="absolute inset-0 z-0">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <Image
              key={slide.documentId ?? `${slide.src}-${index}`}
              src={slide.src}
              alt={index === safeIndex ? slide.alt : ""}
              fill
              sizes="100vw"
              priority={index === safeIndex}
              className={cn(
                "object-cover object-top transition-opacity duration-500 ease-in-out",
                index === safeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))
        ) : fallbackBgSrc ? (
          <Image
            src={fallbackBgSrc}
            alt={backgroundImage?.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : null}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `${spec.overlayHorizontalGradient}, ${spec.overlayVertical}, linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.15) 38%, rgba(0, 0, 0, 0) 52%)`,
        }}
      />

      {/* <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-full"
        style={{ backgroundImage: spec.bottomGradient }}
      /> */}

      {srAlt && slides.length === 0 && fallbackBgSrc ? (
        <span className="sr-only">{srAlt}</span>
      ) : null}
    </div>
  );
};

type FeaturedGallerySliderProps = {
  slides: readonly FeaturedSlide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
};

const MOBILE_BREAKPOINT_PX = 768;
const SLIDER_SPEED_MS = 500;
const MANUAL_SCROLL_COOLDOWN_MS = 500;
const HORIZONTAL_WHEEL_THRESHOLD_PX = 24;
const HORIZONTAL_WHEEL_RESET_MS = 120;

/** react-slick responsive only updates on resize; detect viewport on mount. */
const useIsMobileViewport = (breakpoint: number) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const sync = () => setIsMobile(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, [breakpoint]);

  return isMobile;
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
        "pointer-events-auto flex items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
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

const FeaturedGallerySlider = ({
  slides,
  currentIndex,
  onIndexChange,
}: FeaturedGallerySliderProps) => {
  const isMobile = useIsMobileViewport(MOBILE_BREAKPOINT_PX);
  const sliderRef = useRef<Slider | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const manualScrollCooldownRef = useRef(false);
  const isHoveringRef = useRef(false);
  const lastEmittedSourceIndexRef = useRef(currentIndex);
  const isRecenteringRef = useRef(false);
  const recenterUnlockFrameRef = useRef<number | null>(null);
  const horizontalWheelDeltaRef = useRef(0);
  const horizontalWheelResetTimeoutRef = useRef<number | null>(null);
  const { renderSlides, sourceCount, loopCopies } = useMemo(() => buildRenderSlides(slides), [slides]);
  const slidesKey = useMemo(
    () => renderSlides.map((slide) => slide.renderKey ?? slide.src).join("|"),
    [renderSlides],
  );

  const canSlide = slides.length > 1;
  const isMobileLayout = isMobile === true;
  const activeSlidesToShow = getGalleryActiveSlidesToShow(renderSlides.length);
  const galleryCenterPadding = useGalleryCenterPadding(isMobile);
  /** Native infinite when the duplicated track is longer than the 5-up center band (incl. 3 source slides). */
  const useNativeInfinite = canSlide && renderSlides.length > activeSlidesToShow;
  /** Custom recenter loop only when the track is too short for native infinite. */
  const useSeamlessLoop =
    canSlide && !useNativeInfinite && loopCopies > 1 && renderSlides.length > sourceCount;
  const galleryScaleStyle = getGalleryScaleStyle(isMobileLayout);
  const galleryStageHeight = getGalleryScaleMetrics(isMobileLayout).stageHeight;

  const mapToSourceIndex = useCallback(
    (index: number) => normalizeIndex(index, sourceCount),
    [sourceCount],
  );

  const emitSourceIndex = useCallback(
    (renderIndex: number) => {
      const sourceIndex = mapToSourceIndex(renderIndex);
      lastEmittedSourceIndexRef.current = sourceIndex;
      onIndexChange(sourceIndex);
    },
    [mapToSourceIndex, onIndexChange],
  );

  const clearRecenterUnlockFrame = useCallback(() => {
    if (recenterUnlockFrameRef.current !== null) {
      window.cancelAnimationFrame(recenterUnlockFrameRef.current);
      recenterUnlockFrameRef.current = null;
    }
  }, []);

  const setRecentering = useCallback((active: boolean) => {
    isRecenteringRef.current = active;
    containerRef.current?.classList.toggle("featured-gallery-slider--recentering", active);
  }, []);

  const runInstantSlideJump = useCallback(
    (targetIndex: number, onComplete?: () => void) => {
      clearRecenterUnlockFrame();
      setRecentering(true);

      window.requestAnimationFrame(() => {
        sliderRef.current?.slickGoTo(targetIndex, true);

        recenterUnlockFrameRef.current = window.requestAnimationFrame(() => {
          recenterUnlockFrameRef.current = window.requestAnimationFrame(() => {
            setRecentering(false);
            recenterUnlockFrameRef.current = null;
            onComplete?.();
          });
        });
      });
    },
    [clearRecenterUnlockFrame, setRecentering],
  );

  const recenterLoopTrack = useCallback(
    (renderIndex: number) => {
      const target = getLoopRecenterTarget(
        renderIndex,
        sourceCount,
        loopCopies,
        renderSlides.length,
      );
      if (target === null || target === renderIndex) return;

      runInstantSlideJump(target);
    },
    [loopCopies, renderSlides.length, runInstantSlideJump, sourceCount],
  );

  const handleBeforeChange = useCallback(
    (current: number, next: number) => {
      if (!useSeamlessLoop || !sliderRef.current || isRecenteringRef.current) return;

      const direction = next > current ? "next" : "prev";
      const prepareTarget = getLoopPrepareTarget(
        current,
        direction,
        sourceCount,
        loopCopies,
        renderSlides.length,
      );

      if (prepareTarget !== null && prepareTarget !== current) {
        runInstantSlideJump(prepareTarget);
      }
    },
    [loopCopies, renderSlides.length, runInstantSlideJump, sourceCount, useSeamlessLoop],
  );

  const handleAfterChange = useCallback(
    (index: number) => {
      if (isRecenteringRef.current) return;

      emitSourceIndex(index);
      if (useSeamlessLoop) {
        recenterLoopTrack(index);
      }
    },
    [emitSourceIndex, recenterLoopTrack, useSeamlessLoop],
  );

  const initialSlide = useMemo(
    () => getRenderIndexForSource(currentIndex, sourceCount, renderSlides.length, loopCopies),
    [currentIndex, loopCopies, renderSlides.length, slidesKey, sourceCount],
  );

  const refreshSlider = useCallback(() => {
    const slider = sliderRef.current as SliderWithInner | null;
    slider?.innerSlider?.onWindowResized?.();
  }, []);

  useEffect(() => {
    setRecentering(true);
    refreshSlider();
    const frame = window.requestAnimationFrame(() => {
      setRecentering(false);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    activeSlidesToShow,
    galleryCenterPadding,
    isMobile,
    refreshSlider,
    renderSlides.length,
    setRecentering,
    slidesKey,
    useNativeInfinite,
  ]);

  const stepSlider = useCallback(
    (direction: "next" | "prev") => {
      if (!canSlide || !sliderRef.current) return;

      const advance = () => {
        if (direction === "next") {
          sliderRef.current?.slickNext();
        } else {
          sliderRef.current?.slickPrev();
        }
      };

      const current = getCurrentRenderIndex(sliderRef.current);
      if (!useSeamlessLoop) {
        advance();
        return;
      }

      const prepareTarget = getLoopPrepareTarget(
        current,
        direction,
        sourceCount,
        loopCopies,
        renderSlides.length,
      );

      if (prepareTarget === null) {
        advance();
        return;
      }

      runInstantSlideJump(prepareTarget, advance);
    },
    [canSlide, loopCopies, renderSlides.length, runInstantSlideJump, sourceCount, useSeamlessLoop],
  );

  const goPrev = useCallback(() => {
    if (!canSlide || manualScrollCooldownRef.current) return;

    manualScrollCooldownRef.current = true;
    stepSlider("prev");
    window.setTimeout(() => {
      manualScrollCooldownRef.current = false;
    }, MANUAL_SCROLL_COOLDOWN_MS);
  }, [canSlide, stepSlider]);

  const goNext = useCallback(() => {
    if (!canSlide || manualScrollCooldownRef.current) return;

    manualScrollCooldownRef.current = true;
    stepSlider("next");
    window.setTimeout(() => {
      manualScrollCooldownRef.current = false;
    }, MANUAL_SCROLL_COOLDOWN_MS);
  }, [canSlide, stepSlider]);

  useEffect(() => {
    if (currentIndex === lastEmittedSourceIndexRef.current) return;

    lastEmittedSourceIndexRef.current = currentIndex;
    const target = getRenderIndexForSource(
      currentIndex,
      sourceCount,
      renderSlides.length,
      loopCopies,
    );
    sliderRef.current?.slickGoTo(target, false);
  }, [currentIndex, loopCopies, renderSlides.length, sourceCount, slidesKey]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !canSlide) return;

    const normalizeWheelDelta = (event: WheelEvent) => {
      let deltaX = event.deltaX;
      let deltaY = event.deltaY;

      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        deltaX *= 16;
        deltaY *= 16;
      } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        deltaX *= window.innerWidth;
        deltaY *= window.innerHeight;
      }

      if (Math.abs(deltaX) >= 1) return deltaX;
      if (event.shiftKey && Math.abs(deltaY) >= 1) return deltaY;
      return 0;
    };

    const resetHorizontalWheelDelta = () => {
      horizontalWheelDeltaRef.current = 0;
      if (horizontalWheelResetTimeoutRef.current !== null) {
        window.clearTimeout(horizontalWheelResetTimeoutRef.current);
        horizontalWheelResetTimeoutRef.current = null;
      }
    };

    const scheduleHorizontalWheelReset = () => {
      if (horizontalWheelResetTimeoutRef.current !== null) {
        window.clearTimeout(horizontalWheelResetTimeoutRef.current);
      }

      horizontalWheelResetTimeoutRef.current = window.setTimeout(() => {
        horizontalWheelDeltaRef.current = 0;
        horizontalWheelResetTimeoutRef.current = null;
      }, HORIZONTAL_WHEEL_RESET_MS);
    };

    const onPointerEnter = () => {
      isHoveringRef.current = true;
    };

    const onPointerLeave = () => {
      isHoveringRef.current = false;
      resetHorizontalWheelDelta();
    };

    const onWheel: EventListener = (event) => {
      if (!(event instanceof WheelEvent)) return;
      if (!isHoveringRef.current || manualScrollCooldownRef.current) return;

      const delta = normalizeWheelDelta(event);
      if (delta === 0) return;

      horizontalWheelDeltaRef.current += delta;
      scheduleHorizontalWheelReset();

      if (Math.abs(horizontalWheelDeltaRef.current) < HORIZONTAL_WHEEL_THRESHOLD_PX) return;

      event.preventDefault();
      event.stopPropagation();

      if (horizontalWheelDeltaRef.current > 0) goNext();
      else goPrev();

      resetHorizontalWheelDelta();
    };

    node.addEventListener("pointerenter", onPointerEnter);
    node.addEventListener("pointerleave", onPointerLeave);
    node.addEventListener("wheel", onWheel, { passive: false });

    let slickList: Element | null = null;
    const attachSlickListListener = () => {
      if (slickList) {
        slickList.removeEventListener("wheel", onWheel);
      }
      slickList = node.querySelector(".slick-list");
      slickList?.addEventListener("wheel", onWheel, { passive: false });
    };

    attachSlickListListener();
    const slickAttachFrame = window.requestAnimationFrame(attachSlickListListener);

    return () => {
      window.cancelAnimationFrame(slickAttachFrame);
      node.removeEventListener("pointerenter", onPointerEnter);
      node.removeEventListener("pointerleave", onPointerLeave);
      node.removeEventListener("wheel", onWheel);
      slickList?.removeEventListener("wheel", onWheel);
      resetHorizontalWheelDelta();
      isHoveringRef.current = false;
    };
  }, [canSlide, goNext, goPrev, isMobile, slidesKey]);

  useEffect(
    () => () => {
      clearRecenterUnlockFrame();
      setRecentering(false);
      if (horizontalWheelResetTimeoutRef.current !== null) {
        window.clearTimeout(horizontalWheelResetTimeoutRef.current);
      }
    },
    [clearRecenterUnlockFrame, setRecentering],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!canSlide) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [canSlide, goNext, goPrev],
  );

  const sliderSettings = useMemo<Settings>(
    () => ({
      className: cn(
        "center featured-gallery-slider-root w-full min-h-[var(--fg-stage-h)]",
        "[&_.slick-slide]:!w-auto",
        "[&_.slick-slide>div]:h-[var(--fg-stage-h)]",
        "[&_.slick-list]:min-h-[var(--fg-stage-h)] [&_.slick-list]:overflow-hidden",
        "[&_.slick-track]:flex [&_.slick-track]:min-h-[var(--fg-stage-h)] [&_.slick-track]:items-center",
      ),
      centerMode: canSlide,
      variableWidth: canSlide,
      infinite: useNativeInfinite,
      centerPadding: canSlide ? galleryCenterPadding : "0px",
      slidesToShow: activeSlidesToShow,
      slidesToScroll: 1,
      speed: SLIDER_SPEED_MS,
      initialSlide,
      arrows: false,
      dots: false,
      swipe: canSlide,
      draggable: canSlide,
      waitForAnimate: true,
      autoplay: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      beforeChange: handleBeforeChange,
      afterChange: handleAfterChange,
    }),
    [
      activeSlidesToShow,
      canSlide,
      galleryCenterPadding,
      handleAfterChange,
      handleBeforeChange,
      initialSlide,
      useSeamlessLoop,
    ],
  );

  if (slides.length === 0) {
    return null;
  }

  if (isMobile === null) {
    return (
      <div
        className="relative w-full"
        style={{ height: getGalleryScaleMetrics(false).stageHeight }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={canSlide ? 0 : undefined}
      onKeyDown={onKeyDown}
      data-slide-count={String(slides.length)}
      style={galleryScaleStyle}
      className="featured-gallery-slider relative w-full overscroll-x-contain touch-pan-y outline-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured story gallery"
    >
      {canSlide && !isMobile ? (
        <div className="pointer-events-none absolute inset-y-0 -left-16 -right-16 z-20 flex items-center justify-between">
          <CarouselNavButton direction="prev" onClick={goPrev} />
          <CarouselNavButton direction="next" onClick={goNext} />
        </div>
      ) : null}

      <div style={{ height: galleryStageHeight }}>
        <Slider
          key={`${slidesKey}-${isMobile ? "mobile" : "desktop"}-${activeSlidesToShow}-${galleryCenterPadding}`}
          ref={sliderRef}
          {...sliderSettings}
        >
          {renderSlides.map((slide, index) => (
            <div key={slide.renderKey ?? `${slide.src}-${index}`} className="featured-gallery-slide-shell">
              <FeaturedGallerySlide slide={slide} onClick={canSlide ? goNext : undefined} />
            </div>
          ))}
        </Slider>
      </div>

      {/* {canSlide && isMobile ? (
        <div className="mt-4 flex items-center justify-center gap-6">
          <CarouselNavButton direction="prev" onClick={goPrev} compact />
          <CarouselNavButton direction="next" onClick={goNext} compact />
        </div>
      ) : null} */}
    </div>
  );
};

type FeaturedStoriesLayoutProps = {
  slides: readonly FeaturedSlide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onPrimaryCtaClick: () => void;
  title: string;
  primaryCtaHref?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  onSecondaryCtaClick: () => void;
  backgroundImage?: { desktopUrl: string; mobileUrl: string; alt: string } | null;
  showHero: boolean;
};

type FeaturedStoriesPrimaryCtaProps = {
  label: string;
  onClick: () => void;
};

const FeaturedStoriesPrimaryCta = ({ label, onClick }: FeaturedStoriesPrimaryCtaProps) => (
  <div className="mx-auto flex w-full justify-center md:w-[284px]">
    <DetailDarkButton type="button" onClick={onClick} className="w-full uppercase">
      {label}
    </DetailDarkButton>
  </div>
);

const FeaturedStoriesLayout = ({
  slides,
  currentIndex,
  onIndexChange,
  onPrimaryCtaClick,
  title,
  primaryCtaLabel,
  secondaryCtaLabel,
  onSecondaryCtaClick,
  backgroundImage,
  showHero,
}: FeaturedStoriesLayoutProps) => {
  return (
    <section aria-labelledby="bespoke-featured-stories-title" className="overflow-hidden bg-gray200 w-full max-w-full">
      {showHero ? (
        <div className="relative w-full">
          <FeaturedGalleryBackground
            slides={slides}
            activeIndex={currentIndex}
            backgroundImage={backgroundImage}
          />

          {title ? (
            <h2
              id="bespoke-featured-stories-title"
              className="md:mb-10 mb-6 relative z-10 mx-auto w-full px-4 pt-[150px] text-center font-larken text-32 font-light leading-110 text-white md:pt-[177px] lg:text-5xl md:text-4xl"
            >
              {title}
            </h2>
          ) : null}

          {slides.length > 0 ? (
            <div className="relative z-10 -bottom-4">
              <FeaturedGallerySlider
                slides={slides}
                currentIndex={currentIndex}
                onIndexChange={onIndexChange}
              />
            </div>
          ) : null}

          <div className="relative z-10 flex flex-col items-center gap-8 px-4 pb-10 pt-8 md:gap-8 md:pb-10 md:pt-10">
            {primaryCtaLabel ? (
              <FeaturedStoriesPrimaryCta label={primaryCtaLabel} onClick={onPrimaryCtaClick} />
            ) : null}
            {secondaryCtaLabel ? (
              <DetailTextLink
                onClick={onSecondaryCtaClick}
                className="uppercase"
              >
                {secondaryCtaLabel}
              </DetailTextLink>
            ) : null}
          </div>
        </div>
      ) : title ? (
        <>
          <div className="px-4 pt-16 pb-6 text-center">
            <h2
              id="bespoke-featured-stories-title"
              className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
            >
              {title}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-8 px-4 pb-10">
            {primaryCtaLabel ? (
              <FeaturedStoriesPrimaryCta label={primaryCtaLabel} onClick={onPrimaryCtaClick} />
            ) : null}
            {secondaryCtaLabel ? (
              <DetailTextLink
                onClick={onSecondaryCtaClick}
                className="uppercase"
              >
                {secondaryCtaLabel}
              </DetailTextLink>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
};

const BESPOKE_PAGE_PATH = "/bespoke-jewellery";

const BespokeFeaturedStoriesSection = ({
  featuredStories,
  pastCreations,
}: {
  featuredStories: NormalizedBespokeFeaturedStories | null;
  pastCreations: NormalizedBespokePastCreations | null;
}) => {
  const pathname = usePathname() ?? BESPOKE_PAGE_PATH;
  const slides = featuredStories?.slides ?? [];
  const defaultSlideIndex = featuredStories?.defaultSlideIndex ?? 0;
  const slidesIdentity = useMemo(
    () => slides.map((slide) => slide.documentId ?? slide.src).join("|"),
    [slides],
  );
  const [currentIndex, setCurrentIndex] = useState(defaultSlideIndex);
  const [modalOpen, setModalOpen] = useState(false);
  const [pastCreationsOpen, setPastCreationsOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{ slideIndex: number; imageIndex: number } | null>(
    null,
  );
  const [modalSlideOverride, setModalSlideOverride] = useState<FeaturedStoryModalSlide | null>(null);
  const modalHistoryDepthRef = useRef(0);
  const skipHistoryPopRef = useRef(false);
  const modalOpenRef = useRef(modalOpen);
  const pastCreationsOpenRef = useRef(pastCreationsOpen);

  modalOpenRef.current = modalOpen;
  pastCreationsOpenRef.current = pastCreationsOpen;

  useEffect(() => {
    setCurrentIndex(defaultSlideIndex);
  }, [defaultSlideIndex, slidesIdentity]);

  const isOverlayOpen = modalOpen || pastCreationsOpen;
  useBodyScrollLock(isOverlayOpen);

  const pushModalHistory = useCallback(() => {
    window.history.pushState({ sdBespokeFeaturedModal: true }, "");
    modalHistoryDepthRef.current += 1;
  }, []);

  const popModalHistory = useCallback(() => {
    if (modalHistoryDepthRef.current <= 0) return;

    skipHistoryPopRef.current = true;
    modalHistoryDepthRef.current -= 1;
    window.history.back();
  }, []);

  const resetModalState = useCallback(() => {
    modalHistoryDepthRef.current = 0;
    setModalOpen(false);
    setPastCreationsOpen(false);
    setModalContext(null);
    setModalSlideOverride(null);
    unlockBodyScroll();
  }, []);

  useEffect(() => {
    if (pathname !== BESPOKE_PAGE_PATH) {
      resetModalState();
    }
  }, [pathname, resetModalState]);

  useEffect(() => {
    const onPageShow = () => {
      if (!modalOpenRef.current && !pastCreationsOpenRef.current) {
        unlockBodyScroll();
        return;
      }

      resetModalState();
    };

    const onPopState = () => {
      if (skipHistoryPopRef.current) {
        skipHistoryPopRef.current = false;
        return;
      }

      if (modalHistoryDepthRef.current > 0) {
        modalHistoryDepthRef.current -= 1;
      }

      if (modalOpenRef.current) {
        setModalOpen(false);
        setModalContext(null);
        setModalSlideOverride(null);
        if (!pastCreationsOpenRef.current) {
          unlockBodyScroll();
        }
        return;
      }

      if (pastCreationsOpenRef.current) {
        setPastCreationsOpen(false);
        unlockBodyScroll();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", onPopState);
    };
  }, [resetModalState]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setModalContext(null);
    setModalSlideOverride(null);
    if (!pastCreationsOpenRef.current) {
      unlockBodyScroll();
    }
  }, []);

  const handlePastCreationsClose = useCallback(() => {
    setPastCreationsOpen(false);
    if (!modalOpenRef.current) {
      unlockBodyScroll();
    }
  }, []);

  const closeStoryModal = useCallback(() => {
    if (modalOpen) {
      popModalHistory();
    }
    handleModalClose();
  }, [handleModalClose, modalOpen, popModalHistory]);

  const closePastCreationsModal = useCallback(() => {
    if (pastCreationsOpen) {
      popModalHistory();
    }
    handlePastCreationsClose();
  }, [handlePastCreationsClose, pastCreationsOpen, popModalHistory]);

  const openStoryModal = useCallback(() => {
    pushModalHistory();
    setModalOpen(true);
  }, [pushModalHistory]);

  const handleCenterOpen = useCallback(() => {
    if (slides.length === 0) return;
    setModalSlideOverride(null);
    setModalContext({ slideIndex: currentIndex, imageIndex: 0 });
    openStoryModal();
  }, [currentIndex, openStoryModal, slides.length]);

  const handlePastCreationsOpen = useCallback(() => {
    if (!pastCreations) return;
    pushModalHistory();
    setPastCreationsOpen(true);
  }, [pastCreations, pushModalHistory]);

  const handlePastCreationImageClick = useCallback(
    (image: BespokePastCreationImage) => {
      if (slides.length === 0) {
        if (!pastCreations) return;

        setModalSlideOverride({
          documentId: image.documentId,
          src: image.src,
          alt: image.alt,
          modalTitle: pastCreations.title,
          modalDescription: "",
          modalImages: [{ src: image.src, alt: image.alt }],
        });
        setModalContext({ slideIndex: 0, imageIndex: 0 });
        openStoryModal();
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

      openStoryModal();
    },
    [defaultSlideIndex, openStoryModal, pastCreations, slides],
  );

  const modalSlide: FeaturedStoryModalSlide | null =
    modalSlideOverride ??
    (modalContext !== null ? slides[modalContext.slideIndex] ?? slides[defaultSlideIndex] : null);

  return (
    <>
      <FeaturedStoriesLayout
        slides={slides}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onPrimaryCtaClick={handleCenterOpen}
        title={featuredStories?.title ?? ""}
        primaryCtaHref={featuredStories?.primaryCtaHref}
        primaryCtaLabel={featuredStories?.primaryCtaLabel ?? ""}
        secondaryCtaLabel={
          pastCreations && featuredStories?.secondaryCtaLabel
            ? featuredStories.secondaryCtaLabel
            : ""
        }
        onSecondaryCtaClick={handlePastCreationsOpen}
        backgroundImage={featuredStories?.backgroundImage ?? null}
        showHero={slides.length > 0 || Boolean(featuredStories?.backgroundImage)}
      />
      <BespokeFeaturedStoryModal
        open={modalOpen}
        slide={modalSlide}
        initialImageIndex={modalContext?.imageIndex ?? 0}
        elevated={pastCreationsOpen}
        modalCtaLabel={featuredStories?.modalCtaLabel}
        onClose={closeStoryModal}
      />
      {pastCreations &&
        <BespokePastCreationsModal
          open={pastCreationsOpen}
          images={pastCreations.images}
          onClose={closePastCreationsModal}
          onImageClick={handlePastCreationImageClick}
          suppressEscape={modalOpen}
        />
      }
    </>
  );
};

export default BespokeFeaturedStoriesSection;
