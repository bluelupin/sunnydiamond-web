"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationLearnMoreSpec,
  educationLearnTabs,
  educationPageImages,
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
      width={24}
      height={24}
      aria-hidden
      className="lg:hidden"
    />
    <Image
      src={
        direction === "left"
          ? educationPageImages.learnArrowLeft
          : educationPageImages.learnArrowRight
      }
      alt=""
      width={24}
      height={24}
      aria-hidden
      className="hidden lg:block"
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
      className="bg-white px-4 py-16 max-lg:h-[681px] lg:px-10 lg:py-[104px]"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-6 lg:gap-16">
        <div className="flex w-full flex-col items-center gap-6 lg:gap-10">
          <ScrollReveal as="h2" delayMs={0} className="w-full">
            <span
              id="education-learn-more-title"
              className="block text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
            >
              Learn more about Diamonds
            </span>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="w-full lg:max-w-[1200px]">
            <div className="w-full overflow-x-auto border-y-[0.4px] border-black/30 lg:overflow-visible">
              <div className="flex h-[75px] min-w-max items-center gap-10 px-0 py-6 lg:h-auto lg:w-full lg:min-w-0 lg:gap-0 lg:py-6">
                {educationLearnTabs.map((tab, index) => {
                  const isActive = index === activeTabIndex;

                  if (isActive) {
                    return (
                      <div key={tab.id} className="flex shrink-0 flex-col items-center lg:flex-1">
                        <button
                          type="button"
                          onClick={() => handleTabChange(index)}
                          className="border-b border-linkGold py-2 font-gill text-base font-normal leading-110 text-linkGold lg:text-[20px]"
                        >
                          {tab.label}
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(index)}
                      className="shrink-0 py-2 font-gill text-base font-normal leading-110 text-darkblack hover:text-linkGold lg:flex-1 lg:py-0 lg:text-center lg:text-[20px]"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex w-full flex-col items-center gap-[49px] lg:gap-16">
          <ScrollReveal delayMs={180}>
            <div className="max-w-[700px] text-center font-gill text-base font-light leading-110 text-darkblack lg:text-[20px] lg:text-neutral500">
              <p className="lg:hidden">{activeTab.description.join(" ")}</p>
              <div className="hidden lg:block">
                {activeTab.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={260} className="flex w-full flex-col items-center">
            <div className="relative flex w-full items-start justify-center lg:gap-[250px]">
              <div className="hidden shrink-0 lg:block">
                <LearnCarouselImage
                  src={prevSlide.src}
                  alt=""
                  slot="left"
                  sizes={`${slotSpecs.left.width}px`}
                />
              </div>

              <div className="relative flex w-full flex-col items-center justify-between max-lg:h-[252px] lg:w-[526px] lg:justify-start lg:gap-3">
                <div className="relative mx-auto h-[172px] w-[196px] mix-blend-darken lg:hidden">
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fill
                    className="object-cover"
                    sizes="196px"
                  />
                </div>

                <div
                  className="pointer-events-none absolute flex items-center justify-between lg:hidden"
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

                <div className="relative hidden w-full items-center justify-center gap-16 lg:flex">
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

              <div className="hidden shrink-0 lg:block">
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
