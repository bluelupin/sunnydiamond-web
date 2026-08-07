"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
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

const normalizeIndex = (index: number, total: number) => {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
};

type RenderFeaturedSlide = FeaturedSlide & { renderKey?: string };

/** Duplicate 3-slide sets so Slick infinite center mode can loop. */
const buildRenderSlides = (slides: readonly FeaturedSlide[]) => {
  if (slides.length !== 3) {
    return { renderSlides: slides as RenderFeaturedSlide[], sourceCount: slides.length };
  }

  return {
    sourceCount: 3,
    renderSlides: [
      ...slides.map((slide, index) => ({ ...slide, renderKey: `${slide.src}-a-${index}` })),
      ...slides.map((slide, index) => ({ ...slide, renderKey: `${slide.src}-b-${index}` })),
    ] satisfies RenderFeaturedSlide[],
  };
};

type FeaturedGallerySlideProps = {
  slide: FeaturedSlide;
};

const featuredGallerySlideTransitionClassName =
  "transition-[height] duration-500 ease-in-out motion-reduce:transition-none";

const FeaturedGallerySlide = ({ slide }: FeaturedGallerySlideProps) => (
  <div
    className={cn(
      "featured-gallery-slide relative h-[300px] overflow-hidden bg-white",
      featuredGallerySlideTransitionClassName,
    )}
  >
    <Image
      src={slide.src}
      alt={slide.alt}
      fill
      sizes="(max-width: 768px) 80vw, 33vw"
      loading="lazy"
      className="h-full w-full object-cover object-center"
    />
  </div>
);

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
  const srAlt = activeSlide?.alt || backgroundImage?.alt || "";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] md:h-[559px]">
      <div className="relative size-full">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <Image
              key={slide.documentId ?? `${slide.src}-${index}`}
              src={slide.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority={index === safeIndex}
              className={cn(
                "object-cover object-top transition-opacity duration-500 ease-in-out",
                index === safeIndex ? "z-[1] opacity-100" : "z-0 opacity-0",
              )}
            />
          ))
        ) : fallbackBgSrc ? (
          <Image
            src={fallbackBgSrc}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : null}
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: spec.overlayHorizontal,
          backgroundImage: spec.overlayVertical,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-b from-transparent to-black/80 backdrop-blur-[5px]"
      />
      {srAlt ? <span className="sr-only">{srAlt}</span> : null}
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
const AUTOPLAY_RESUME_MS = 2000;
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
  const autoplayResumeTimeoutRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const horizontalWheelDeltaRef = useRef(0);
  const horizontalWheelResetTimeoutRef = useRef<number | null>(null);
  const { renderSlides, sourceCount } = useMemo(() => buildRenderSlides(slides), [slides]);
  const slidesKey = useMemo(
    () => renderSlides.map((slide) => slide.renderKey ?? slide.src).join("|"),
    [renderSlides],
  );

  const canSlide = slides.length > 1;
  const showInfinite = canSlide && (renderSlides.length > 3 || slides.length !== 3);
  const desktopSlidesToShow = Math.min(3, renderSlides.length);
  const mobileSlidesToShow = Math.min(1, renderSlides.length);
  const activeSlidesToShow = isMobile ? mobileSlidesToShow : desktopSlidesToShow;

  const mapToSourceIndex = useCallback(
    (index: number) => normalizeIndex(index, sourceCount),
    [sourceCount],
  );

  const handleBeforeChange = useCallback(
    (_current: number, next: number) => {
      onIndexChange(mapToSourceIndex(next));
    },
    [mapToSourceIndex, onIndexChange],
  );

  const handleAfterChange = useCallback(
    (index: number) => {
      onIndexChange(mapToSourceIndex(index));
    },
    [mapToSourceIndex, onIndexChange],
  );

  const initialSlide = useMemo(
    () => normalizeIndex(currentIndex, renderSlides.length),
    [currentIndex, slidesKey, renderSlides.length],
  );

  const resumeAutoplay = useCallback(() => {
    if (autoplayResumeTimeoutRef.current !== null) {
      window.clearTimeout(autoplayResumeTimeoutRef.current);
    }

    autoplayResumeTimeoutRef.current = window.setTimeout(() => {
      sliderRef.current?.slickPlay();
      autoplayResumeTimeoutRef.current = null;
    }, AUTOPLAY_RESUME_MS);
  }, []);

  const goPrev = useCallback(() => {
    if (!canSlide || manualScrollCooldownRef.current) return;

    manualScrollCooldownRef.current = true;
    sliderRef.current?.slickPause();
    sliderRef.current?.slickPrev();
    resumeAutoplay();
    window.setTimeout(() => {
      manualScrollCooldownRef.current = false;
    }, MANUAL_SCROLL_COOLDOWN_MS);
  }, [canSlide, resumeAutoplay]);

  const goNext = useCallback(() => {
    if (!canSlide || manualScrollCooldownRef.current) return;

    manualScrollCooldownRef.current = true;
    sliderRef.current?.slickPause();
    sliderRef.current?.slickNext();
    resumeAutoplay();
    window.setTimeout(() => {
      manualScrollCooldownRef.current = false;
    }, MANUAL_SCROLL_COOLDOWN_MS);
  }, [canSlide, resumeAutoplay]);

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
      if (autoplayResumeTimeoutRef.current !== null) {
        window.clearTimeout(autoplayResumeTimeoutRef.current);
      }
      if (horizontalWheelResetTimeoutRef.current !== null) {
        window.clearTimeout(horizontalWheelResetTimeoutRef.current);
      }
    },
    [],
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
        "center w-full min-h-[360px]",
        /* Figma galleryGap: 16px — 8px padding each side of slide wrapper */
        "[&_.slick-slide>div]:px-2",
        "[&_.slick-list]:min-h-[360px] [&_.slick-list]:transition-[height,min-height] [&_.slick-list]:duration-500 [&_.slick-list]:ease-in-out",
        "[&_.slick-track]:flex [&_.slick-track]:min-h-[360px] [&_.slick-track]:items-center",
        "[&_.slick-slide.slick-center_.featured-gallery-slide]:h-[360px]",
        "[&_.slick-slide:not(.slick-center)_.featured-gallery-slide]:h-[300px]",
        "[&_.featured-gallery-slide]:transition-[height] [&_.featured-gallery-slide]:duration-500 [&_.featured-gallery-slide]:ease-in-out",
      ),
      centerMode: canSlide,
      infinite: showInfinite,
      centerPadding: "20px",
      slidesToShow: activeSlidesToShow,
      slidesToScroll: 1,
      speed: SLIDER_SPEED_MS,
      initialSlide,
      arrows: false,
      dots: false,
      swipe: canSlide,
      draggable: canSlide,
      waitForAnimate: true,
      autoplay: canSlide,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      pauseOnFocus: true,
      beforeChange: handleBeforeChange,
      afterChange: handleAfterChange,
    }),
    [activeSlidesToShow, canSlide, handleAfterChange, handleBeforeChange, initialSlide, showInfinite],
  );

  if (slides.length === 0) {
    return null;
  }

  if (isMobile === null) {
    return <div className="relative h-[360px] w-full" aria-hidden />;
  }

  return (
    <div
      ref={containerRef}
      tabIndex={canSlide ? 0 : undefined}
      onKeyDown={onKeyDown}
      className="relative h-[360px] w-full overscroll-x-contain touch-pan-y outline-none transition-[min-height] duration-500 ease-in-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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

      <Slider
        key={`${slidesKey}-${isMobile ? "mobile" : "desktop"}`}
        ref={sliderRef}
        {...sliderSettings}
      >
        {renderSlides.map((slide, index) => (
          <div key={slide.renderKey ?? `${slide.src}-${index}`}>
            <FeaturedGallerySlide slide={slide} />
          </div>
        ))}
      </Slider>

      {canSlide && isMobile ? (
        <div className="mt-4 flex items-center justify-center gap-6">
          <CarouselNavButton direction="prev" onClick={goPrev} compact />
          <CarouselNavButton direction="next" onClick={goNext} compact />
        </div>
      ) : null}
    </div>
  );
};

type FeaturedStoriesLayoutProps = {
  slides: readonly FeaturedSlide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onPrimaryCtaClick: () => void;
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
  currentIndex,
  onIndexChange,
  onPrimaryCtaClick,
  title,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaLabel,
  onSecondaryCtaClick,
  backgroundImage,
  showHero,
}: FeaturedStoriesLayoutProps) => {
  const activePrimaryCtaHref = slides[currentIndex]?.href ?? primaryCtaHref;

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
              <Link
                href={activePrimaryCtaHref}
                onClick={(event) => {
                  event.preventDefault();
                  onPrimaryCtaClick();
                }}
                className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
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
              <Link
                href={activePrimaryCtaHref}
                onClick={(event) => {
                  event.preventDefault();
                  onPrimaryCtaClick();
                }}
                className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
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
        </>
      ) : null}
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

  useEffect(() => {
    setCurrentIndex(defaultSlideIndex);
  }, [defaultSlideIndex, slidesIdentity]);

  const handleCenterOpen = useCallback(() => {
    if (slides.length === 0) return;
    setModalSlideOverride(null);
    setModalContext({ slideIndex: currentIndex, imageIndex: 0 });
    setModalOpen(true);
  }, [currentIndex, slides.length]);

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

  return (
    <>
      <FeaturedStoriesLayout
        slides={slides}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onPrimaryCtaClick={handleCenterOpen}
        title={featuredStories?.title ?? ""}
        primaryCtaHref={featuredStories?.primaryCtaHref ?? "/featured-stories"}
        primaryCtaLabel={featuredStories?.primaryCtaLabel ?? ""}
        secondaryCtaLabel={
          pastCreations && pastCreations.images.length > 0
            ? featuredStories?.secondaryCtaLabel || bespokeUiDefaults.secondaryCtaLabel
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
        modalCtaLabel={featuredStories?.modalCtaLabel ?? bespokeUiDefaults.modalCtaLabel}
        modalCtaHref={featuredStories?.modalCtaHref ?? bespokeUiDefaults.modalCtaHref}
        onClose={handleModalClose}
      />
      {pastCreations &&
        <BespokePastCreationsModal
          open={pastCreationsOpen}
          images={pastCreations.images}
          onClose={handlePastCreationsClose}
          onImageClick={handlePastCreationImageClick}
          suppressEscape={modalOpen}
        />
      }
    </>
  );
};

export default BespokeFeaturedStoriesSection;
