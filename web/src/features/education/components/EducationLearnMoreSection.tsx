"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import {
  educationLearnMoreSpec,
  educationLearnTabs,
  educationPageImages,
  educationSectionTitleSpacingClassName,
} from "../data/content";

type CarouselSlot = keyof typeof educationLearnMoreSpec.carousel.slots;

const slotSpecs = educationLearnMoreSpec.carousel.slots;
const mobileCarousel = educationLearnMoreSpec.carousel.mobile;

const LearnCarouselImage = ({
  src,
  alt,
  slot,
  sizes,
}: {
  src: string;
  alt: string;
  slot: CarouselSlot;
  sizes: string;
}) => {
  const spec = slotSpecs[slot];

  const image = (
    <div
      className="relative overflow-hidden mix-blend-darken"
      style={{ width: spec.width, height: spec.height }}
    >
      <Image
        src={src}
        alt={alt}
        width={spec.width}
        height={spec.height}
        className="absolute max-w-none object-cover"
        sizes={sizes}
        style={{
          height: spec.cropHeight,
          width: spec.cropWidth,
          left: spec.cropLeft,
          top: spec.cropTop,
        }}
      />
    </div>
  );

  if (spec.flip) {
    return <div className="-scale-y-100 rotate-180">{image}</div>;
  }

  return image;
};

const LearnNavArrow = ({
  direction,
  onClick,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    onClick={onClick}
    className={className}
  >
    <Image
      src={
        direction === "left"
          ? educationPageImages.learnArrowLeftMobile
          : educationPageImages.learnArrowRightMobile
      }
      alt=""
      width={19}
      height={18}
      aria-hidden
      className="h-6 w-auto md:hidden"
    />
    <Image
      src={
        direction === "left"
          ? educationPageImages.learnArrowLeft
          : educationPageImages.learnArrowRight
      }
      alt=""
      width={19}
      height={18}
      aria-hidden
      className="hidden h-6 w-auto md:block"
    />
  </button>
);

const EducationLearnMoreSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);

  const activeTab = educationLearnTabs[activeTabIndex];
  const slides = activeTab.slides;

  const goToPrevSlide = () => {
    setActiveSlideIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goToNextSlide = () => {
    setActiveSlideIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSlideIndex(1);
  };

  const prevSlide = slides[(activeSlideIndex + slides.length - 1) % slides.length];
  const currentSlide = slides[activeSlideIndex];
  const nextSlide = slides[(activeSlideIndex + 1) % slides.length];

  return (
    <section
      aria-labelledby="education-learn-more-title"
      className={cn(
        "bg-white px-4 py-16 max-md:h-[681px] md:px-8 lg:px-10 lg:py-25",
      )}
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-6 lg:gap-16">
        <div className="flex w-full flex-col items-center">
          <ScrollReveal
            as="h2"
            delayMs={0}
            className={`w-full ${educationSectionTitleSpacingClassName}`}
          >
            <span
              id="education-learn-more-title"
              className="block text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
            >
              Learn more about Diamonds
            </span>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="w-full lg:max-w-[1200px]">
            <div className="w-full overflow-x-auto border-y-[0.4px] border-black/30 md:overflow-visible">
              <div
                className="flex h-[75px] min-w-max items-center max-md:gap-40 max-md:py-6 md:h-auto md:w-full md:min-w-0 md:gap-0 md:py-6 lg:gap-0 lg:py-6"
                role="tablist"
                aria-label="Learn more topics"
              >
                {educationLearnTabs.map((tab, index) => {
                  const isActive = index === activeTabIndex;

                  return (
                    <div
                      key={tab.id}
                      className="flex shrink-0 flex-col items-center lg:flex-1"
                      role="presentation"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabChange(index)}
                        className={cn(
                          "flex items-center justify-center whitespace-nowrap py-2 font-gill font-normal leading-110 max-md:text-base md:w-full md:py-0 md:text-center md:text-base lg:text-xl",
                          isActive
                            ? "border-b border-linkGold text-linkGold"
                            : "text-darkblack hover:text-linkGold",
                        )}
                      >
                        {tab.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex w-full flex-col items-center gap-[49px] lg:gap-16">
          <ScrollReveal delayMs={180}>
            <div className="max-w-[700px] text-center font-gill text-base font-light leading-110 text-darkblack lg:text-xl lg:text-neutral500">
              <p className="md:hidden">{activeTab.description.join(" ")}</p>
              <div className="hidden md:block">
                {activeTab.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={260} className="flex w-full flex-col items-center">
            <div className="relative flex w-full items-start justify-center lg:gap-[250px]">
              <div className="hidden shrink-0 md:block">
                <LearnCarouselImage
                  src={prevSlide.src}
                  alt=""
                  slot="left"
                  sizes={`${slotSpecs.left.width}px`}
                />
              </div>

              <div className="relative flex w-full flex-col items-center justify-between max-md:h-[252px] md:w-full md:justify-start md:gap-3 lg:w-[526px] lg:gap-3">
                <div className="relative mx-auto h-[172px] w-[196px] mix-blend-darken md:hidden">
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fill
                    className="object-cover"
                    sizes="196px"
                  />
                </div>

                <div
                  className="pointer-events-none absolute flex items-center justify-between md:hidden"
                  style={{
                    top: mobileCarousel.arrowTop,
                    left: mobileCarousel.arrowLeft,
                    width: mobileCarousel.arrowRowWidth,
                  }}
                >
                  <LearnNavArrow
                    direction="left"
                    onClick={goToPrevSlide}
                    className="pointer-events-auto flex size-6 shrink-0 items-center justify-center text-darkblack"
                  />
                  <LearnNavArrow
                    direction="right"
                    onClick={goToNextSlide}
                    className="pointer-events-auto flex size-6 shrink-0 items-center justify-center text-darkblack"
                  />
                </div>

                <div className="relative hidden w-full items-center justify-center gap-16 md:flex">
                  <LearnNavArrow
                    direction="left"
                    onClick={goToPrevSlide}
                    className="flex size-6 shrink-0 items-center justify-center text-darkblack"
                  />
                  <LearnCarouselImage
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    slot="center"
                    sizes={`${slotSpecs.center.width}px`}
                  />
                  <LearnNavArrow
                    direction="right"
                    onClick={goToNextSlide}
                    className="flex size-6 shrink-0 items-center justify-center text-darkblack"
                  />
                </div>

                <Link
                  href={activeTab.ctaHref}
                  className="btn-border-slide inline-flex h-14 items-center justify-center border-[0.8px] border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
                >
                  {activeTab.ctaLabel}
                </Link>
              </div>

              <div className="hidden shrink-0 md:block">
                <LearnCarouselImage
                  src={nextSlide.src}
                  alt=""
                  slot="right"
                  sizes={`${slotSpecs.right.width}px`}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default EducationLearnMoreSection;
