"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import { useSince1997HorizontalScroll } from "@/features/about/hooks/useSince1997HorizontalScroll";
import { bespokePageContent, bespokeStoryFigmaSpec } from "@/features/bespoke/data/content";

type StoryStep = (typeof bespokePageContent.story.steps)[number];

type BespokeStoryStepPanelProps = {
  step: StoryStep;
  layout: "desktop" | "mobile";
  isLastSlide?: boolean;
  isFirstSlide?: boolean;
};

const BespokeStoryStepPanel = ({ step, layout, isLastSlide, isFirstSlide }: BespokeStoryStepPanelProps) => {
  const isDesktop = layout === "desktop";
  const { mobile: mobileSpec } = bespokeStoryFigmaSpec;

  return (
    <article
      className={cn(
        "flex shrink-0",
        isDesktop && "items-center gap-4 w-[970px]",
        !isDesktop && "w-full flex-col",
      )}
      style={
        !isDesktop
          ? { gap: `${mobileSpec.stepImageTextGap}px` }
          : isFirstSlide
            ? { marginLeft: `${bespokeStoryFigmaSpec.firstStepOffset}px` }
            : undefined
      }
      {...(isFirstSlide ? { "data-since1997-first-step": true } : {})}
    >
      <figure
        className={cn(
          "relative overflow-hidden bg-gray200",
          isDesktop && "h-[496px] w-[658px]",
          !isDesktop && "aspect-[658/496] w-full",
        )}
        {...(isLastSlide ? { "data-since1997-last-image": true } : {})}
      >
        <Image
          src={step.image.src}
          alt={step.image.alt}
          fill
          sizes={isDesktop ? "658px" : "(max-width: 767px) 100vw, 658px"}
          className="object-cover object-center"
          priority={isDesktop}
        />
      </figure>

      <div
        className={cn("flex flex-col", isDesktop && "max-w-[296px]")}
        style={
          isDesktop
            ? { maxWidth: `${bespokeStoryFigmaSpec.textMaxWidth}px`, gap: "12px" }
            : { gap: `${mobileSpec.stepTextGap}px` }
        }
      >
        <span className="font-larken text-5xl font-light leading-110 text-neutral300">{step.number}</span>
        <h3 className="font-larken text-[32px] font-light leading-110 text-darkblack">{step.title}</h3>
        <p className={cn("font-gill font-light leading-110 text-darkblack", isDesktop ? "text-xl" : "text-base")}>
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

  useSince1997HorizontalScroll(sectionRef, hasHorizontalGallery, {
    firstStepOffset: bespokeStoryFigmaSpec.firstStepOffset,
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="bespoke-story-title"
      className="relative bg-white md:pt-100"
    >
      {/* Desktop / tablet — sticky viewport + scroll-driven horizontal slide */}
      <div data-since1997-mode="desktop" className="hidden md:block">
        <div className="sticky top-0 flex flex-col overflow-hidden bg-white">
          <PageContainer className="shrink-0 pb-24 lg:pb-12">
            <div className="flex w-full flex-col gap-4 text-left md:mx-auto md:text-center">
              <Reveal
                as="h2"
                id="bespoke-story-title"
                direction="up"
                className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
              >
                {story.title}
              </Reveal>
              <Reveal
                as="p"
                direction="up"
                className="mx-auto max-w-[720px] font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
              >
                {story.subtitle}
              </Reveal>
            </div>
          </PageContainer>

          <Reveal direction="up" className="flex min-h-0 flex-1 flex-col pb-100">
            <div
              // data-since1997-viewport
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

        <PageContainer className="pb-100 pt-100">
          <Reveal direction="up" className="flex justify-center">
            <Link
              href={story.ctaHref}
              className="btn-dark-slide inline-flex items-center justify-center border border-darkblack bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white"
              style={{
                width: `${bespokeStoryFigmaSpec.ctaWidth}px`,
                height: `${bespokeStoryFigmaSpec.ctaHeight}px`,
              }}
            >
              <span className="relative z-10">{story.ctaLabel}</span>
            </Link>
          </Reveal>
        </PageContainer>
      </div>

      {/* Mobile — static vertical stack, no scroll animation (Figma 2083:18264) */}
      <div className="md:hidden">
        <PageContainer
          className="py-16"
          style={{ paddingTop: mobileSpec.sectionPaddingY, paddingBottom: mobileSpec.sectionPaddingY }}
        >
          <div
            className="flex flex-col gap-4 mb-6"
          >
            <h2
              id="bespoke-story-title"
              className="font-larken font-light leading-110 text-darkblack text-32"
            >
              {story.title}
            </h2>
            <p
              className="font-gill font-light leading-110 text-neutral500 text-base"
            >
              {story.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {story.steps.map((step) => (
              <BespokeStoryStepPanel key={step.number} step={step} layout="mobile" />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={story.ctaHref}
              className="btn-dark-slide inline-flex items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white"
              style={{
                width: `${bespokeStoryFigmaSpec.ctaWidth}px`,
                height: `${bespokeStoryFigmaSpec.ctaHeight}px`,
              }}
            >
              <span className="relative z-10">{story.ctaLabel}</span>
            </Link>
          </div>
        </PageContainer>
      </div>
    </section>
  );
};

export default BespokeStorySection;
