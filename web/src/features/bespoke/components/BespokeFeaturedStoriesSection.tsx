"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
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

const FeaturedGallerySlide = ({ slide }: FeaturedGallerySlideProps) => (
  <div className="featured-gallery-slide relative h-[300px] overflow-hidden bg-white">
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
  const fallbackBgSrc = backgroundImage?.desktopUrl || backgroundImage?.mobileUrl || null;
  const srAlt = slides[safeIndex]?.alt || backgroundImage?.alt || "";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] md:h-[559px]">
      {slides.length > 0 ? (
        slides.map((slide, index) => (
          <Image
            key={`${slide.src}-${index}`}
            src={slide.src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority={index === safeIndex}
            className={cn(
              "object-cover object-top transition-opacity duration-500",
              index === safeIndex ? "opacity-100" : "opacity-0",
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

const FeaturedGallerySlider = ({
  slides,
  currentIndex,
  onIndexChange,
}: FeaturedGallerySliderProps) => {
  const isMobile = useIsMobileViewport(MOBILE_BREAKPOINT_PX);
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

  const handleAfterChange = useCallback(
    (index: number) => {
      onIndexChange(mapToSourceIndex(index));
    },
    [mapToSourceIndex, onIndexChange],
  );

  const initialSlide = useMemo(
    () => normalizeIndex(currentIndex, renderSlides.length),
    [slidesKey, renderSlides.length],
  );

  const sliderSettings = useMemo<Settings>(
    () => ({
      className: cn(
        "center w-full",
        /* Figma galleryGap: 16px — 8px padding each side of slide wrapper */
        "[&_.slick-slide>div]:px-2",
        "[&_.slick-track]:flex [&_.slick-track]:items-center",
        "[&_.slick-slide.slick-center_.featured-gallery-slide]:h-[360px]",
        "[&_.slick-slide:not(.slick-center)_.featured-gallery-slide]:h-[300px]",
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
      afterChange: handleAfterChange,
    }),
    [activeSlidesToShow, canSlide, handleAfterChange, initialSlide, showInfinite],
  );

  if (slides.length === 0) {
    return null;
  }

  if (isMobile === null) {
    return <div className="relative h-[360px] w-full" aria-hidden />;
  }

  return (
    <div
      className="relative w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured story gallery"
    >
      <Slider key={`${slidesKey}-${isMobile ? "mobile" : "desktop"}`} {...sliderSettings}>
        {renderSlides.map((slide, index) => (
          <div key={slide.renderKey ?? `${slide.src}-${index}`}>
            <FeaturedGallerySlide slide={slide} />
          </div>
        ))}
      </Slider>
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
  const [currentIndex, setCurrentIndex] = useState(defaultSlideIndex);
  const [modalOpen, setModalOpen] = useState(false);
  const [pastCreationsOpen, setPastCreationsOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{ slideIndex: number; imageIndex: number } | null>(
    null,
  );
  const [modalSlideOverride, setModalSlideOverride] = useState<FeaturedStoryModalSlide | null>(null);

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
