"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";
import { cn } from "@/shared/utils/cn";
import { useSince1997HorizontalScroll } from "@/features/about/hooks/useSince1997HorizontalScroll";
import { bespokeStoryFigmaSpec } from "@/features/bespoke/data/content";
import BespokeShareVisionPanel from "@/features/bespoke/components/BespokeShareVisionPanel";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import type {
  NormalizedBespokeCustomDesignForm,
  NormalizedBespokeStory,
  NormalizedBespokeStoryStep,
} from "@/services/bespoke/contact-bespoke-page.types";

type StoryStep = NormalizedBespokeStoryStep;

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
}: {
  step: StoryStep;
  videoSrc: string;
  isDesktop: boolean;
}) => {
  const figureRef = useRef<HTMLElement>(null);
  const [useImageFallback, setUseImageFallback] = useState(false);
  const videoRef = useMutedVideoPlayback(!useImageFallback);

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
        "relative shrink-0 overflow-hidden bg-gray200 h-[400px] w-full lg:h-[496px] lg:w-[658px]",
      )}
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
        isDesktop ? "items-center gap-6 w-[970px]" : "w-full flex-col bg-gray300",
        isLastSlide && "mr-10",
      )}
      style={!isDesktop ? { gap: "0px" } : undefined}
      {...(isFirstSlide ? { "data-since1997-first-step": true } : {})}
      {...(isLastSlide ? { "data-since1997-last-image": true } : {})}>
      <BespokeStoryStepMedia
        step={step}
        videoSrc={videoSrc}
        isDesktop={isDesktop}
      />
      <div className={cn("flex flex-col md:gap-3 gap-2 lg:py-0 py-6 lg:px-0 px-4", isDesktop && "max-w-[296px] min-w-[296px]", isLastSlide && "mr-20",)}>
        <span className="font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-neutral300">{step.number}</span>
        <h3 className="font-larken lg:text-32 md:text-3xl text-2xl font-light leading-110 text-darkblack">{step.title}</h3>
        <p className={cn("font-gill font-light leading-110 text-darkblack lg:text-xl md:text-lg text-base")}>
          {step.description}
        </p>
      </div>
    </article>
  );
};

type BespokeStorySectionProps = {
  story: NormalizedBespokeStory;
  customDesignForm: NormalizedBespokeCustomDesignForm | null;
};

const BespokeStorySection = ({ story, customDesignForm }: BespokeStorySectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const hasHorizontalGallery = story.steps.length > 1;
  const [shareVisionOpen, setShareVisionOpen] = useState(false);
  const ctaLabel = story.ctaLabel?.trim() || customDesignForm?.title?.trim() || "";

  const handleShareVisionOpen = useCallback(() => {
    setShareVisionOpen(true);
  }, []);

  const handleShareVisionClose = useCallback(() => {
    setShareVisionOpen(false);
  }, []);

  useSince1997HorizontalScroll(sectionRef, hasHorizontalGallery, {
    firstStepImageWidth: bespokeStoryFigmaSpec.imageWidth,
    trackScrollLeadInRatio: bespokeStoryFigmaSpec.trackScrollLeadInRatio,
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="bespoke-story-title"
      className="relative bg-white lg:py-100 py-16 mx-auto w-full pl-4 lg:pl-8 lg:pl-10 2xl:max-w-1920 2xl:pl-[60px] lg:pr-0 pr-4"
    >
      <div className="lg:mb-12 mb-6 mx-auto max-w-[720px] lg:hidden flex w-full flex-col gap-4">
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
      <div data-since1997-mode="desktop" className="hidden lg:block">
        <div className="sticky lg:top-10 top-24 flex min-h-[calc(100dvh-10rem)] flex-col bg-white pb-8">
          <div className="md:mb-12 mb-6 mx-auto max-w-[720px] hidden md:flex w-full flex-col gap-4">
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
          <Reveal direction="up" className="flex min-h-[496px] flex-1 flex-col">
            <div
              data-since1997-viewport
              className="relative left-1/2 min-h-[496px] w-screen max-w-none -translate-x-1/2 overflow-hidden"
            >
              <div
                data-since1997-track
                className="flex min-h-[496px] items-center gap-10 will-change-transform motion-reduce:transform-none"
              >
                {story.steps.map((step, index) => (
                  <BespokeStoryStepPanel
                    key={step.number}
                    step={step}
                    layout="desktop"
                    videoSrc={story.videoSrc}
                    isFirstSlide={index === 0}
                    isLastSlide={index === story.steps.length - 1}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        {hasHorizontalGallery ? (
          <div data-since1997-scroll-spacer aria-hidden className="h-[85vh]" />
        ) : null}
      </div>
      {/* Mobile — static vertical stack, no scroll animation (Figma 2083:18264) */}
      <div className="lg:hidden flex flex-col lg:gap-12 gap-8">
        {story.steps.map((step) => (
          <BespokeStoryStepPanel key={step.number} step={step} layout="mobile" videoSrc={story.videoSrc} />
        ))}
      </div>
      <Reveal direction="up" className="flex justify-center">
        <div className="lg:mt-12 mt-4 flex justify-center md:w-[284px] mx-auto w-full">
          {ctaLabel && customDesignForm ? (
            <DetailDarkButton
              type="button"
              onClick={handleShareVisionOpen}
              className="w-full uppercase"
            >
              {ctaLabel}
            </DetailDarkButton>
          ) : null}
        </div>
      </Reveal>
      {customDesignForm ? (
        <BespokeShareVisionPanel
          open={shareVisionOpen}
          onClose={handleShareVisionClose}
          form={customDesignForm}
        />
      ) : null}
    </section>
  );
};

export default BespokeStorySection;
