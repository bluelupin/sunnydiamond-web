"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { useSince1997HorizontalScroll } from "@/features/about/hooks/useSince1997HorizontalScroll";
import { bespokePageContent, bespokeStoryFigmaSpec } from "@/features/bespoke/data/content";
import BespokeShareVisionPanel from "@/features/bespoke/components/BespokeShareVisionPanel";

type StoryStep = (typeof bespokePageContent.story.steps)[number];

type BespokeStoryStepPanelProps = {
  step: StoryStep;
  layout: "desktop" | "mobile";
  videoSrc: string;
  isLastSlide?: boolean;
  isFirstSlide?: boolean;
};

const BespokeStoryStepMedia = ({
  step,
  videoSrc,
  isDesktop,
  isLastSlide,
}: {
  step: StoryStep;
  videoSrc: string;
  isDesktop: boolean;
  isLastSlide?: boolean;
}) => {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useImageFallback, setUseImageFallback] = useState(false);

  useEffect(() => {
    if (useImageFallback) return;

    const figure = figureRef.current;
    const video = videoRef.current;
    if (!figure || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const playPromise = video.play();
          if (playPromise) {
            playPromise.catch(() => {
              setUseImageFallback(true);
            });
          }
          return;
        }

        video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(figure);
    return () => observer.disconnect();
  }, [useImageFallback]);

  return (
    <figure
      ref={figureRef}
      className={cn(
        "relative overflow-hidden bg-gray200 md:h-[496px] h-[400px] md:w-[658px] w-full md:aspect-[658/400] aspect-[658/400]",
      )}
      {...(isLastSlide ? { "data-since1997-last-image": true } : {})}
    >
      {useImageFallback ? (
        <Image
          src={step.image.src}
          alt={step.image.alt}
          fill
          sizes={isDesktop ? "658px" : "(max-width: 767px) 100vw, 658px"}
          className="object-cover object-center"
          priority={isDesktop}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={step.image.src}
          aria-label={step.image.alt}
          onError={() => setUseImageFallback(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </figure>
  );
};

const BespokeStoryStepPanel = ({
  step,
  layout,
  videoSrc,
  isLastSlide,
  isFirstSlide,
}: BespokeStoryStepPanelProps) => {
  const isDesktop = layout === "desktop";

  return (
    <article
      className={cn(
        "flex shrink-0",
        isDesktop ? "items-center gap-6 w-[970px]" : "w-full flex-col bg-gray300", isLastSlide && "mr-10",
      )}
      style={!isDesktop ? { gap: `0px` } : isFirstSlide ? { marginLeft: `350px` } : undefined}
      {...(isFirstSlide ? { "data-since1997-first-step": true } : {})}>
      <BespokeStoryStepMedia
        step={step}
        videoSrc={videoSrc}
        isDesktop={isDesktop}
        isLastSlide={isLastSlide}
      />
      <div className={cn("flex flex-col md:gap-3 gap-2 md:py-0 py-6 md:px-0 px-4", isDesktop && "max-w-[296px]", isLastSlide && "mr-20",)}>
        <span className="font-larken md:text-5xl text-32 font-light leading-110 text-neutral300">{step.number}</span>
        <h3 className="font-larken md:text-32 text-2xl font-light leading-110 text-darkblack">{step.title}</h3>
        <p className={cn("font-gill font-light leading-110 text-darkblack md:text-xl text-base")}>
          {step.description}
        </p>
      </div>
    </article>
  );
};

const BespokeStorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { story } = bespokePageContent;
  const { mobile: mobileSpec } = bespokeStoryFigmaSpec;
  const hasHorizontalGallery = story.steps.length > 1;
  const [shareVisionOpen, setShareVisionOpen] = useState(false);

  const handleShareVisionOpen = useCallback(() => {
    setShareVisionOpen(true);
  }, []);

  const handleShareVisionClose = useCallback(() => {
    setShareVisionOpen(false);
  }, []);

  useSince1997HorizontalScroll(sectionRef, hasHorizontalGallery, {
    firstStepOffset: bespokeStoryFigmaSpec.firstStepOffset,
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="bespoke-story-title"
      className="relative bg-white md:py-100 py-16 mx-auto w-full pl-4 md:pl-8 lg:pl-10 2xl:max-w-1920 2xl:pl-[60px] md:pr-0 pr-4"
    >
      <div className="md:mb-12 mb-6 mx-auto max-w-[720px] flex w-full flex-col gap-4">
        <Reveal
          as="h2"
          id="bespoke-story-title"
          direction="up"
          className="md:text-center text-left font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
        >
          {story.title}
        </Reveal>
        <Reveal
          as="p"
          direction="up"
          className="md:text-center text-left font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
        >
          {story.subtitle}
        </Reveal>
      </div>
      {/* Desktop / tablet — sticky viewport + scroll-driven horizontal slide */}
      <div data-since1997-mode="desktop" className="hidden md:block">
        <div className="sticky top-40 flex flex-col overflow-hidden bg-white">
          <Reveal direction="up" className="flex min-h-0 flex-1 flex-col">
            <div
              data-since1997-viewport
              className="relative left-1/2 min-h-0 w-screen max-w-none -translate-x-1/2 overflow-hidden"
            >
              <div
                data-since1997-track
                className="max-w-[1440px] ml-auto flex h-full items-center gap-10 will-change-transform motion-reduce:transform-none"
              >
                {story.steps.map((step, index) => (
                  <BespokeStoryStepPanel
                    key={step.number}
                    step={step}
                    layout="desktop"
                    videoSrc={story.video.src}
                    isFirstSlide={index === 0}
                    isLastSlide={index === story.steps.length - 1}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        {hasHorizontalGallery ? (
          <div data-since1997-scroll-spacer aria-hidden className="h-[100vh]" />
        ) : null}
      </div>
      {/* Mobile — static vertical stack, no scroll animation (Figma 2083:18264) */}
      <div className="md:hidden flex flex-col gap-4">
        {story.steps.map((step) => (
          <BespokeStoryStepPanel key={step.number} step={step} layout="mobile" videoSrc={story.video.src} />
        ))}
      </div>
      <Reveal direction="up" className="flex justify-center">
        <div className="md:mt-12 mt-4 flex justify-center md:w-[284px] mx-auto w-full">
          <button
            type="button"
            onClick={handleShareVisionOpen}
            className="btn-dark-slide inline-flex items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white w-full h-14 border border-darkblack"
          >
            <span className="relative z-10">{story.ctaLabel}</span>
          </button>
        </div>
      </Reveal>
      <BespokeShareVisionPanel open={shareVisionOpen} onClose={handleShareVisionClose} />
    </section>
  );
};

export default BespokeStorySection;
